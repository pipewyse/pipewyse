import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { ArrowRight, FolderKanban, Plus, Sparkles, Timer, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const projectCount = projects?.length || 0

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-950 text-white p-8 shadow-2xl shadow-violet-900/20 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="bg-white/15 text-white hover:bg-white/15 rounded-full mb-4">
              Project Operations
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Projects
            </h1>

            <p className="text-violet-100 mt-3 max-w-2xl leading-relaxed">
              Manage AI-created operational workflows from first client communication to delivery.
            </p>
          </div>

          <Link href="/new-project">
            <Button className="h-12 rounded-2xl bg-white text-violet-700 hover:bg-violet-50 font-semibold px-6">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          icon={<FolderKanban className="h-5 w-5" />}
          label="Total Projects"
          value={projectCount}
          text="Active operational workflows"
        />

        <MetricCard
          icon={<Sparkles className="h-5 w-5" />}
          label="AI Generated"
          value={projectCount}
          text="Created from communication"
        />

        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Workflow Health"
          value="Good"
          text="Project continuity active"
        />
      </div>

      {projectCount > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="group rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-300 overflow-hidden cursor-pointer">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 flex items-center justify-center">
                      <FolderKanban className="h-6 w-6" />
                    </div>

                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full">
                      {project.status || "Active"}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 group-hover:text-violet-700 transition">
                      {project.name || "Untitled Project"}
                    </h2>

                    <p className="text-sm text-zinc-500 mt-2">
                      {project.company_name || "Unknown company"} • {project.project_type || "Not specified"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MiniInfo label="Client" value={project.client_name || "Unknown"} />
                    <MiniInfo label="Stage" value="Pipeline" />
                  </div>

                  <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold">Operational Progress</p>
                      <p className="text-sm font-bold text-violet-700">42%</p>
                    </div>

                    <Progress value={42} className="h-2" />

                    <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
                      <Timer className="h-3.5 w-3.5" />
                      AI-generated workflow active
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-zinc-500">
                      View project pipeline
                    </p>

                    <div className="h-9 w-9 rounded-full bg-violet-50 text-violet-700 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {projectCount === 0 && (
        <Card className="rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-3xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">
              No projects yet
            </h2>

            <p className="text-zinc-500 mt-3 max-w-xl mx-auto">
              Start by creating a new project from client communication. Workwyse will qualify it,
              generate a proposal, and create the operational pipeline.
            </p>

            <Link href="/new-project">
              <Button className="mt-8 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  text,
}: {
  icon: React.ReactNode
  label: string
  value: any
  text: string
}) {
  return (
    <Card className="rounded-[2rem] border-0 bg-white/85 backdrop-blur-xl shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="text-2xl font-extrabold tracking-tight">{value}</p>
          <p className="text-xs text-zinc-400 mt-1">{text}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-800 mt-1 truncate">
        {value}
      </p>
    </div>
  )
}