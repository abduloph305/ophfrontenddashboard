"use client"

import TemplateManager from "@/components/email/TemplateManager"

export default function TemplatesPage() {
    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Email Templates</h1>
                <p className="text-purple-100">Create and manage your email marketing templates</p>
            </div>
            <TemplateManager />
        </div>
    )
}
