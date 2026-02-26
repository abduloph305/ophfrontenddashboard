"use client"

import { useEffect, useState } from "react"
import { getCampaignsApi, sendCampaignNowApi } from "@/modules/campaign/campaign.api"
import { Campaign } from "@/modules/campaign/campaign.types"
import Card from "@/components/ui/Card"
import Link from "next/link"
import { Plus, Send, Eye, Trash2, Clock } from "lucide-react"
import api from "@/lib/axios"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [statusFilter])

  const loadCampaigns = async () => {
    try {
      const res = await getCampaignsApi({ status: statusFilter, limit: 50 })
      setCampaigns(res.data.data || res.data)
      setLoading(false)
    } catch (err) {
      console.error("Failed to load campaigns:", err)
      setLoading(false)
    }
  }

  const handleSendNow = async (id: string) => {
    if (!confirm("Send this campaign now?")) return
    try {
      await sendCampaignNowApi(id)
      alert("Campaign sent!")
      loadCampaigns()
    } catch (err) {
      console.error("Send failed:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign?")) return
    try {
      await api.delete(`/campaigns/${id}`)
      loadCampaigns()
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  if (loading) return <div className="text-center py-12">Loading campaigns...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Link
          href="/campaigns/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <Plus size={18} />
          Create Campaign
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {["", "draft", "scheduled", "sent"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded capitalize ${
              statusFilter === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status || "All"}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign: any) => (
            <Card key={campaign._id}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg flex-1">{campaign.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                    campaign.status === "sent"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : campaign.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-semibold capitalize">{campaign.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Subject:</span>
                  <p className="text-sm line-clamp-1">{campaign.subject}</p>
                </div>

                {campaign.stats && (
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Sent:</span>
                      <span className="ml-1 font-semibold">{campaign.stats.sent || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Opens:</span>
                      <span className="ml-1 font-semibold">{campaign.stats.opens || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Clicks:</span>
                      <span className="ml-1 font-semibold">{campaign.stats.clicks || 0}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {campaign.status === "draft" && (
                  <>
                    <Link
                      href={`/campaigns/${campaign._id}/edit`}
                      className="flex-1 text-center px-2 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleSendNow(campaign._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Send size={14} />
                      Send
                    </button>
                  </>
                )}

                {campaign.status === "sent" && (
                  <Link
                    href={`/campaigns/${campaign._id}/analytics`}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    <Eye size={14} />
                    Analytics
                  </Link>
                )}

                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No campaigns yet</p>
            <Link
              href="/campaigns/create"
              className="text-indigo-600 hover:underline font-medium"
            >
              Create your first campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}