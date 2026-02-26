"use client"

import { useEffect, useState } from "react"
import { getSegmentsApi } from "@/modules/segment/segment.api"
import { Segment } from "@/modules/segment/segment.types"
import Card from "@/components/ui/Card"
import Link from "next/link"
import { Plus, Edit2, Trash2, Users } from "lucide-react"
import api from "@/lib/axios"

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [stats, setStats] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    try {
      const res = await getSegmentsApi()
      setSegments(res.data)

      // Load stats for each segment
      const segmentStats: Record<string, any> = {}
      for (const segment of res.data) {
        try {
          const statsRes = await api.get(`/segments/${segment._id}/stats`)
          segmentStats[segment._id] = statsRes.data
        } catch (error) {
          console.error(`Failed to load stats for segment ${segment._id}`)
        }
      }
      setStats(segmentStats)
    } catch (err) {
      console.error("Failed to load segments:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteSegment = async (id: string) => {
    if (!confirm("Delete this segment?")) return
    try {
      await api.delete(`/api/segments/${id}`)
      loadSegments()
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  if (loading) return <div className="text-center py-12">Loading segments...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Segments</h1>
        <Link
          href="/segments/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <Plus size={18} />
          Create Segment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <Card key={segment._id}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{segment.name}</h3>
              <div className="flex gap-1">
                <Link href={`/segments/${segment._id}/edit`} className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => deleteSegment(segment._id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span>
                  {stats[segment._id]?.totalContacts || 0} contacts
                  {stats[segment._id]?.totalContacts ? (
                    <span className="text-gray-600">
                      {" "}
                      ({((stats[segment._id]?.totalContacts / stats[segment._id]?.activeSubscribers) * 100).toFixed(1)}% active)
                    </span>
                  ) : null}
                </span>
              </div>

              {segment.description && (
                <p className="text-gray-600 line-clamp-2">{segment.description}</p>
              )}

              <div className="text-xs text-gray-500">
                {segment.rules?.length || 0} rules ({segment.logic})
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/segments/${segment._id}`}
                className="flex-1 text-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                View
              </Link>
              <Link
                href={`/campaigns/create?segment=${segment._id}`}
                className="flex-1 text-center px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Campaign
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No segments created yet</p>
          <Link
            href="/segments/create"
            className="text-indigo-600 hover:underline font-medium"
          >
            Create your first segment
          </Link>
        </div>
      )}
    </div>
  )
}