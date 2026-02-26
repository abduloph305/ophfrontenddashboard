"use client"

import { useEffect, useState } from "react"
import { getProductsApi } from "@/modules/product/product.api"
import { Product } from "@/modules/product/product.types"
import Card from "@/components/ui/Card"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProductsApi().then((res) => setProducts(res.data))
  }, [])

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/products/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id}>
            <h3 className="font-semibold">{product.name}</h3>
            <p>₹{product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}