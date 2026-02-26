"use client"

import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import { useAuthStore } from "@/modules/auth/auth.store"

export default function SegmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated)

  if (!hasHydrated) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
