import OpenAI from "openai"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

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

    const proposal = body.proposal
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
You are an AI operational planning assistant.

Generate structured project execution phases and tasks.

Return ONLY valid JSON.

Return this structure:

{
  "project_name": "",
  "phases": [
    {
      "name": "",
      "tasks": [
        {
          "title": "",
          "description": "",
          "due_date": ""
        }
      ]
    }
  ]
}
`,
        },

        {
          role: "user",
          content: JSON.stringify({
            proposal,
            extraction,
          }),
        },
      ],
    })

    const result = completion.choices[0].message.content

    const parsed = JSON.parse(result || "{}")

    const { data: project } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        intake_id: intakeId,
        name: parsed.project_name,
        client_name: extraction.client_name,
        company_name: extraction.company_name,
        project_type: extraction.project_type,
        proposal,
      })
      .select()
      .single()

    for (const phase of parsed.phases || []) {
      for (const task of phase.tasks || []) {
        await supabase.from("project_tasks").insert({
          user_id: user.id,
          project_id: project?.id,
          title: task.title,
          description: task.description,
          due_date: task.due_date,
          phase: phase.name,
        })
      }
    }

    return NextResponse.json({
      success: true,
      project,
      workflow: parsed,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Project creation failed" },
      { status: 500 }
    )
  }
}