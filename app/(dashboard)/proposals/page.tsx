import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProposalsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Proposals
      </h1>

      <p className="text-zinc-500 mt-2 mb-8">
        Generate and manage AI-created project proposals.
      </p>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>No proposals yet</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-zinc-500">
            Proposal generation will connect from the intake workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}