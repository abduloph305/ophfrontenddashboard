import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export default function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div
      className={`bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 transition-all duration-300 ${
        hoverable ? "hover:shadow-lg hover:border-gray-300/50 hover:bg-white/70" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}