"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import EmailBuilder from "@/components/email/EmailBuilder"
import api from "@/lib/axios"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"

export default function NewTemplatePage() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)

    const handleSave = async (name: string, category: string, html: string, blocks: any[]) => {
        try {
            setSaving(true)
            const thumbnail = blocks.find(b => b.type === "image")?.content || "";

            await api.post("/templates", {
                name,
                category,
                thumbnail,
                description: blocks.find(b => b.type === "text")?.content.substring(0, 100) || "",
                htmlContent: html,
                blocks: blocks.map((b, index) => ({
                    ...b,
                    id: b.id || `block-${index}`,
                })),
            })
            toast.success("Template saved successfully!")
            setTimeout(() => router.push("/templates"), 1500)
        } catch (error: any) {
            console.error("Failed to save template:", error)
            const message = error.response?.data?.message || "Failed to save template. Please try again."
            toast.error(message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/templates"
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Create New Template</h1>
                </div>
            </div>

            <div className="h-[calc(100vh-65px)]">
                <EmailBuilder
                    onSave={handleSave}
                />
            </div>

            {saving && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="font-medium text-gray-900">Saving template...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
