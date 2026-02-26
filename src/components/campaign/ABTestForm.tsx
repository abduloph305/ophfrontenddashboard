"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import Card from "@/components/ui/Card"
import { Settings } from "lucide-react"

interface ABTestSetup {
  name: string
  testType: "subject_line" | "content" | "send_time" | "cta"
  campaignId: string
  controlVariantId?: string
  variants: {
    label: string
    description: string
    segmentSize: number
  }[]
  testDuration: number
  winningMetric: "open_rate" | "click_rate" | "conversion_rate"
}

export default function ABTestForm({ onSubmit }: { onSubmit?: (data: ABTestSetup) => void }) {
  const [testName, setTestName] = useState("")
  const [testType, setTestType] = useState<ABTestSetup["testType"]>("subject_line")
  const [testDuration, setTestDuration] = useState(24)
  const [winningMetric, setWinningMetric] = useState<ABTestSetup["winningMetric"]>("open_rate")
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")
  const [variantCount, setVariantCount] = useState(2)
  const [variants, setVariants] = useState<any[]>([
    { label: "Control", description: "", segmentSize: 50 },
    { label: "Variant A", description: "", segmentSize: 50 },
  ])

  useEffect(() => {
    api.get("/api/campaigns?limit=100").then((res) => setCampaigns(res.data.data))
  }, [])

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        label: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
        description: "",
        segmentSize: Math.floor(100 / (variants.length + 1)),
      },
    ])
    setVariantCount(variants.length + 1)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Verify total segment size
    const totalSize = variants.reduce((sum, v) => sum + v.segmentSize, 0)
    if (totalSize !== 100) {
      alert("Segment sizes must total 100%")
      return
    }

    const data: ABTestSetup = {
      name: testName,
      testType,
      campaignId: selectedCampaignId,
      variants,
      testDuration,
      winningMetric,
    }

    onSubmit?.(data)
  }

  const testTypeDescriptions: Record<ABTestSetup["testType"], string> = {
    subject_line: "Test different subject lines to improve open rates",
    content: "Test different email content and layouts",
    send_time: "Test different send times to find best engagement",
    cta: "Test different call-to-action buttons and text",
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4">A/B Test Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g., Subject Line Test - Winter Sale"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Base Campaign</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select Campaign --</option>
              {campaigns.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as ABTestSetup["testType"])}
              className="w-full border rounded px-3 py-2 mb-2"
            >
              <option value="subject_line">Subject Line</option>
              <option value="content">Content</option>
              <option value="send_time">Send Time</option>
              <option value="cta">Call to Action</option>
            </select>
            <p className="text-sm text-gray-600">{testTypeDescriptions[testType]}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Test Duration (hours)</label>
              <input
                type="number"
                value={testDuration}
                onChange={(e) => setTestDuration(parseInt(e.target.value))}
                min="1"
                max="336"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Winning Metric</label>
              <select
                value={winningMetric}
                onChange={(e) => setWinningMetric(e.target.value as ABTestSetup["winningMetric"])}
                className="w-full border rounded px-3 py-2"
              >
                <option value="open_rate">Open Rate</option>
                <option value="click_rate">Click Rate</option>
                <option value="conversion_rate">Conversion Rate</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Variants */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Test Variants</h3>
          <button
            onClick={addVariant}
            className="text-sm px-3 py-1 border rounded hover:bg-indigo-50"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded border">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold">{variant.label}</h4>
                {index > 0 && (
                  <button
                    onClick={() => removeVariant(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Variant Name</label>
                  <input
                    type="text"
                    value={variant.label}
                    onChange={(e) => updateVariant(index, "label", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={variant.description}
                    onChange={(e) => updateVariant(index, "description", e.target.value)}
                    placeholder={
                      testType === "subject_line"
                        ? "e.g., 50% Off on All Items"
                        : "Describe the variation"
                    }
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Audience Segment %</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={variant.segmentSize}
                      onChange={(e) => updateVariant(index, "segmentSize", parseInt(e.target.value))}
                      min="1"
                      max="100"
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-3 rounded text-sm">
            Total Audience: <strong>{variants.reduce((sum, v) => sum + v.segmentSize, 0)}%</strong>
            {variants.reduce((sum, v) => sum + v.segmentSize, 0) !== 100 && (
              <p className="text-red-600 mt-1">Must equal 100%</p>
            )}
          </div>
        </div>
      </Card>

      <button
        onClick={handleSubmit}
        disabled={!testName || !selectedCampaignId || variants.reduce((sum, v) => sum + v.segmentSize, 0) !== 100}
        className="w-full px-4 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Create A/B Test
      </button>
    </div>
  )
}
