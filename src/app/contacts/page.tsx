"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Link from "next/link"
import { Plus, Search } from "lucide-react"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadContacts()
  }, [search, status, page])

  const loadContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (status) params.append("status", status)
      params.append("page", page.toString())
      params.append("limit", "20")

      const res = await api.get(`/contacts?${params}`)
      setContacts(res.data.data || [])
      setTotal(res.data.total || 0)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch contacts:", err)
      setError("Failed to fetch contacts")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading contacts...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Link href="/contacts/management" className="px-4 py-2 border rounded hover:bg-gray-50">
            List Manager
          </Link>
          <Link
            href="/contacts/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Contact
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      {/* Contacts Table */}
      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Total Spent</th>
              <th className="px-4 py-3 text-left font-semibold">Last Order</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((c: any) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.email}</td>
                  <td className="px-4 py-3">{c.name || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        c.subscriptionStatus === "subscribed"
                          ? "bg-green-100 text-green-800"
                          : c.subscriptionStatus === "unsubscribed"
                            ? "bg-red-100 text-red-800"
                            : c.subscriptionStatus === "bounced"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {c.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">${(c.totalSpent || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/contacts/${c._id}`} className="text-indigo-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} contacts
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 20 >= total}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
    