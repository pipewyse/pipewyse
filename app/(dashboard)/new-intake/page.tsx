"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function NewIntakePage() {
  const [conversation, setConversation] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [proposal, setProposal] = useState<any>(null)
  const [proposalLoading, setProposalLoading] = useState(false)

  const [projectLoading, setProjectLoading] = useState(false)
  const [createdProject, setCreatedProject] = useState<any>(null)

  async function analyzeConversation() {
    setLoading(true)
    setResult(null)
    setProposal(null)
    setCreatedProject(null)

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    })

    const data = await response.json()

    setResult(data)
    setLoading(false)
  }

  async function generateProposal() {
    setProposalLoading(true)
    setCreatedProject(null)

    const response = await fetch("/api/generate-proposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extraction: result,
        intakeId: result.intake_id,
      }),
    })

    const data = await response.json()

    setProposal(data)
    setProposalLoading(false)
  }

  async function createProject() {
    setProjectLoading(true)

    const response = await fetch("/api/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proposal,
        extraction: result,
        intakeId: result.intake_id,
      }),
    })

    const data = await response.json()

    setCreatedProject(data)
    setProjectLoading(false)
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Operational Intake
            </h1>

            <p className="text-zinc-500 mt-2">
              Convert messy client communication into structured project operations.
            </p>
          </div>

          <Badge className="bg-violet-600">
            Core MVP Feature
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Client Communication</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder="Paste client email, WhatsApp message, Slack thread, LinkedIn conversation, or meeting notes here..."
                className="min-h-[420px] bg-white"
              />

              <Button
                onClick={analyzeConversation}
                disabled={loading || conversation.length === 0}
                className="bg-violet-600 hover:bg-violet-700 w-full"
              >
                {loading ? "Analyzing Operational Data..." : "Analyze Conversation"}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>AI Extraction Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {!result && (
                <div className="h-[420px] flex items-center justify-center text-center text-zinc-400 border rounded-xl bg-white">
                  <div>
                    <p className="font-medium">No analysis yet</p>
                    <p className="text-sm mt-1">
                      Paste a conversation and run AI analysis.
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <>
                  <Info label="Client Name" value={result.client_name} />
                  <Info label="Company" value={result.company_name} />
                  <Info label="Project Type" value={result.project_type} />
                  <Info label="Budget" value={result.budget} />
                  <Info label="Timeline" value={result.timeline} />
                  <Info label="Lead Status" value={result.lead_status} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Qualification Score</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  {result.qualification_score || 0}%
                </div>

                <Progress value={result.qualification_score || 0} />

                <p className="text-sm text-zinc-500">
                  {result.viability_summary || "No summary generated."}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>AI Confidence</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">
                  {result.confidence_score || 0}%
                </div>

                <Progress value={result.confidence_score || 0} />

                <p className="text-sm text-zinc-500">
                  Confidence is based on how much project detail was present in the communication.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Operational Status</CardTitle>
              </CardHeader>

              <CardContent>
                <Badge className="bg-violet-600 text-base px-4 py-2">
                  {result.lead_status || "Pending Review"}
                </Badge>

                <p className="text-sm text-zinc-500 mt-4">
                  Pipewyse recommends whether this lead is ready for proposal or needs clarification first.
                </p>

                <Button
                  onClick={generateProposal}
                  disabled={proposalLoading}
                  className="bg-violet-600 hover:bg-violet-700 mt-6 w-full"
                >
                  {proposalLoading ? "Generating Proposal..." : "Generate Proposal"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListCard title="Deliverables" items={result.deliverables} />
            <ListCard title="Requirements" items={result.requirements} />
            <ListCard title="Risks" items={result.risks} />
            <ListCard title="Missing Information" items={result.missing_information} />
            <ListCard title="Recommended Next Steps" items={result.recommended_next_steps} />
            <ListCard title="Discovery Questions" items={result.discovery_questions} />
          </div>
        )}

        {proposal && (
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>AI Generated Proposal</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <Info label="Project Title" value={proposal.project_title} />
              <Info label="Project Summary" value={proposal.project_summary} />
              <Info label="Timeline" value={proposal.timeline} />
              <Info label="Pricing" value={proposal.pricing} />

              <ListCard title="Scope of Work" items={proposal.scope_of_work} />
              <ListCard title="Deliverables" items={proposal.deliverables} />
              <ListCard title="Milestones" items={proposal.milestones} />
              <ListCard title="Payment Terms" items={proposal.payment_terms} />

              <Info label="Revision Policy" value={proposal.revision_policy} />

              <ListCard title="Assumptions" items={proposal.assumptions} />
              <ListCard title="Proposal Risks" items={proposal.risks} />

              <Button
                onClick={createProject}
                disabled={projectLoading}
                className="bg-violet-600 hover:bg-violet-700 w-full"
              >
                {projectLoading ? "Creating Project Pipeline..." : "Convert to Project"}
              </Button>
            </CardContent>
          </Card>
        )}

        {createdProject && (
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Project Created</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-zinc-600">
                Pipewyse has created an operational project pipeline from this proposal.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="font-medium mt-1">{value || "Not detected"}</p>
    </div>
  )
}

function ListCard({ title, items }: { title: string; items: any }) {
  function renderItem(item: any) {
    if (typeof item === "string") {
      return item
    }

    if (typeof item === "object" && item !== null) {
      return Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ")
    }

    return String(item)
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {Array.isArray(items) && items.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {items.map((item, index) => (
              <li key={index}>{renderItem(item)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">None detected</p>
        )}
      </CardContent>
    </Card>
  )
}