import { createClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock,
  CreditCard,
  FileSignature,
  FileText,
  MessageSquare,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Sparkles,
  Users,
} from "lucide-react"
import Link from "next/link"

const lifecycleStages = [
  "Communication",
  "Qualification",
  "Proposal",
  "Contract",
  "Payment",
  "Execution",
  "Delivery",
]

const currentStage = "Execution"

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ stage?: string }>
}) {
  const { id } = await params
  const { stage } = await searchParams
  const currentStage = stage || "Execution"
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  const { data: tasks } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", id)
    .eq("user_id", user?.id)

  const projectTasks = tasks || []

  const completedTasks = projectTasks.filter(
    (task) => task.status === "Done" || task.status === "Completed"
  ).length

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks / projectTasks.length) * 100)
      : 0

  return (
    <div className="space-y-8">
      <div className="rounded-[2.2rem] bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-700 text-white shadow-2xl shadow-violet-950/20 overflow-hidden relative">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative p-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-violet-100 hover:text-white transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge className="bg-white/15 text-white hover:bg-white/15 rounded-full mb-4">
                {currentStage} Stage
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight max-w-3xl">
                {project?.name || "Project"}
              </h1>

              <p className="text-violet-100 mt-4 max-w-2xl leading-relaxed">
                {project?.company_name || "Unknown company"} •{" "}
                {project?.project_type || "Unknown project type"}
              </p>
            </div>

            <Button className="rounded-2xl bg-white text-violet-700 hover:bg-violet-50">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <HeroMetric
              icon={<Users className="h-4 w-4" />}
              label="Client"
              value={project?.client_name || "Not specified"}
            />

            <HeroMetric
              icon={<FileText className="h-4 w-4" />}
              label="Project Type"
              value={project?.project_type || "Not specified"}
            />

            <HeroMetric
              icon={<CalendarDays className="h-4 w-4" />}
              label="Timeline"
              value={project?.proposal?.timeline || "Not specified"}
            />

            <div className="rounded-3xl bg-white/10 border border-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs text-violet-100 mb-3">Execution Progress</p>
              <div className="flex items-center gap-3">
                <Progress value={progress} className="h-2 bg-white/20" />
                <span className="text-sm font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LifecyclePipeline currentStage={currentStage} projectId={id} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <SummaryCard title="Project Value" value={project?.proposal?.pricing || "Not specified"} />
        <SummaryCard title="Current Stage" value={currentStage} />
        <SummaryCard title="Activities" value={String(projectTasks.length)} />
        <SummaryCard title="AI Health" value="Stable" accent />
      </div>

      <StageWorkspace
        project={project}
        tasks={projectTasks}
        currentStage={currentStage}
      />
    </div>
  )
}

function LifecyclePipeline({
  currentStage,
  projectId,
}: {
  currentStage: string
  projectId: string
}) {
  const currentIndex = lifecycleStages.indexOf(currentStage)

  return (
    <Card className="rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center overflow-x-auto">
          {lifecycleStages.map((stage, index) => {
            const completed = index < currentIndex
            const active = index === currentIndex

            return (
              <div key={stage} className="flex items-center flex-1 min-w-[170px]">
                <Link
                  href={`/projects/${projectId}?stage=${stage}`}
                  className="flex flex-col items-center group"
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center font-bold shadow-sm transition ${completed
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-900/25"
                          : "bg-zinc-100 text-zinc-400 group-hover:bg-violet-100 group-hover:text-violet-700"
                      }`}
                  >
                    {completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>

                  <p
                    className={`text-xs font-semibold mt-2 text-center transition ${active
                        ? "text-violet-700"
                        : completed
                          ? "text-emerald-700"
                          : "text-zinc-400 group-hover:text-violet-700"
                      }`}
                  >
                    {stage}
                  </p>
                </Link>

                {index < lifecycleStages.length - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-4 ${index < currentIndex
                        ? "bg-gradient-to-r from-emerald-500 to-violet-600"
                        : "bg-zinc-200"
                      }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function StageWorkspace({
  project,
  tasks,
  currentStage,
}: {
  project: any
  tasks: any[]
  currentStage: string
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {currentStage} Workspace
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Current operational stage for this project.
            </p>
          </div>

          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 rounded-full">
            Active Stage
          </Badge>
        </div>

        <CardContent className="p-6">
          {currentStage === "Communication" && (
            <StageEmpty
              icon={<MessageSquare className="h-6 w-6" />}
              title="Client Communication"
              text="This stage stores the original client communication and project context."
            />
          )}

          {currentStage === "Qualification" && (
            <StageEmpty
              icon={<Sparkles className="h-6 w-6" />}
              title="Qualification"
              text="This stage reviews project fit, missing information, risks, and opportunity quality."
            />
          )}

          {currentStage === "Proposal" && (
            <ProposalStage project={project} />
          )}

          {currentStage === "Contract" && (
            <StageEmpty
              icon={<FileSignature className="h-6 w-6" />}
              title="Contract"
              text="Contract generation and approval will live here."
            />
          )}

          {currentStage === "Payment" && (
            <StageEmpty
              icon={<CreditCard className="h-6 w-6" />}
              title="Payment"
              text="Deposit, invoice, and payment tracking will live here."
            />
          )}

          {currentStage === "Execution" && (
            <ExecutionStage tasks={tasks} />
          )}

          {currentStage === "Delivery" && (
            <StageEmpty
              icon={<PackageCheck className="h-6 w-6" />}
              title="Delivery"
              text="Final delivery, files, approvals, and completion will live here."
            />
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-0 bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Operational Insight
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-violet-100 leading-relaxed">
              Workwyse keeps the project moving through one connected lifecycle,
              instead of splitting communication, proposal, and execution into separate tools.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>Stage Health</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <HealthRow label="Continuity" value="Connected" />
            <HealthRow label="Scope" value="Controlled" />
            <HealthRow label="Risk" value="Low" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ExecutionStage({ tasks }: { tasks: any[] }) {
  const phases = [...new Set(tasks.map((task) => task.phase))]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-extrabold tracking-tight">
          Execution Activities
        </h3>

        <p className="text-sm text-zinc-500 mt-1">
          Tasks generated from the proposal belong inside the execution stage.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {phases.map((phase, index) => {
          const phaseTasks = tasks.filter((task) => task.phase === phase)

          return (
            <div key={phase} className="rounded-[2rem] bg-zinc-50 border p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold">{phase}</h4>
                <Badge variant="secondary">{phaseTasks.length}</Badge>
              </div>

              <div className="space-y-3">
                {phaseTasks.map((task) => (
                  <div key={task.id} className="rounded-2xl bg-white border p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{task.title}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                    </div>

                    <Badge variant="secondary" className="rounded-full mt-4">
                      {task.status || "To Do"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {tasks.length === 0 && (
        <StageEmpty
          icon={<CircleDot className="h-6 w-6" />}
          title="No execution activities yet"
          text="Activities will appear here once this project has generated tasks."
        />
      )}
    </div>
  )
}

function ProposalStage({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-zinc-50 p-6">
        <h3 className="text-xl font-bold">
          {project?.proposal?.project_title || "Project Proposal"}
        </h3>

        <p className="text-sm text-zinc-600 mt-3 leading-relaxed">
          {project?.proposal?.project_summary || "No proposal summary available."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoBlock title="Timeline" value={project?.proposal?.timeline} />
        <InfoBlock title="Pricing" value={project?.proposal?.pricing} />
        <InfoBlock title="Revision Policy" value={project?.proposal?.revision_policy} />
      </div>
    </div>
  )
}

function StageEmpty({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-[2rem] border border-dashed bg-zinc-50 p-12 text-center">
      <div className="h-14 w-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">{text}</p>
    </div>
  )
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl bg-white/10 border border-white/10 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-violet-100">
        {icon}
        <p className="text-xs">{label}</p>
      </div>

      <p className="mt-3 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  accent,
}: {
  title: string
  value: string
  accent?: boolean
}) {
  return (
    <Card className={`rounded-[2rem] border-0 shadow-sm ${accent ? "bg-emerald-50" : "bg-white/85 backdrop-blur-xl"}`}>
      <CardContent className="p-6">
        <p className="text-sm text-zinc-500">{title}</p>
        <p className="text-2xl font-extrabold mt-2">{value}</p>
      </CardContent>
    </Card>
  )
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-semibold text-emerald-600">{value}</span>
    </div>
  )
}

function InfoBlock({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl border bg-zinc-50 p-5">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="font-semibold mt-2">{value || "Not specified"}</p>
    </div>
  )
}