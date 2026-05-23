import LogoutButton from "@/components/logout-button"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="flex">
        <aside className="w-64 border-r bg-white min-h-screen p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">
              Pipewyse
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              AI Operational Workflow
            </p>
          </div>

          <nav className="space-y-2">
            <Link href="/" className="block text-zinc-600 hover:bg-zinc-100 px-4 py-3 rounded-xl">
              Dashboard
            </Link>

            <Link href="/new-intake" className="block bg-violet-100 text-violet-700 px-4 py-3 rounded-xl font-medium">
              New Intake
            </Link>

            <Link href="/leads" className="block text-zinc-600 hover:bg-zinc-100 px-4 py-3 rounded-xl">
              Leads
            </Link>

            <Link href="/proposals" className="block text-zinc-600 hover:bg-zinc-100 px-4 py-3 rounded-xl">
              Proposals
            </Link>

            <Link href="/projects" className="block text-zinc-600 hover:bg-zinc-100 px-4 py-3 rounded-xl">
              Projects
            </Link>
          </nav>
        </aside>

        <div className="mt-10">
          <LogoutButton />
        </div>

        <section className="flex-1 p-8">
          {children}
        </section>
      </div>
    </main>
  )
}