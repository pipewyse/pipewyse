import { createClient } from "@/lib/supabase-server"
import EditLeadForm from "./edit-lead-form"

export default async function EditLeadPage({
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

  return <EditLeadForm lead={lead} />
}