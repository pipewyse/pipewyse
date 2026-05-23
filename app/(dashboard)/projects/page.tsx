import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Projects
        </h1>

        <p className="text-zinc-500 mt-2">
          Real project pipelines created from AI-generated proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg">
                    {project.name}
                  </CardTitle>

                  <Badge className="bg-violet-600">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-zinc-500">
                  Client: {project.client_name || "Unknown"}
                </p>

                <p className="text-sm text-zinc-500">
                  Company: {project.company_name || "Unknown"}
                </p>

                <p className="text-sm text-zinc-500">
                  Type: {project.project_type || "Not specified"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>No projects yet</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-zinc-500">
              Create a project by analyzing a client conversation, generating a proposal, and converting it into a project pipeline.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}