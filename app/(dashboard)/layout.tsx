import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import LogoutButton from "@/components/logout-button"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen premium-bg">
      <div className="flex min-h-screen">
        <aside className="w-[300px] bg-[#06111f] text-white p-5 flex flex-col relative overflow-hidden">
          <div className="absolute -top-20 -left-20 h-52 w-52 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute bottom-20 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative mb-12 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold shadow-xl shadow-violet-900/40">
              P
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Pipewyse
              </h1>
              <p className="text-xs text-slate-400">
                Work. Flow. Grow.
              </p>
            </div>
          </div>

          <nav className="relative space-y-2 flex-1">
            <NavItem href="/" label="Dashboard" />
            <NavItem href="/projects" label="Projects" />
            <NavItem href="/settings" label="Settings" />
          </nav>

          <div className="relative rounded-3xl bg-white/8 border border-white/10 p-5 mb-5 shadow-2xl">
            <p className="text-sm font-semibold">
              AI operations active
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Pipewyse turns client communication into structured operational workflows.
            </p>
          </div>

          <div className="relative">
            <LogoutButton />
          </div>
        </aside>

        <section className="flex-1 px-10 py-8 lg:px-14 lg:py-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

function NavItem({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <Link
      href={href}
      className="group block px-5 py-4 rounded-2xl text-[15px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
    >
      <span className="flex items-center justify-between">
        {label}
        <span className="h-2 w-2 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition" />
      </span>
    </Link>
  )
}