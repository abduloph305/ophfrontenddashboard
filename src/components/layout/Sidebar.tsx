"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Package, Layers, Mail, BarChart3, FileText } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/segments", icon: Layers, label: "Segments" },
  { href: "/campaigns", icon: Mail, label: "Campaigns" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/templates", icon: FileText, label: "Templates" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 sticky top-0 transition-all duration-300 border-r border-slate-700/50 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                EM
              </div>
              <h1 className="text-lg font-bold text-white">E-Marketing</h1>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }}`}
              title={item.label}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!collapsed && active && (
                <div className="absolute right-2 w-1 h-6 bg-white rounded-full"></div>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}