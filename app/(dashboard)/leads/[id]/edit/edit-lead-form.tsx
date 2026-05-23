"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function EditLeadForm({ lead }: { lead: any }) {
  const router = useRouter()

  const [clientName, setClientName] = useState(lead?.client_name || "")
  const [companyName, setCompanyName] = useState(lead?.company_name || "")
  const [projectType, setProjectType] = useState(lead?.project_type || "")
  const [budget, setBudget] = useState(lead?.budget || "")
  const [timeline, setTimeline] = useState(lead?.timeline || "")
  const [leadStatus, setLeadStatus] = useState(lead?.lead_status || "")
  const [saving, setSaving] = useState(false)

  const extraction = lead?.extraction || {}

  const [deliverables, setDeliverables] = useState(
    Array.isArray(extraction.deliverables)
      ? extraction.deliverables.join("\n")
      : ""
  )

  const [requirements, setRequirements] = useState(
    Array.isArray(extraction.requirements)
      ? extraction.requirements.join("\n")
      : ""
  )

  const [risks, setRisks] = useState(
    Array.isArray(extraction.risks)
      ? extraction.risks.join("\n")
      : ""
  )

  const [missingInformation, setMissingInformation] = useState(
    Array.isArray(extraction.missing_information)
      ? extraction.missing_information.join("\n")
      : ""
  )

  async function saveLead() {
    setSaving(true)

    const updatedExtraction = {
      ...extraction,
      client_name: clientName,
      company_name: companyName,
      project_type: projectType,
      budget,
      timeline,
      lead_status: leadStatus,
      deliverables: deliverables.split("\n").filter(Boolean),
      requirements: requirements.split("\n").filter(Boolean),
      risks: risks.split("\n").filter(Boolean),
      missing_information: missingInformation.split("\n").filter(Boolean),
    }

    await supabase
      .from("intakes")
      .update({
        client_name: clientName,
        company_name: companyName,
        project_type: projectType,
        budget,
        timeline,
        lead_status: leadStatus,
        extraction: updatedExtraction,
      })
      .eq("id", lead.id)

    setSaving(false)

    router.push(`/leads/${lead.id}`)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit AI Extraction
        </h1>

        <p className="text-zinc-500 mt-2">
          Review and correct the operational data extracted by Pipewyse AI.
        </p>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Client Name" value={clientName} onChange={setClientName} />
            <Field label="Company Name" value={companyName} onChange={setCompanyName} />
            <Field label="Project Type" value={projectType} onChange={setProjectType} />
            <Field label="Budget" value={budget} onChange={setBudget} />
            <Field label="Timeline" value={timeline} onChange={setTimeline} />
            <Field label="Lead Status" value={leadStatus} onChange={setLeadStatus} />
          </div>

          <TextAreaField
            label="Deliverables"
            value={deliverables}
            onChange={setDeliverables}
          />

          <TextAreaField
            label="Requirements"
            value={requirements}
            onChange={setRequirements}
          />

          <TextAreaField
            label="Risks"
            value={risks}
            onChange={setRisks}
          />

          <TextAreaField
            label="Missing Information"
            value={missingInformation}
            onChange={setMissingInformation}
          />

          <Button
            onClick={saveLead}
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px]"
      />
      <p className="text-xs text-zinc-500">
        Put each item on a new line.
      </p>
    </div>
  )
}