import { createClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const phases = [...new Set(tasks?.map((task) => task.phase))]

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {project?.name || "Project"}
          </h1>

          <p className="text-zinc-500 mt-2">
            {project?.company_name || "Unknown company"} • {project?.project_type || "Unknown type"}
          </p>
        </div>

        <Badge className="bg-violet-600">
          {project?.status || "Active"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard title="Client" value={project?.client_name} />
        <InfoCard title="Company" value={project?.company_name} />
        <InfoCard title="Project Type" value={project?.project_type} />
      </div>

      <Card className="rounded-2xl border-0 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Proposal Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-600">
            {project?.proposal?.project_summary || "No proposal summary available."}
          </p>

          <p className="text-sm">
            <span className="font-medium">Pricing:</span>{" "}
            {project?.proposal?.pricing || "Not specified"}
          </p>

          <p className="text-sm">
            <span className="font-medium">Timeline:</span>{" "}
            {project?.proposal?.timeline || "Not specified"}
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Operational Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {phases.map((phase) => (
            <div key={phase} className="bg-zinc-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{phase}</h3>

                <Badge variant="secondary">
                  {tasks?.filter((task) => task.phase === phase).length}
                </Badge>
              </div>

              <div className="space-y-4">
                {tasks
                  ?.filter((task) => task.phase === phase)
                  .map((task) => (
                    <Card key={task.id} className="rounded-xl border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          {task.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <p className="text-xs text-zinc-500">
                          {task.description}
                        </p>

                        <Badge variant="secondary">
                          {task.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {(!tasks || tasks.length === 0) && (
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>No tasks found</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-zinc-500">
                This project does not have generated tasks yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function InfoCard({ title, value }: { title: string; value: any }) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-500">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="font-medium">
          {value || "Not specified"}
        </p>
      </CardContent>
    </Card>
  )
}