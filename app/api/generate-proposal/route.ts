import { createClient } from "@/lib/supabase-server"
import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const extraction = body.extraction
    const intakeId = body.intakeId

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
You are an AI proposal generation assistant for digital design agencies.

Generate a professional project proposal.

Return ONLY valid JSON.

Return this exact structure:

{
  "project_title": "",
  "project_summary": "",
  "scope_of_work": [],
  "deliverables": [],
  "timeline": "",
  "milestones": [],
  "pricing": "",
  "payment_terms": [],
  "revision_policy": "",
  "assumptions": [],
  "risks": []
}

Rules:
- Make the proposal realistic for a professional design agency
- Pricing should align with project complexity
- Milestones should be operationally practical
- Revision policy should protect agency scope
`,
        },
        {
          role: "user",
          content: JSON.stringify(extraction),
        },
      ],
    })

    const result = completion.choices[0].message.content
    const parsedProposal = JSON.parse(result || "{}")

    if (intakeId) {
      const { error } = await supabase
        .from("intakes")
        .update({
          proposal: parsedProposal,
        })
        .eq("id", intakeId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Proposal save error:", error)
      }
    }

    return NextResponse.json(parsedProposal)
  } catch (error) {
    console.error("Proposal generation failed:", error)

    return NextResponse.json(
      { error: "Proposal generation failed" },
      { status: 500 }
    )
  }
}