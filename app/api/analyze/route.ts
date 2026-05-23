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

    const conversation = body.conversation

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are an AI operational assistant for digital design agencies.

Analyze client communication and extract structured operational information.

Return ONLY valid JSON.

Return this exact structure:

{
  "client_name": "",
  "company_name": "",
  "project_type": "",
  "budget": "",
  "timeline": "",
  "deliverables": [],
  "requirements": [],
  "risks": [],
  "missing_information": [],
  "qualification_score": 0,
  "confidence_score": 0,
  "lead_status": "",
  "viability_summary": "",
  "recommended_next_steps": [],
  "discovery_questions": []
}

Rules:
- qualification_score must be from 0 to 100
- confidence_score must be from 0 to 100
- lead_status must be one of:
  "Qualified",
  "Needs Clarification",
  "Low Fit"
`,
        },

        {
          role: "user",
          content: conversation,
        },
      ],
    })

    const result = completion.choices[0].message.content

    const parsedResult = JSON.parse(result || "{}")

    const { data: savedIntake, error: saveError } = await supabase
      .from("intakes")
      .insert({
        user_id: user.id,
        raw_conversation: conversation,
        client_name: parsedResult.client_name,
        company_name: parsedResult.company_name,
        project_type: parsedResult.project_type,
        budget: parsedResult.budget,
        timeline: parsedResult.timeline,
        qualification_score: parsedResult.qualification_score,
        confidence_score: parsedResult.confidence_score,
        lead_status: parsedResult.lead_status,
        extraction: parsedResult,
      })
      .select("id")
      .single()

    if (saveError) {
      console.error("Supabase save error:", saveError)

      return NextResponse.json(
        { error: saveError.message },
        { status: 500 }
      )
    }

    parsedResult.intake_id = savedIntake.id

    return NextResponse.json(parsedResult)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}