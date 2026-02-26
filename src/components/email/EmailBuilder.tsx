"use client"

import { useState } from "react"
import { Plus, X, Copy, Code, Eye, CheckCircle, FileText } from "lucide-react"
import { toast } from "react-hot-toast"

interface EmailBlock {
  id: string
  type: "text" | "image" | "button" | "divider" | "header" | "footer" | "product"
  content: string
  settings: Record<string, any>
}

interface EmailBuilderProps {
  initialName?: string
  initialCategory?: string
  initialContent?: string
  initialBlocks?: EmailBlock[]
  onSave?: (name: string, category: string, html: string, blocks: EmailBlock[]) => void
}

export default function EmailBuilder({
  initialName = "New Template",
  initialCategory = "newsletter",
  initialContent = "",
  initialBlocks = [],
  onSave
}: EmailBuilderProps) {
  const [name, setName] = useState(initialName)
  const [category, setCategory] = useState(initialCategory)
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewType, setPreviewType] = useState<"desktop" | "mobile">("desktop")

  const addBlock = (type: EmailBlock["type"]) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type),
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
    setSelectedBlockId(null)
  }

  const duplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find((b) => b.id === id)
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now() + Math.random()}`,
      }
      setBlocks([...blocks, newBlock])
    }
  }

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const generateHTML = () => {
    const blocksHTML = blocks
      .map((block) => generateBlockHTML(block))
      .join("")

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f9fafb; }
    .email-container { max-width: 600px; margin: 0 auto; background: white; }
    .text-block { padding: 20px; line-height: 1.6; color: #374151; }
    .button { text-align: center; padding: 20px; }
    .button a { display: inline-block; padding: 12px 32px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .image { padding: 0; text-align: center; }
    .image img { max-width: 100%; height: auto; display: block; }
    .divider { padding: 20px; text-align: center; }
    .divider hr { border: none; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="email-container">
    ${blocksHTML}
  </div>
</body>
</html>`
  }

  const generateBlockHTML = (block: EmailBlock): string => {
    switch (block.type) {
      case "header":
        return `<div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #f3f4f6;">
          <h1 style="margin: 0; color: #111827; font-size: 24px;">${block.content}</h1>
        </div>`
      case "text":
        return `<div class="text-block">${block.content}</div>`
      case "button":
        return `<div class="button"><a href="${block.settings.url || "#"}">${block.content}</a></div>`
      case "image":
        const imgWidth = block.settings.width || "100%";
        return `<div class="image" style="padding: 10px 0; text-align: center;">
          <img 
            src="${block.content || 'https://via.placeholder.com/600x300?text=No+Image+Selected'}" 
            alt="Email image" 
            style="max-width: 100%; height: auto; display: inline-block; border: none; outline: none; text-decoration: none;"
            width="${imgWidth.includes('%') ? '' : imgWidth}"
          >
        </div>`
      case "divider":
        return `<div class="divider"><hr></div>`
      case "product":
        return `<div style="padding: 24px; border: 1px solid #f3f4f6; margin: 20px; border-radius: 12px; background: #ffffff;">
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #111827;">${block.content}</p>
          <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">${block.settings.description || ""}</p>
          <p style="margin: 0; font-size: 20px; color: #4F46E5; font-weight: bold;">$${block.settings.price || "0"}</p>
        </div>`
      case "footer":
        return `<div style="padding: 30px 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>${block.content}</p>
        </div>`
      default:
        return ""
    }
  }

  const getDefaultContent = (type: EmailBlock["type"]): string => {
    const defaults: Record<EmailBlock["type"], string> = {
      text: "Transform your brand with our latest collection. Experience premium quality and timeless design.",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80",
      button: "Shop The Collection",
      divider: "",
      header: "Summer Essence",
      footer: "© 2026 Your Brand Elite. You received this because you are a valued member.",
      product: "Premium Leather Watch",
    }
    return defaults[type]
  }

  const getDefaultSettings = (type: EmailBlock["type"]): Record<string, any> => {
    return {
      text: {},
      image: { width: "100%" },
      button: { url: "#" },
      divider: {},
      header: {},
      footer: {},
      product: { type: "best_seller", price: "199", description: "Italian hand-crafted leather", category: "" },
    }[type] || {}
  }

  const handleSave = () => {
    const html = generateHTML()
    onSave?.(name, category, html, blocks)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm relative z-20">
        <div className="flex gap-6 items-center flex-1">
          <div className="flex-1 max-w-xs">
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-bold border-none p-0 focus:ring-0 outline-none w-full bg-transparent placeholder:text-gray-300"
              placeholder="Summer Sale 2026..."
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <div className="h-8 border-l border-gray-100 hidden md:block"></div>

          <div className="hidden sm:block">
            <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs font-bold border-none p-0 focus:ring-0 outline-none bg-transparent cursor-pointer text-indigo-600 uppercase"
            >
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="transactional">Transactional</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all active:scale-95 ${previewMode
              ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner"
              : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600 shadow-sm"
              }`}
          >
            {previewMode ? <Plus size={18} /> : <Eye size={18} />}
            {previewMode ? "Continue Editing" : "Live Preview"}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            <CheckCircle size={18} />
            Save & Exit
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Block Palette */}
        {(!previewMode) && (
          <div className="w-72 bg-white border-r overflow-y-auto p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Design Blocks</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(["header", "text", "image", "button", "divider", "product", "footer"] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="group w-full flex items-center justify-between px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-500 transition-colors">
                        {type === 'header' && <FileText size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'text' && <Code size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'image' && <Eye size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'button' && <Copy size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'divider' && <Plus size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'product' && <Plus size={16} className="text-indigo-600 group-hover:text-white" />}
                        {type === 'footer' && <FileText size={16} className="text-indigo-600 group-hover:text-white" />}
                      </div>
                      <span className="text-xs font-bold capitalize tracking-wide">{type}</span>
                    </div>
                    <Plus size={14} className="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all" />
                  </button>
                )
              )}
            </div>

            {/* Selected block settings */}
            {selectedBlockId && (
              <div className="mt-10 pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Settings</h4>
                  <button onClick={() => setSelectedBlockId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <BlockSettings
                  block={blocks.find((b) => b.id === selectedBlockId)!}
                  onUpdate={(updates) => updateBlock(selectedBlockId, updates)}
                />
              </div>
            )}
          </div>
        )}

        {/* Canvas / Preview */}
        <div className={`flex-1 overflow-y-auto bg-gray-50/50 transition-all duration-500 ${previewMode ? 'p-0' : 'p-8'}`}>
          {previewMode ? (
            <div className="h-full flex flex-col bg-gray-200/50">
              {/* Device Toggle */}
              <div className="bg-white border-b py-3 flex justify-center gap-3 shadow-sm sticky top-0 z-10 transition-all">
                <button
                  onClick={() => setPreviewType("desktop")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${previewType === "desktop" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                >
                  <Eye size={16} /> Desktop View
                </button>
                <button
                  onClick={() => setPreviewType("mobile")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${previewType === "mobile" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                >
                  <Plus size={16} /> Mobile View
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 flex justify-center items-start">
                <div
                  className={`bg-white shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border border-gray-100 rounded-b-2xl overflow-hidden ${previewType === "mobile" ? "max-w-[375px] w-full" : "max-w-3xl w-full"
                    }`}
                  style={{ minHeight: "800px" }}
                >
                  <iframe
                    srcDoc={generateHTML()}
                    className="w-full h-full border-0 min-h-[800px]"
                    title="Email Preview"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {blocks.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 group">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={32} />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1">Start your design</h3>
                  <p className="text-gray-400 text-sm">Add blocks from the left panel to build your email.</p>
                </div>
              ) : (
                blocks.map((block) => (
                  <BlockPreview
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onRemove={() => removeBlock(block.id)}
                    onDuplicate={() => duplicateBlock(block.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BlockPreview({
  block,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
}: {
  block: EmailBlock
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-0 bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? "border-indigo-600 shadow-lg shadow-indigo-50" : "border-transparent hover:border-gray-200 shadow-sm"
        }`}
    >
      <div className={`p-4 flex justify-between items-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest">{block.type}</span>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate() }}
            className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'hover:bg-red-500' : 'hover:bg-red-50 hover:text-red-500'}`}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {block.type === "image" ? (
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center min-h-[100px]">
            <img
              src={block.content}
              alt="Preview"
              className="max-w-full h-auto max-h-[300px] object-contain transition-all"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL"
              }}
            />
          </div>
        ) : block.type === "product" ? (
          <div className="flex gap-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-300">
              IMG
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 mb-1">{block.content}</div>
              <div className="text-sm text-indigo-600 font-bold">${block.settings.price || "0"}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 leading-relaxed">{block.content}</div>
        )}
      </div>
    </div>
  )
}

function BlockSettings({
  block,
  onUpdate,
}: {
  block: EmailBlock
  onUpdate: (updates: Partial<EmailBlock>) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">
          {block.type === "image" ? "Image URL" : block.type === "button" ? "Button Label" : "Content"}
        </label>
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
          rows={block.type === "text" ? 6 : 2}
          placeholder={block.type === "image" ? "https://example.com/image.jpg" : ""}
        />
      </div>

      {block.type === "image" && (
        <>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <img
              src={block.content}
              alt="Settings Preview"
              className="w-full h-32 object-contain rounded-xl"
              onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x100?text=Invalid+URL"}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Width (%)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={block.settings.width || "100%"}
                onChange={(e) =>
                  onUpdate({
                    settings: { ...block.settings, width: e.target.value },
                  })
                }
                className="flex-1 border-gray-100 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
              />
              <select
                onChange={(e) => onUpdate({ settings: { ...block.settings, width: e.target.value } })}
                className="border-gray-100 rounded-2xl px-3 py-2 text-xs bg-white outline-none cursor-pointer"
              >
                <option value="100%">Full</option>
                <option value="50%">Half</option>
                <option value="75%">3/4</option>
              </select>
            </div>
          </div>
        </>
      )}

      {block.type === "button" && (
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Link URL</label>
          <input
            type="url"
            value={block.settings.url || ""}
            onChange={(e) =>
              onUpdate({
                settings: { ...block.settings, url: e.target.value },
              })
            }
            className="w-full border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
            placeholder="https://yourstore.com/summer-collection"
          />
        </div>
      )}

      {block.type === "product" && (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Auto-Pull From</label>
            <select
              value={block.settings.type || "best_seller"}
              onChange={(e) =>
                onUpdate({
                  settings: { ...block.settings, type: e.target.value },
                })
              }
              className="w-full border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white cursor-pointer"
            >
              <option value="best_seller">Best-Sellers List</option>
              <option value="category">Specific Category</option>
              <option value="manual">Manual Entry</option>
            </select>
          </div>

          {block.settings.type === "category" && (
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Target Category</label>
              <input
                type="text"
                value={block.settings.category || ""}
                onChange={(e) =>
                  onUpdate({
                    settings: { ...block.settings, category: e.target.value },
                  })
                }
                className="w-full border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                placeholder="Electronics, Home, etc."
              />
            </div>
          )}

          {block.settings.type === "manual" && (
            <>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={block.settings.price || "0"}
                    onChange={(e) =>
                      onUpdate({
                        settings: { ...block.settings, price: e.target.value },
                      })
                    }
                    className="w-full border-gray-100 rounded-2xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Description</label>
                <textarea
                  value={block.settings.description || ""}
                  onChange={(e) =>
                    onUpdate({
                      settings: { ...block.settings, description: e.target.value },
                    })
                  }
                  className="w-full border-gray-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50/50"
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
