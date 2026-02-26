"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
    Plus, Search, LayoutGrid, List, BarChart3, Users, Zap,
    Trash2, Send, Edit, FileText, CheckCircle, AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Template {
    _id: string;
    name: string;
    description?: string;
    category: string;
    thumbnail?: string;
    usageCount?: number;
    htmlContent: string;
}

export default function TemplateManager() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");

    // Bulk Send state
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showBulkSend, setShowBulkSend] = useState(false);
    const [recipientIds, setRecipientIds] = useState("");
    const [selectedSegmentId, setSelectedSegmentId] = useState("");
    const [segments, setSegments] = useState<any[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTemplates();
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        try {
            const res = await api.get("/segments");
            setSegments(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
            console.error("Failed to load segments", err);
        }
    };

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const res = await api.get("/templates");
            setTemplates(res.data);
        } catch (err: any) {
            console.error("Failed to load templates", err);
            toast.error("Could not load templates");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        try {
            await api.delete(`/templates/${id}`);
            setTemplates(templates.filter((t) => t._id !== id));
            toast.success("Template deleted successfully");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleBulkSend = async () => {
        if (!selectedTemplate) return;

        if (!selectedSegmentId && !recipientIds.trim()) {
            toast.error("Please select a segment or enter contact IDs / Emails");
            return;
        }

        const ids = recipientIds.split(/[\n,]+/).map((id) => id.trim()).filter(Boolean);

        try {
            setSending(true);
            const res = await api.post("/templates/send-bulk", {
                templateId: selectedTemplate._id,
                contactIds: ids.length > 0 ? ids : undefined,
                segmentId: selectedSegmentId || undefined,
                subject: selectedTemplate.name
            });

            const count = res.data.recipientCount || ids.length || "all";
            toast.success(`Broadcasting initiated! Resend is delivering to recipients.`);

            setRecipientIds("");
            setSelectedSegmentId("");
            setShowBulkSend(false);
        } catch (err: any) {
            const message = err.response?.data?.message || "Bulk send failed";
            toast.error(message);
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-lg shadow-indigo-100"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Gallery...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Designs", value: templates.length, icon: LayoutGrid, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Engagement", value: "24.8%", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Leads", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Growth", value: "+12%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                        <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</div>
                            <div className="text-xl font-black text-gray-900">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Header / Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Campaign Hub</h2>
                    <p className="text-gray-500 text-sm font-medium">Design professional emails and grow your audience.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Find template..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-6 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-100/50 outline-none w-full md:w-64 transition-all"
                        />
                    </div>

                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => router.push("/templates/new")}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Plus size={18} className="stroke-[3px]" />
                        New Design
                    </button>
                </div>
            </div>

            {/* Template Grid */}
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredTemplates.map((template) => (
                    <div
                        key={template._id}
                        className={`group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 ${viewMode === "list" ? "flex flex-col md:flex-row h-auto md:h-48" : ""}`}
                    >
                        {/* Thumbnail Area */}
                        <div className={`${viewMode === "list" ? "md:w-64 h-48 md:h-full" : "h-48"} bg-gradient-to-br from-indigo-50/50 to-white flex items-center justify-center relative overflow-hidden`}>
                            {template.thumbnail ? (
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <div className="p-6 bg-white rounded-3xl shadow-sm">
                                        <FileText size={48} className="text-indigo-600" />
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-900">No Preview</span>
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-1.5 bg-white/95 backdrop-blur-xl border border-gray-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    {template.category}
                                </span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                <button
                                    onClick={() => router.push(`/templates/edit/${template._id}`)}
                                    className="bg-white text-indigo-600 p-4 rounded-3xl shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300"
                                    title="Edit Design"
                                >
                                    <Edit size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="font-black text-xl text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
                                    {template.name}
                                </h3>
                                <p className="text-gray-500 font-medium line-clamp-2 text-xs leading-relaxed mb-4">
                                    {template.description || "Transform your marketing strategy with this high-converting design."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                        {template.usageCount || 0}
                                    </div>
                                    <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sent</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(template._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedTemplate(template); setShowBulkSend(true); }}
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-600 shadow-md active:scale-95 transition-all"
                                    >
                                        <Send size={12} strokeWidth={3} /> BROADCAST
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && !loading && (
                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] w-fit mx-auto mb-6">
                        <FileText size={64} className="text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your Gallery is Empty</h3>
                    <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">Create beautiful templates and start reaching your audience effectively today.</p>
                    <button
                        onClick={() => router.push("/templates/new")}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
                    >
                        Design First Template
                    </button>
                </div>
            )}

            {/* Bulk Send Modal */}
            {showBulkSend && selectedTemplate && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Campaign Launch</h2>
                        <p className="text-gray-500 font-medium mb-8">
                            Deploying: <span className="text-indigo-600 font-bold">{selectedTemplate.name}</span>
                        </p>

                        <div className="mb-10 space-y-6">
                            <div>
                                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-3">Target Audience</label>
                                <select
                                    value={selectedSegmentId}
                                    onChange={(e) => setSelectedSegmentId(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 outline-none transition font-bold text-gray-700"
                                >
                                    <option value="">-- No Segment (Manual Input) --</option>
                                    {segments.map((s) => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.contactCount || 0} contacts)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                    <span className="px-4 bg-white text-gray-300">Or Manual Entry</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-3">Recipients (Emails or IDs)</label>
                                <textarea
                                    rows={4}
                                    value={recipientIds}
                                    onChange={(e) => setRecipientIds(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-3xl p-5 focus:ring-4 focus:ring-indigo-50 outline-none transition text-sm font-medium"
                                    placeholder="vendor@example.com, user_123..."
                                />
                                <div className="mt-3 flex items-start gap-2 text-[10px] text-gray-400 font-bold leading-relaxed px-2">
                                    <Zap size={14} className="text-amber-400 shrink-0" />
                                    Tip: You can now enter raw email addresses. Resend will automatically add them to your contacts.
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowBulkSend(false)}
                                className="flex-1 px-4 py-5 rounded-[1.5rem] font-bold text-gray-400 hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleBulkSend}
                                disabled={sending}
                                className="flex-[2] flex items-center justify-center gap-3 bg-indigo-600 text-white px-4 py-5 rounded-[1.5rem] hover:bg-indigo-700 disabled:bg-gray-200 shadow-xl shadow-indigo-100 transition-all font-black"
                            >
                                {sending ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <><Send size={20} className="stroke-[3px]" /> SHIP NOW</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
