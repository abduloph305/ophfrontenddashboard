"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Card from "@/components/ui/Card"
import { Upload, Download, Trash2, RefreshCw, AlertCircle } from "lucide-react"

interface Contact {
  _id: string
  email: string
  name: string
  subscriptionStatus: string
  isValidEmail: boolean
  isBounced: boolean
}

interface HygieneReport {
  total: number
  valid: number
  invalid: number
  bounced: number
  unsubscribed: number
  subscribed: number
  healthScore: number
}

export default function ContactListManagementPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [hygiene, setHygiene] = useState<HygieneReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [tab, setTab] = useState<"list" | "import" | "hygiene">("list")

  useEffect(() => {
    loadContacts()
    loadHygiene()
  }, [])

  const loadContacts = async () => {
    try {
      const res = await api.get("/api/contacts?limit=50")
      setContacts(res.data.data)
    } catch (error) {
      console.error("Failed to load contacts:", error)
    }
  }

  const loadHygiene = async () => {
    try {
      const res = await api.get("/api/contacts/hygiene/report")
      setHygiene(res.data)
    } catch (error) {
      console.error("Failed to load hygiene report:", error)
    }
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFile(file)

    // Preview
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await api.post("/api/contacts/import/preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setImportPreview(res.data.preview)
    } catch (error) {
      console.error("Preview error:", error)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", importFile)

    try {
      const res = await api.post("/api/contacts/import/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert(`Imported ${res.data.imported} contacts successfully!`)
      setImportFile(null)
      setImportPreview([])
      loadContacts()
      loadHygiene()
    } catch (error) {
      console.error("Import error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get("/api/contacts/export/csv", {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(res.data)
      const a = document.createElement("a")
      a.href = url
      a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const handleCleanList = async () => {
    if (!confirm("This will remove duplicates and validate emails. Continue?")) return

    setLoading(true)
    try {
      const res = await api.post("/api/contacts/hygiene/clean")
      alert(`Cleaned list! Removed ${res.data.steps[0].deletedCount} duplicates.`)
      loadContacts()
      loadHygiene()
    } catch (error) {
      console.error("Clean error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return
    if (!confirm(`Delete ${selectedContacts.length} contacts?`)) return

    setLoading(true)
    try {
      const res = await api.post("/api/contacts/bulk/delete", {
        ids: selectedContacts,
      })
      alert(`Deleted ${res.data.deletedCount} contacts`)
      setSelectedContacts([])
      loadContacts()
      loadHygiene()
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(contacts.map((c) => c._id))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact List Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["list", "import", "hygiene"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium capitalize border-b-2 ${
              tab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: List */}
      {tab === "list" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedContacts.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
            >
              <Trash2 size={18} />
              Delete Selected
            </button>
          </div>

          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === contacts.length && contacts.length > 0}
                      onChange={toggleAllContacts}
                    />
                  </th>
                  <th className="p-2 text-left font-semibold">Email</th>
                  <th className="p-2 text-left font-semibold">Name</th>
                  <th className="p-2 text-left font-semibold">Status</th>
                  <th className="p-2 text-left font-semibold">Valid</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact._id)}
                        onChange={() => toggleContact(contact._id)}
                      />
                    </td>
                    <td className="p-2">{contact.email}</td>
                    <td className="p-2">{contact.name}</td>
                    <td className="p-2 capitalize">{contact.subscriptionStatus}</td>
                    <td className="p-2">
                      {contact.isValidEmail ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Tab: Import */}
      {tab === "import" && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-bold mb-4">Import Contacts</h2>

            <div className="border-2 border-dashed rounded p-6 text-center mb-4">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImportFile}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex justify-center mb-2">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <p className="font-semibold">Drop CSV or Excel file here</p>
                <p className="text-sm text-gray-600">or click to browse</p>
              </label>
            </div>

            {importFile && (
              <div className="bg-blue-50 p-3 rounded mb-4">
                <p className="text-sm">
                  <strong>File:</strong> {importFile.name}
                </p>
                <p className="text-sm text-gray-600">
                  Preview: {importPreview.length} rows
                </p>
              </div>
            )}

            {importPreview.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Preview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(importPreview[0]).map((key) => (
                          <th key={key} className="p-2 text-left border">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="p-2 border text-xs">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!importFile || loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? "Importing..." : "Import Contacts"}
            </button>
          </Card>
        </div>
      )}

      {/* Tab: Hygiene */}
      {tab === "hygiene" && (
        <div className="space-y-4">
          {hygiene && (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <h3 className="text-sm text-gray-600 mb-2">List Health Score</h3>
                  <div className="text-4xl font-bold text-indigo-600">{hygiene.healthScore.toFixed(1)}%</div>
                  <div className="mt-2 w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded"
                      style={{ width: `${hygiene.healthScore}%` }}
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm text-gray-600 mb-2">Total Contacts</h3>
                  <div className="text-4xl font-bold">{hygiene.total}</div>
                </Card>

                <Card>
                  <h3 className="text-sm text-gray-600 mb-2">Subscribed</h3>
                  <div className="text-4xl font-bold text-green-600">{hygiene.subscribed}</div>
                </Card>
              </div>

              <Card>
                <h3 className="font-bold mb-4">List Status Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Valid Emails</span>
                      <span className="font-bold">{hygiene.valid}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-green-500 h-2 rounded"
                        style={{ width: `${(hygiene.valid / hygiene.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Invalid Emails</span>
                      <span className="font-bold">{hygiene.invalid}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-red-500 h-2 rounded"
                        style={{ width: `${(hygiene.invalid / hygiene.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Bounced</span>
                      <span className="font-bold">{hygiene.bounced}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded"
                        style={{ width: `${(hygiene.bounced / hygiene.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Unsubscribed</span>
                      <span className="font-bold">{hygiene.unsubscribed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-gray-500 h-2 rounded"
                        style={{ width: `${(hygiene.unsubscribed / hygiene.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold mb-4">Cleaning Actions</h3>
                <button
                  onClick={handleCleanList}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400"
                >
                  <RefreshCw size={18} />
                  {loading ? "Cleaning..." : "Clean List Now"}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  This will remove duplicates and mark invalid emails
                </p>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  )
}
