import { createClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: lead } = await supabase
    .from("intakes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single()

  const extraction = lead?.extraction || {}

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lead?.company_name || "Lead Detail"}
          </h1>

          <p className="text-zinc-500 mt-2">
            {lead?.client_name || "Unknown client"} • {lead?.project_type || "Unknown project type"}
          </p>
        </div>

        <Badge className="bg-violet-600">
          {lead?.lead_status || "Pending"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard title="Client" value={lead?.client_name} />
        <InfoCard title="Company" value={lead?.company_name} />
        <InfoCard title="Project Type" value={lead?.project_type} />
        <InfoCard title="Budget" value={lead?.budget} />
        <InfoCard title="Timeline" value={lead?.timeline} />
        <InfoCard title="Qualification Score" value={`${lead?.qualification_score || 0}%`} />
      </div>

      <Card className="rounded-2xl border-0 shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Original Communication</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-zinc-600 whitespace-pre-wrap">
            {lead?.raw_conversation || "No communication found."}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ListCard title="Deliverables" items={extraction.deliverables} />
        <ListCard title="Requirements" items={extraction.requirements} />
        <ListCard title="Risks" items={extraction.risks} />
        <ListCard title="Missing Information" items={extraction.missing_information} />
        <ListCard title="Recommended Next Steps" items={extraction.recommended_next_steps} />
        <ListCard title="Discovery Questions" items={extraction.discovery_questions} />
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