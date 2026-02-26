"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createContactApi } from "@/modules/contact/contact.api"
import Card from "@/components/ui/Card"

export default function CreateContactPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = async () => {
    await createContactApi({ name, email, phone })
    router.push("/contacts")
  }

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <h2 className="text-xl font-bold mb-6">Create Contact</h2>

        <div className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            Create Contact
          </button>
        </div>
      </Card>
    </div>
  )
}