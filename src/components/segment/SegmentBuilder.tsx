"use client"

import { useState, useEffect } from "react"
import { Plus, X, Eye } from "lucide-react"
import api from "@/lib/axios"

interface Rule {
  field: string
  operator: string
  value: any
  valueRange?: { from: any; to: any }
}

interface SegmentBuilderProps {
  initialRules?: Rule[]
  initialLogic?: "AND" | "OR"
  onSave?: (rules: Rule[], logic: string) => void
}

const FIELDS = [
  { value: "totalSpent", label: "Total Spent" },
  { value: "lastOrderDate", label: "Last Order Date" },
  { value: "cartValue", label: "Cart Value" },
  { value: "abandonedCartValue", label: "Abandoned Cart Value" },
  { value: "lastActivityDate", label: "Last Activity Date" },
  { value: "emailEngagement.opens", label: "Email Opens" },
  { value: "emailEngagement.clicks", label: "Email Clicks" },
  { value: "categoryInterest", label: "Category Interest" },
  { value: "couponUsage", label: "Coupon Usage" },
  { value: "subscriptionStatus", label: "Subscription Status" },
  { value: "lastEmailEngagementDate", label: "Last Email Engagement" },
  { value: "purchaseCount", label: "Purchase Count" },
]

const OPERATORS: Record<string, { value: string; label: string }[]> = {
  default: [
    { value: "equals", label: "Equals" },
    { value: "notEquals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "notContains", label: "Not Contains" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "gt", label: "Greater than" },
    { value: "lt", label: "Less than" },
    { value: "gte", label: "Greater or equal" },
    { value: "lte", label: "Less or equal" },
    { value: "between", label: "Between" },
  ],
  date: [
    { value: "gte", label: "After" },
    { value: "lte", label: "Before" },
    { value: "between", label: "Between" },
  ],
}

const PRE_BUILT = [
  { name: "VIP Customers", field: "totalSpent", operator: "gte", value: 500 },
  { name: "Inactive (90 days)", field: "lastActivityDate", operator: "lt", value: 90 },
  { name: "Abandoned Cart", field: "abandonedCartValue", operator: "gt", value: 0 },
  { name: "Recent Purchasers", field: "lastOrderDate", operator: "gte", value: 30 },
  { name: "High Engagement", field: "emailEngagement.opens", operator: "gte", value: 5 },
]

export default function SegmentBuilder({
  initialRules = [],
  initialLogic = "AND",
  onSave,
}: SegmentBuilderProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [logic, setLogic] = useState<"AND" | "OR">(initialLogic)
  const [preview, setPreview] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const addRule = () => {
    setRules([
      ...rules,
      {
        field: "totalSpent",
        operator: "gte",
        value: 0,
      },
    ])
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const updateRule = (index: number, updates: Partial<Rule>) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], ...updates }
    setRules(newRules)
  }

  const getOperators = (fieldValue: string): { value: string; label: string }[] => {
    if (fieldValue.includes("Date")) return OPERATORS.date
    if (
      fieldValue.includes("spent") ||
      fieldValue.includes("Count") ||
      fieldValue.includes("Value") ||
      fieldValue.includes("opens") ||
      fieldValue.includes("clicks")
    )
      return OPERATORS.number
    return OPERATORS.default
  }

  const previewSegment = async () => {
    try {
      const response = await api.post("/segments/preview", {
        rules,
        logic,
      })
      setPreview(response.data)
      setPreviewOpen(true)
    } catch (error) {
      console.error("Preview error:", error)
    }
  }

  const applyPreBuilt = (preBuilt: any) => {
    setRules([preBuilt])
  }

  const handleSave = () => {
    onSave?.(rules, logic)
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Segment Builder</h2>
          <p className="text-sm text-gray-500">Create dynamic audience segments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={previewSegment}
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save Segment
          </button>
        </div>
      </div>

      {/* Pre-built segments */}
      <div className="mb-6 pb-4 border-b">
        <h3 className="font-semibold mb-3 text-sm">Quick Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PRE_BUILT.map((template) => (
            <button
              key={template.name}
              onClick={() => applyPreBuilt(template)}
              className="text-sm px-3 py-2 border rounded hover:bg-indigo-50 hover:border-indigo-300 text-left"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Logic:</span>
          <select
            value={logic}
            onChange={(e) => setLogic(e.target.value as "AND" | "OR")}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="AND">AND (All conditions must match)</option>
            <option value="OR">OR (Any condition can match)</option>
          </select>
        </div>

        {rules.map((rule, index) => (
          <div key={index} className="flex gap-2 items-start bg-gray-50 p-4 rounded">
            {index > 0 && <div className="font-semibold text-sm pt-2 min-w-12">{logic}</div>}
            <div className="flex-1 space-y-2">
              <select
                value={rule.field}
                onChange={(e) => updateRule(index, { field: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                {FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <select
                value={rule.operator}
                onChange={(e) => updateRule(index, { operator: e.target.value })}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                {getOperators(rule.field).map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              {rule.operator === "between" ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={rule.valueRange?.from || ""}
                    onChange={(e) =>
                      updateRule(index, {
                        valueRange: {
                          ...rule.valueRange,
                          from: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={rule.valueRange?.to || ""}
                    onChange={(e) =>
                      updateRule(index, {
                        valueRange: {
                          ...rule.valueRange,
                          to: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                </div>
              ) : rule.field === "subscriptionStatus" ? (
                <select
                  value={rule.value}
                  onChange={(e) => updateRule(index, { value: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                  <option value="pending">Pending</option>
                </select>
              ) : (
                <input
                  type={rule.field.includes("Date") ? "date" : "number"}
                  placeholder="Value"
                  value={rule.value}
                  onChange={(e) => updateRule(index, { value: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              )}
            </div>

            <button
              onClick={() => removeRule(index)}
              className="p-1 hover:bg-red-200 rounded"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add rule button */}
      <button
        onClick={addRule}
        className="flex items-center gap-2 px-4 py-2 border border-dashed rounded text-indigo-600 hover:bg-indigo-50"
      >
        <Plus size={18} />
        Add Rule
      </button>

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Segment Preview</h3>
            {preview && (
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Segment Size:</strong> {preview.size} contacts ({preview.percentage}% of total)
                </div>
                <div className="text-sm text-gray-600">
                  This is an estimate based on current data
                </div>
              </div>
            )}
            <button
              onClick={() => setPreviewOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
