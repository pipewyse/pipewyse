import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  FolderKanban,
  Plus,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(4)

  const { data: leads } = await supabase
    .from("intakes")
    .select("*")
    .eq("user_id", user?.id)

  const projectCount = projects?.length || 0
  const leadCount = leads?.length || 0

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-700 p-10 text-white shadow-2xl shadow-violet-950/20">
        <div className="absolute -top-24 right-10 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-5 rounded-full bg-white/15 text-white hover:bg-white/15">
              AI Operational Infrastructure
            </Badge>

            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight leading-tight">
              Turn client communication into live project operations.
            </h1>

            <p className="mt-5 max-w-2xl text-violet-100 leading-relaxed">
              Pipewyse helps design service companies move from conversation to qualification,
              proposal, execution, and delivery in one connected workflow.
            </p>
          </div>

          <Link href="/new-project">
            <Button className="h-14 rounded-2xl bg-white px-7 text-violet-700 hover:bg-violet-50 font-bold">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <MetricCard icon={<FolderKanban />} label="Projects" value={projectCount} />
        <MetricCard icon={<Workflow />} label="Operational Leads" value={leadCount} />
        <MetricCard icon={<Sparkles />} label="AI Workflows" value={projectCount} />
        <MetricCard icon={<TrendingUp />} label="Health" value="Good" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2.2rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
          <CardContent className="p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Recent Projects
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Your latest operational workflows.
                </p>
              </div>

              <Link href="/projects">
                <Button variant="outline" className="rounded-2xl">
                  View all
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {projects?.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div className="group rounded-3xl border bg-zinc-50/70 p-5 transition hover:bg-white hover:shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold tracking-tight group-hover:text-violet-700 transition">
                          {project.name || "Untitled Project"}
                        </h3>
                        <p className="text-sm text-zinc-500 mt-1">
                          {project.company_name || "Unknown company"} • {project.project_type || "Project"}
                        </p>
                      </div>

                      <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {(!projects || projects.length === 0) && (
                <div className="rounded-3xl border border-dashed bg-zinc-50 p-10 text-center">
                  <Sparkles className="mx-auto mb-4 h-8 w-8 text-violet-600" />
                  <p className="font-bold">No projects yet</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Create your first AI operational project.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.2rem] border-0 bg-gradient-to-br from-white to-violet-50 shadow-sm">
          <CardContent className="p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-900/20">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Operational Flow
                </h2>
                <p className="text-sm text-zinc-500">
                  Connected project lifecycle
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {["Communication", "Qualification", "Proposal", "Execution", "Delivery"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="font-bold">{item}</p>
                      <Progress value={(index + 1) * 18} className="mt-2 h-1.5" />
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: any
}) {
  return (
    <Card className="rounded-[2rem] border-0 bg-white/85 shadow-sm backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="mb-5 h-12 w-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
          {icon}
        </div>

        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}