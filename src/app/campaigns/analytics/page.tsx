"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/axios"
import Card from "@/components/ui/Card"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface CampaignAnalytics {
  campaign: {
    name: string
    status: string
    type: string
  }
  metrics: {
    sent: number
    delivered: number
    opens: number
    clicks: number
    bounces: number
    complaints: number
    unsubscribes: number
  }
  rates: {
    openRate: number
    clickRate: number
    conversionRate: number
    bounceRate: number
  }
  engagement: {
    uniqueOpens: number
    uniqueClicks: number
    avgOpenTime: number
  }
  timeline: {
    sentAt: string
    completedAt: string
  }
}

export default function CampaignAnalyticsPage() {
  const params = useParams()
  const campaignId = params.id as string
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (campaignId) {
      api
        .get(`/campaigns/${campaignId}/analytics`)
        .then((res) => {
          setAnalytics(res.data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to fetch analytics:", err)
          setLoading(false)
        })
    }
  }, [campaignId])

  if (loading) return <div className="text-center py-12">Loading analytics...</div>
  if (!analytics) return <div className="text-center py-12">Campaign not found</div>

  const MetricCard = ({ title, value, unit = "", trend }: any) => (
    <Card>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="text-3xl font-bold">
        {value}
        <span className="text-lg text-gray-500 ml-2">{unit}</span>
      </div>
      {trend && <div className="text-sm text-green-600 mt-2">{trend}</div>}
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{analytics.campaign.name}</h1>
        <p className="text-gray-600 capitalize">{analytics.campaign.type} Campaign</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <MetricCard title="Sent" value={analytics.metrics.sent} />
        <MetricCard title="Open Rate" value={analytics.rates.openRate.toFixed(2)} unit="%" />
        <MetricCard title="Click Rate" value={analytics.rates.clickRate.toFixed(2)} unit="%" />
        <MetricCard title="Bounce Rate" value={analytics.rates.bounceRate.toFixed(2)} unit="%" />
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-bold mb-4">Delivery</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Delivered</span>
              <strong>{analytics.metrics.delivered}</strong>
            </div>
            <div className="flex justify-between">
              <span>Bounces</span>
              <strong className="text-red-600">{analytics.metrics.bounces}</strong>
            </div>
            <div className="flex justify-between">
              <span>Complaints</span>
              <strong className="text-red-600">{analytics.metrics.complaints}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-4">Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Opens</span>
              <strong>{analytics.metrics.opens}</strong>
            </div>
            <div className="flex justify-between">
              <span>Unique Opens</span>
              <strong>{analytics.engagement.uniqueOpens}</strong>
            </div>
            <div className="flex justify-between">
              <span>Avg. Open Time</span>
              <strong>{analytics.engagement.avgOpenTime} min</strong>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold mb-4">Conversions</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Clicks</span>
              <strong>{analytics.metrics.clicks}</strong>
            </div>
            <div className="flex justify-between">
              <span>Unique Clicks</span>
              <strong>{analytics.engagement.uniqueClicks}</strong>
            </div>
            <div className="flex justify-between">
              <span>Conv. Rate</span>
              <strong>{analytics.rates.conversionRate.toFixed(2)}%</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* List Hygiene Impact */}
      <Card>
        <h3 className="font-bold mb-4">List Impact</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3">Unsubscribes</h4>
            <div className="text-4xl font-bold text-red-600">
              {analytics.metrics.unsubscribes}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {(
                (analytics.metrics.unsubscribes / analytics.metrics.sent) *
                100
              ).toFixed(2)}
              % of sent emails
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">List Health Score</h4>
            <div className="text-4xl font-bold text-indigo-600">
              {(
                ((analytics.metrics.sent - analytics.metrics.bounces - analytics.metrics.complaints) /
                  analytics.metrics.sent) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-sm text-gray-600 mt-2">Healthy emails delivered</p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <h3 className="font-bold mb-4">Timeline</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Sent at:</span>
            <span className="ml-4 font-semibold">
              {new Date(analytics.timeline.sentAt).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Completed at:</span>
            <span className="ml-4 font-semibold">
              {new Date(analytics.timeline.completedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Funnel */}
      <Card>
        <h3 className="font-bold mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          {[
            { label: "Sent", value: analytics.metrics.sent, color: "bg-gray-400" },
            { label: "Delivered", value: analytics.metrics.delivered, color: "bg-blue-400" },
            { label: "Opened", value: analytics.metrics.opens, color: "bg-indigo-400" },
            { label: "Clicked", value: analytics.metrics.clicks, color: "bg-green-400" },
          ].map((stage, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{stage.label}</span>
                <span>{stage.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-8">
                <div
                  className={`${stage.color} h-8 rounded flex items-center justify-center text-white font-semibold`}
                  style={{
                    width: `${(stage.value / analytics.metrics.sent) * 100}%`,
                  }}
                >
                  {((stage.value / analytics.metrics.sent) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
