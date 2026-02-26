"use client"

import { useState } from "react"
import { createSegmentApi } from "@/modules/segment/segment.api"
import { useRouter } from "next/navigation"
import Card from "@/components/ui/Card"
import SegmentBuilder from "@/components/segment/SegmentBuilder"

export default function CreateSegmentPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rules, setRules] = useState<any[]>([])
  const [logic, setLogic] = useState<"AND" | "OR">("AND")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name || rules.length === 0) {
      alert("Please enter a name and add at least one rule")
      return
    }

    setLoading(true)
    try {
      await createSegmentApi({
        name,
        description,
        rules,
        logic,
      })
      router.push("/segments")
    } catch (error) {
      console.error("Failed to create segment:", error)
      alert("Failed to create segment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4">Segment Basics</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Segment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Value Customers"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this segment"
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
        </div>
      </Card>

      <SegmentBuilder
        initialRules={rules}
        initialLogic={logic}
        onSave={(newRules, newLogic) => {
          setRules(newRules)
          setLogic(newLogic)
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={loading || !name || rules.length === 0}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Segment"}
        </button>
      </div>
    </div>
  )
}