"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import api from "@/lib/axios"
import { Mail, Users, Layers, Package, TrendingUp, Clock, FileText } from "lucide-react"

interface DashboardStats {
  totalCampaigns: number
  totalContacts: number
  totalSegments: number
  totalProducts: number
  totalTemplates: number
  recentCampaigns: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    totalContacts: 0,
    totalSegments: 0,
    totalProducts: 0,
    totalTemplates: 0,
    recentCampaigns: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [campaigns, contacts, segments, products, templates] = await Promise.all([
          api.get("/campaigns"),
          api.get("/contacts"),
          api.get("/segments"),
          api.get("/products"),
          api.get("/templates"),
        ])

        // Handle different response structures
        const campaignsArray = Array.isArray(campaigns.data)
          ? campaigns.data
          : Array.isArray(campaigns.data?.data)
            ? campaigns.data.data
            : []

        const contactsArray = Array.isArray(contacts.data)
          ? contacts.data
          : Array.isArray(contacts.data?.data)
            ? contacts.data.data
            : []

        const segmentsArray = Array.isArray(segments.data)
          ? segments.data
          : Array.isArray(segments.data?.data)
            ? segments.data.data
            : []

        const productsArray = Array.isArray(products.data)
          ? products.data
          : Array.isArray(products.data?.data)
            ? products.data.data
            : []

        const templatesArray = Array.isArray(templates.data)
          ? templates.data
          : Array.isArray(templates.data?.data)
            ? templates.data.data
            : []

        setStats({
          totalCampaigns: campaignsArray.length || 0,
          totalContacts: contactsArray.length || 0,
          totalSegments: segmentsArray.length || 0,
          totalProducts: productsArray.length || 0,
          totalTemplates: templatesArray.length || 0,
          recentCampaigns: campaignsArray.slice(0, 5),
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({
    icon: Icon,
    label,
    value,
    href,
  }: {
    icon: any
    label: string
    value: number
    href: string
  }) => (
    <Link href={href}>
      <Card hoverable className="cursor-pointer h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Icon size={24} className="text-indigo-600" />
          </div>
        </div>
      </Card>
    </Link>
  )

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-indigo-100">Welcome back! Here's your marketing overview</p>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Mail}
            label="Campaigns"
            value={stats.totalCampaigns}
            href="/campaigns"
          />
          <StatCard
            icon={Users}
            label="Contacts"
            value={stats.totalContacts}
            href="/contacts"
          />
          <StatCard
            icon={Layers}
            label="Segments"
            value={stats.totalSegments}
            href="/segments"
          />
          <StatCard
            icon={Package}
            label="Products"
            value={stats.totalProducts}
            href="/products"
          />
          <StatCard
            icon={FileText}
            label="Templates"
            value={stats.totalTemplates}
            href="/templates"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/campaigns/create" className="col-span-1">
            <Card hoverable className="cursor-pointer h-full flex flex-col justify-center items-center text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Mail size={24} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">New Campaign</h3>
              <p className="text-sm text-gray-600 mt-1">Create email campaign</p>
            </Card>
          </Link>

          <Link href="/contacts/create" className="col-span-1">
            <Card hoverable className="cursor-pointer h-full flex flex-col justify-center items-center text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Add Contact</h3>
              <p className="text-sm text-gray-600 mt-1">Import or create contact</p>
            </Card>
          </Link>

          <Link href="/segments/create" className="col-span-1">
            <Card hoverable className="cursor-pointer h-full flex flex-col justify-center items-center text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Layers size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">New Segment</h3>
              <p className="text-sm text-gray-600 mt-1">Build audience segment</p>
            </Card>
          </Link>

          <Link href="/templates" className="col-span-1">
            <Card hoverable className="cursor-pointer h-full flex flex-col justify-center items-center text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <FileText size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Email Templates</h3>
              <p className="text-sm text-gray-600 mt-1">Manage reusable designs</p>
            </Card>
          </Link>
        </div>

        {/* Recent Campaigns */}
        {stats.recentCampaigns.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
              <Link href="/campaigns">
                <p className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</p>
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentCampaigns.map((campaign) => (
                <Link key={campaign._id} href={`/campaigns/${campaign._id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {campaign.status || "draft"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {campaign.type || "standard"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}