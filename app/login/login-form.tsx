"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { ArrowRight, LockKeyhole, Sparkles, User2 } from "lucide-react"

export default function LoginForm() {
  const supabase = createClient()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)

    const email =
      username === "admin"
        ? "admin@pipewyse.com"
        : `${username}@pipewyse.com`

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = "/"
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 flex items-center justify-center p-6">
      <div className="absolute top-[-120px] left-[-80px] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-100px] h-[460px] w-[460px] rounded-full bg-blue-500/20 blur-3xl" />

      <Card className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl shadow-violet-950/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />

        <CardContent className="p-10">
          <div className="mb-10">
            <Badge className="mb-5 rounded-full bg-white/10 text-white hover:bg-white/10">
              Pipewyse Access
            </Badge>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-violet-900/30">
                <Sparkles className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                  Pipewyse
                </h1>

                <p className="text-violet-100 text-sm mt-1">
                  AI Operational Workflow System
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              Login to continue
            </h2>

            <p className="text-violet-100 mt-2 text-sm leading-relaxed">
              Access your operational workflows, proposals, project pipelines,
              and AI qualification system.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white">
                Username
              </Label>

              <div className="relative">
                <User2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-200" />

                <Input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-14 rounded-2xl border-white/10 bg-white/10 pl-11 text-white placeholder:text-violet-200/60 backdrop-blur-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Password
              </Label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-200" />

                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-white/10 bg-white/10 pl-11 text-white placeholder:text-violet-200/60 backdrop-blur-xl"
                />
              </div>
            </div>

            <Button
              onClick={login}
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-base font-bold shadow-xl shadow-violet-950/30"
            >
              {loading ? "Logging in..." : "Login to Pipewyse"}

              {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold text-violet-100 mb-2">
              Demo Credentials
            </p>

            <div className="space-y-1 text-sm text-white">
              <p>
                Username: <span className="font-bold">admin</span>
              </p>

              <p>
                Password: <span className="font-bold">admin123</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}