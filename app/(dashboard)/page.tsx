import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>

          <p className="text-zinc-500 mt-1">
            Operational overview for your agency
          </p>
        </div>

        <Badge className="bg-violet-600">
          AI Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Active Leads
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Proposals Sent
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-sm text-zinc-500">
              Active Projects
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-4xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>
            Recent Operational Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <p className="font-medium">
                Fintech Mobile App Redesign
              </p>

              <p className="text-sm text-zinc-500">
                AI extracted project requirements
              </p>
            </div>

            <Badge variant="secondary">
              Qualified
            </Badge>
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <div>
              <p className="font-medium">
                SaaS Branding Project
              </p>

              <p className="text-sm text-zinc-500">
                Proposal generated successfully
              </p>
            </div>

            <Badge>
              Proposal Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}