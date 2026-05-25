"use client"

import { useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileSignature,
  MessageSquare,
  PackageCheck,
  PenSquare,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stages = [
  "Communication",
  "Qualification",
  "Proposal",
  "Contract",
  "Payment",
  "Execution",
  "Delivery",
]

export default function NewProjectPage() {
  const [stage, setStage] = useState("Communication")
  const [sourceType, setSourceType] = useState("Import Conversation")

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
    setStage("Qualification")
    setLoading(false)
  }

  async function generateProposal() {
    setProposalLoading(true)

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
    setStage("Proposal")
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
    setStage("Execution")
    setProjectLoading(false)
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-700 p-9 text-white shadow-2xl shadow-violet-950/20">
        <div className="absolute -top-24 right-10 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-5 rounded-full bg-white/15 text-white hover:bg-white/15">
              New Project Workflow
            </Badge>

            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight leading-tight">
              Create a project from client communication.
            </h1>

            <p className="mt-5 max-w-2xl text-violet-100 leading-relaxed">
              Start from a conversation, brief, or manual entry. Pipewyse qualifies the opportunity,
              generates a proposal, and creates the operational project pipeline.
            </p>
          </div>

          <Button
            onClick={() => {
              setStage("Communication")
              setResult(null)
              setProposal(null)
              setCreatedProject(null)
              setConversation("")
            }}
            className="h-12 rounded-2xl bg-white text-violet-700 hover:bg-violet-50 font-bold px-6"
          >
            Reset Flow
          </Button>
        </div>

        <div className="relative mt-10 rounded-[2rem] bg-white/10 border border-white/10 p-5 backdrop-blur-xl">
          <PipelineProgress currentStage={stage} setStage={setStage} />
        </div>
      </div>

      {stage === "Communication" && (
        <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  How would you like to start?
                </h2>

                <p className="text-zinc-500 mt-2">
                  Choose the best way to capture the project context.
                </p>
              </div>

              <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">
                Communication
              </Badge>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <StartCard
                icon={<MessageSquare className="h-7 w-7" />}
                title="Import Conversation"
                text="Import or paste client communication from Email, WhatsApp, Slack, LinkedIn, website forms, or other channels."
                active={sourceType === "Import Conversation"}
                onClick={() => setSourceType("Import Conversation")}
              >
                <ImportConversationBox
                  conversation={conversation}
                  setConversation={setConversation}
                />
              </StartCard>

              <StartCard
                icon={<UploadCloud className="h-7 w-7" />}
                title="Upload Brief / Notes"
                text="Upload a project brief, discovery document, transcript, or meeting notes. For now, paste the uploaded content below."
                active={sourceType === "Upload Brief"}
                onClick={() => setSourceType("Upload Brief")}
              >
                <UploadBriefBox
                  conversation={conversation}
                  setConversation={setConversation}
                />
              </StartCard>

              <StartCard
                icon={<PenSquare className="h-7 w-7" />}
                title="Enter Manually"
                text="Fill in project details directly. Pipewyse will use the information to qualify the project."
                active={sourceType === "Enter Manually"}
                onClick={() => setSourceType("Enter Manually")}
              >
                <ManualEntryBox setConversation={setConversation} />
              </StartCard>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                onClick={analyzeConversation}
                disabled={loading || conversation.trim().length === 0}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 font-bold shadow-lg shadow-violet-900/20"
              >
                {loading ? "Analyzing Project..." : "Begin Qualification"}
                {!loading && <WandSparkles className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === "Qualification" && (
        <>
          {!result ? (
            <LockedStage
              icon={<Sparkles className="h-7 w-7" />}
              title="Qualification is not ready yet"
              text="Add communication first, then click Begin Qualification."
              buttonText="Go to Communication"
              onClick={() => setStage("Communication")}
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6">
              <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
                <CardContent className="p-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-900/20">
                      <Sparkles className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight">
                        Qualification
                      </h2>
                      <p className="text-sm text-zinc-500">
                        AI extracted and qualified this project.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ResultRow label="Client" value={result.client_name} />
                    <ResultRow label="Company" value={result.company_name} />
                    <ResultRow label="Project Type" value={result.project_type} />
                    <ResultRow label="Budget" value={result.budget} />
                    <ResultRow label="Timeline" value={result.timeline} />
                  </div>

                  <div className="rounded-3xl border bg-gradient-to-br from-violet-50 to-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold">Qualification Score</p>
                      <p className="font-extrabold text-violet-700">
                        {result.qualification_score || 0}%
                      </p>
                    </div>

                    <Progress value={result.qualification_score || 0} />
                  </div>

                  <Button
                    onClick={generateProposal}
                    disabled={proposalLoading}
                    className="w-full h-14 rounded-2xl bg-zinc-950 hover:bg-zinc-800 font-bold shadow-lg"
                  >
                    {proposalLoading ? "Generating Proposal..." : "Generate Proposal"}
                    {!proposalLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListCard title="Deliverables" items={result.deliverables} />
                <ListCard title="Requirements" items={result.requirements} />
                <ListCard title="Risks" items={result.risks} />
                <ListCard title="Missing Information" items={result.missing_information} />
                <ListCard title="Recommended Next Steps" items={result.recommended_next_steps} />
                <ListCard title="Discovery Questions" items={result.discovery_questions} />
              </div>
            </div>
          )}
        </>
      )}

      {stage === "Proposal" && (
        <>
          {!proposal ? (
            <LockedStage
              icon={<FileSignature className="h-7 w-7" />}
              title="Proposal is not ready yet"
              text="Complete qualification first, then generate a proposal."
              buttonText="Go to Qualification"
              onClick={() => setStage("Qualification")}
            />
          ) : (
            <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl overflow-hidden">
              <div className="border-b border-zinc-100 p-8 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight">
                    Proposal
                  </h2>

                  <p className="text-zinc-500 mt-2">
                    Review the AI-generated proposal before creating the project pipeline.
                  </p>
                </div>

                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full">
                  Proposal Ready
                </Badge>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="rounded-[2rem] border bg-gradient-to-br from-zinc-50 to-violet-50/60 p-7">
                  <h3 className="font-extrabold text-2xl tracking-tight mb-3">
                    {proposal.project_title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {proposal.project_summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ListCard title="Scope of Work" items={proposal.scope_of_work} />
                  <ListCard title="Deliverables" items={proposal.deliverables} />
                  <ListCard title="Milestones" items={proposal.milestones} />
                  <ListCard title="Payment Terms" items={proposal.payment_terms} />
                  <ListCard title="Assumptions" items={proposal.assumptions} />
                  <ListCard title="Risks" items={proposal.risks} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoBlock title="Timeline" value={proposal.timeline} />
                  <InfoBlock title="Pricing" value={proposal.pricing} />
                  <InfoBlock title="Revision Policy" value={proposal.revision_policy} />
                </div>

                <Button
                  onClick={createProject}
                  disabled={projectLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-base font-bold shadow-lg shadow-violet-900/20"
                >
                  {projectLoading ? "Creating Project Pipeline..." : "Create Project Pipeline"}
                  {!projectLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {stage === "Contract" && (
        <PlaceholderStage
          icon={<FileSignature className="h-7 w-7" />}
          title="Contract"
          text="Contract generation and e-signature support will live here. For the MVP, this stage is visible but not active yet."
        />
      )}

      {stage === "Payment" && (
        <PlaceholderStage
          icon={<CreditCard className="h-7 w-7" />}
          title="Payment"
          text="Deposit tracking, invoices, and Stripe payment workflows will live here later."
        />
      )}

      {stage === "Execution" && (
        <>
          {!createdProject ? (
            <LockedStage
              icon={<CheckCircle2 className="h-7 w-7" />}
              title="Execution is not ready yet"
              text="Create the project pipeline from the proposal first."
              buttonText="Go to Proposal"
              onClick={() => setStage("Proposal")}
            />
          ) : (
            <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                      Project Pipeline Created
                    </h2>

                    <p className="text-zinc-500 mt-1">
                      Pipewyse generated the operational project workflow successfully.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {createdProject.workflow?.phases?.map((phase: any, index: number) => (
                    <div key={index} className="rounded-[2rem] bg-zinc-50 border p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold">{phase.name}</h3>
                        <Badge variant="secondary">{phase.tasks?.length || 0}</Badge>
                      </div>

                      <div className="space-y-3">
                        {phase.tasks?.map((task: any, taskIndex: number) => (
                          <div key={taskIndex} className="rounded-2xl bg-white border p-4 shadow-sm">
                            <p className="text-sm font-bold">{task.title}</p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {task.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {stage === "Delivery" && (
        <PlaceholderStage
          icon={<PackageCheck className="h-7 w-7" />}
          title="Delivery"
          text="Final handoff, approvals, revision status, and delivery archive will live here."
        />
      )}
    </div>
  )
}

function PipelineProgress({
  currentStage,
  setStage,
}: {
  currentStage: string
  setStage: (stage: string) => void
}) {
  const currentIndex = stages.indexOf(currentStage)

  return (
    <div className="flex items-center overflow-x-auto">
      {stages.map((stageName, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex

        return (
          <div key={stageName} className="flex items-center flex-1 min-w-[160px]">
            <button
              type="button"
              onClick={() => setStage(stageName)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-extrabold transition ${
                  completed
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-white text-violet-700"
                    : "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white"
                }`}
              >
                {completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
              </div>

              <p
                className={`text-xs mt-2 font-bold transition ${
                  active || completed
                    ? "text-white"
                    : "text-white/50 group-hover:text-white"
                }`}
              >
                {stageName}
              </p>
            </button>

            {index < stages.length - 1 && (
              <div
                className={`h-[3px] flex-1 mx-4 rounded-full ${
                  index < currentIndex ? "bg-emerald-400" : "bg-white/15"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PlaceholderStage({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
      <CardContent className="p-12 text-center">
        <div className="h-16 w-16 rounded-3xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight">
          {title}
        </h2>

        <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
          {text}
        </p>
      </CardContent>
    </Card>
  )
}

function StartCard({
  icon,
  title,
  text,
  active,
  onClick,
  children,
}: {
  icon: React.ReactNode
  title: string
  text: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[2rem] border text-left transition-all duration-300 ${
        active
          ? "border-violet-500 bg-white shadow-2xl shadow-violet-900/15"
          : "border-zinc-200 bg-white/80 hover:border-violet-300 hover:shadow-xl"
      }`}
    >
      {active && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
      )}

      <div className="p-7">
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
              active
                ? "bg-violet-100 text-violet-700"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {icon}
          </div>

          {active && (
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 rounded-full">
              Selected
            </Badge>
          )}
        </div>

        <PreviewGraphic title={title} />

        <h3 className="text-2xl font-extrabold tracking-tight mt-7 mb-3">
          {title}
        </h3>

        <p className="text-zinc-500 leading-relaxed text-sm mb-6">
          {text}
        </p>

        {active && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-[1.5rem] border bg-zinc-50 p-4"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

function PreviewGraphic({ title }: { title: string }) {
  return (
    <div className="h-[180px] rounded-[1.5rem] border bg-gradient-to-br from-zinc-50 to-violet-50/60 p-5 overflow-hidden">
      {title === "Import Conversation" && (
        <div className="relative h-full">
          <div className="absolute left-2 top-2 rounded-full bg-white border shadow-sm px-3 py-2 text-xs font-bold">
            Email
          </div>

          <div className="absolute right-4 top-5 rounded-full bg-white border shadow-sm px-3 py-2 text-xs font-bold">
            WhatsApp
          </div>

          <div className="absolute left-8 top-16 rounded-2xl bg-white p-4 shadow-sm border w-[190px]">
            <div className="h-3 w-24 rounded-full bg-zinc-200 mb-3" />
            <div className="h-3 w-32 rounded-full bg-zinc-100" />
          </div>

          <div className="absolute bottom-4 right-4 rounded-2xl bg-emerald-100 p-4 w-[190px]">
            <div className="h-3 w-24 rounded-full bg-emerald-200 mb-3" />
            <div className="h-3 w-32 rounded-full bg-emerald-200" />
          </div>
        </div>
      )}

      {title === "Upload Brief / Notes" && (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="mb-4 h-20 w-20 rounded-3xl bg-white shadow-sm border flex items-center justify-center text-violet-700">
            <UploadCloud className="h-10 w-10" />
          </div>

          <p className="text-sm font-bold">Upload brief</p>
          <p className="text-xs text-zinc-500 mt-1">PDF, DOCX, TXT, notes</p>
        </div>
      )}

      {title === "Enter Manually" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-3">
            <div className="h-3 w-20 rounded-full bg-zinc-200 mb-2" />
            <div className="h-8 rounded-lg bg-zinc-100" />
          </div>

          <div className="rounded-xl border bg-white p-3">
            <div className="h-3 w-24 rounded-full bg-zinc-200 mb-2" />
            <div className="h-8 rounded-lg bg-zinc-100" />
          </div>

          <div className="rounded-xl border bg-white p-3">
            <div className="h-3 w-28 rounded-full bg-zinc-200 mb-2" />
            <div className="h-8 rounded-lg bg-zinc-100" />
          </div>
        </div>
      )}
    </div>
  )
}

function ImportConversationBox({
  conversation,
  setConversation,
}: {
  conversation: string
  setConversation: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {["Email", "WhatsApp", "Slack", "LinkedIn", "Website Form", "Other"].map((item) => (
          <div
            key={item}
            className="rounded-xl border bg-white px-3 py-2 text-xs font-bold text-zinc-700"
          >
            {item}
          </div>
        ))}
      </div>

      <Textarea
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
        placeholder="Paste imported conversation here for now..."
        className="min-h-[180px] rounded-2xl bg-white"
      />
    </div>
  )
}

function UploadBriefBox({
  conversation,
  setConversation,
}: {
  conversation: string
  setConversation: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed bg-white p-6 text-center">
        <UploadCloud className="h-8 w-8 text-violet-600 mx-auto mb-2" />
        <p className="text-sm font-bold">Upload coming soon</p>
        <p className="text-xs text-zinc-500 mt-1">
          Paste brief content below for MVP.
        </p>
      </div>

      <Textarea
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
        placeholder="Paste project brief, notes, or transcript here..."
        className="min-h-[180px] rounded-2xl bg-white"
      />
    </div>
  )
}

function ManualEntryBox({
  setConversation,
}: {
  setConversation: (value: string) => void
}) {
  const [client, setClient] = useState("")
  const [company, setCompany] = useState("")
  const [project, setProject] = useState("")
  const [budget, setBudget] = useState("")
  const [timeline, setTimeline] = useState("")
  const [note, setNote] = useState("")

  function updateConversation(
    nextClient = client,
    nextCompany = company,
    nextProject = project,
    nextBudget = budget,
    nextTimeline = timeline,
    nextNote = note
  ) {
    setConversation(`
Client: ${nextClient}
Company: ${nextCompany}
Project: ${nextProject}
Budget: ${nextBudget}
Timeline: ${nextTimeline}
Additional Notes: ${nextNote}
`)
  }

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Client name"
        value={client}
        onChange={(e) => {
          setClient(e.target.value)
          updateConversation(e.target.value, company, project, budget, timeline, note)
        }}
      />

      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Company"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value)
          updateConversation(client, e.target.value, project, budget, timeline, note)
        }}
      />

      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Project type"
        value={project}
        onChange={(e) => {
          setProject(e.target.value)
          updateConversation(client, company, e.target.value, budget, timeline, note)
        }}
      />

      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Budget"
        value={budget}
        onChange={(e) => {
          setBudget(e.target.value)
          updateConversation(client, company, project, e.target.value, timeline, note)
        }}
      />

      <input
        className="w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Timeline"
        value={timeline}
        onChange={(e) => {
          setTimeline(e.target.value)
          updateConversation(client, company, project, budget, e.target.value, note)
        }}
      />

      <textarea
        className="min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm"
        placeholder="Additional notes, requirements, concerns, client preferences, or project context..."
        value={note}
        onChange={(e) => {
          setNote(e.target.value)
          updateConversation(client, company, project, budget, timeline, e.target.value)
        }}
      />
    </div>
  )
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-zinc-50/70 px-4 py-3">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="text-sm font-bold text-zinc-900">
        {value || "Not specified"}
      </p>
    </div>
  )
}

function ListCard({ title, items }: { title: string; items: any }) {
  function renderItem(item: any) {
    if (typeof item === "string") return item

    if (typeof item === "object" && item !== null) {
      return Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ")
    }

    return String(item)
  }

  return (
    <div className="rounded-[2rem] border bg-white/85 p-5 shadow-sm backdrop-blur-xl">
      <h3 className="font-extrabold tracking-tight mb-4">{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl bg-zinc-50 border px-4 py-3 text-sm text-zinc-700">
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No data</p>
      )}
    </div>
  )
}

function InfoBlock({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-[2rem] border bg-zinc-50 p-5">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="font-extrabold mt-2">{value || "Not specified"}</p>
    </div>
  )
}

function LockedStage({
  icon,
  title,
  text,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  text: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <Card className="rounded-[2.3rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
      <CardContent className="p-12 text-center">
        <div className="h-16 w-16 rounded-3xl bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight">
          {title}
        </h2>

        <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
          {text}
        </p>

        <Button
          onClick={onClick}
          className="mt-8 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 px-6 font-bold"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}