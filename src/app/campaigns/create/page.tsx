"use client"

import { useEffect, useState } from "react"
import { createCampaignApi } from "@/modules/campaign/campaign.api"
import { getSegmentsApi } from "@/modules/segment/segment.api"
import { Segment } from "@/modules/segment/segment.types"
import { useRouter } from "next/navigation"
import Card from "@/components/ui/Card"
import EmailBuilder from "@/components/email/EmailBuilder"
import SegmentBuilder from "@/components/segment/SegmentBuilder"
import { ChevronDown } from "lucide-react"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Details, 2: Segment, 3: Email, 4: Review
  const [name, setName] = useState("")
  const [type, setType] = useState("broadcast")
  const [subject, setSubject] = useState("")
  const [segments, setSegments] = useState<Segment[]>([])
  const [selectedSegmentId, setSelectedSegmentId] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [emailBlocks, setEmailBlocks] = useState<any[]>([])
  const [previewText, setPreviewText] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [scheduledAt, setScheduledAt] = useState("")
  const [sendImmediate, setSendImmediate] = useState(true)

  useEffect(() => {
    getSegmentsApi().then((res) => setSegments(res.data))
  }, [])

  const handleEmailBuilderSave = (name: string, category: string, html: string, blocks: any[]) => {
    setHtmlContent(html)
    setEmailBlocks(blocks)
  }

  const handleCreate = async () => {
    const campaignData = {
      name,
      type,
      subject,
      previewText,
      htmlContent,
      emailBlocks,
      segmentId: selectedSegmentId,
      timezone,
      status: "draft",
    }

    await createCampaignApi(campaignData)
    router.push("/campaigns")
  }

  const isStep1Valid = name && type
  const isStep2Valid = selectedSegmentId
  const isStep3Valid = subject && htmlContent

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 text-center py-2 rounded ${
                s === step
                  ? "bg-indigo-600 text-white"
                  : s < step
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              <span className="font-semibold">Step {s}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {step === 1 && "Campaign Details"}
          {step === 2 && "Select Audience"}
          {step === 3 && "Design Email"}
          {step === 4 && "Review & Send"}
        </div>
      </div>

      {/* Step 1: Campaign Details */}
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold mb-6">Campaign Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Spring Sale Campaign"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Campaign Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="broadcast">Broadcast</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotional">Promotional</option>
                <option value="announcement">Announcement</option>
                <option value="flash_sale">Flash Sale</option>
                <option value="transactional">Transactional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Don't miss out on our Spring Sale!"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preview Text (optional)</label>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Text shown in email preview"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern</option>
                <option value="CST">Central</option>
                <option value="PST">Pacific</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Next: Select Audience
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Select Segment */}
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold mb-6">Select Your Audience</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Choose a Segment</label>
            <select
              value={selectedSegmentId}
              onChange={(e) => setSelectedSegmentId(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">-- Select Segment --</option>
              {segments.map((seg) => (
                <option key={seg._id} value={seg._id}>
                  {seg.name}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-600 mb-4">
              Want to create a new segment? Use the segment builder
            </p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Next: Design Email
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Design Email */}
      {step === 3 && (
        <div>
          <EmailBuilder onSave={handleEmailBuilderSave} />

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!isStep3Valid}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Next: Review & Send
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Send */}
      {step === 4 && (
        <Card>
          <h2 className="text-xl font-bold mb-6">Review & Send</h2>

          <div className="space-y-4 mb-6 pb-6 border-b">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Campaign Name</label>
                <p className="text-lg">{name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-lg capitalize">{type}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-lg">{subject}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                id="immediate"
                checked={sendImmediate}
                onChange={() => setSendImmediate(true)}
              />
              <label htmlFor="immediate" className="text-sm font-medium">
                Send Immediately
              </label>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="radio"
                id="scheduled"
                checked={!sendImmediate}
                onChange={() => setSendImmediate(false)}
              />
              <label htmlFor="scheduled" className="text-sm font-medium">
                Schedule for later
              </label>
              {!sendImmediate && (
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(3)}
              className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Launch Campaign
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}