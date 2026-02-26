// "use client"

// import { useAuthStore } from "@/modules/auth/auth.store"

// export default function Navbar() {
//   const logout = useAuthStore((s) => s.logout)

//   return (
//     <div className="h-16 bg-white shadow flex justify-end items-center px-6">
//       <button
//         onClick={logout}
//         className="bg-red-500 text-white px-4 py-2 rounded"
//       >
//         Logout
//       </button>
//     </div>
//   )
// }

"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/modules/auth/auth.store"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    try {
      logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              EM
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
              E-Marketing
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-black-700 hover:bg-gray-400 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full mt-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}