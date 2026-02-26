"use client"

import { useState } from "react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

export default function CreateProduct() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")

  const handleCreate = async () => {
    await api.post("/products", {
      name,
      price: Number(price),
      category,
    })

    router.push("/products")
  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <h1 className="text-xl font-bold mb-4">Create Product</h1>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  )
}