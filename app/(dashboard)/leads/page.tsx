import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function LeadsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: leads } = await supabase
    .from("intakes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Leads
        </h1>

        <p className="text-zinc-500 mt-2">
          AI-qualified opportunities created from client communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leads?.map((lead) => (
          <Link href={`/leads/${lead.id}`} key={lead.id}>
            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg">
                    {lead.company_name || "Untitled Lead"}
                  </CardTitle>

                  <Badge className="bg-violet-600">
                    {lead.lead_status || "Pending"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-zinc-500">
                  Client: {lead.client_name || "Unknown"}
                </p>

                <p className="text-sm text-zinc-500">
                  Type: {lead.project_type || "Not specified"}
                </p>

                <p className="text-sm text-zinc-500">
                  Budget: {lead.budget || "Not specified"}
                </p>

                <p className="text-sm font-medium">
                  Qualification: {lead.qualification_score || 0}%
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(!leads || leads.length === 0) && (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>No leads yet</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-zinc-500">
              Create a lead by running an AI operational intake.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}