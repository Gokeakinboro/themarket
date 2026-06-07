"use client"
import { useEffect, useState, useRef } from "react"

type EmailTemplate = {
  id: string
  key: string
  name: string
  subject: string
  html: string
  updatedAt: string
}

const VARIABLE_HINTS: Record<string, string> = {
  welcome: "{{name}}",
  order_seller: "{{sellerName}}, {{productTitle}}, {{amount}}, {{buyerName}}, {{buyerPhone}}, {{buyerEmail}}, {{buyerAddress}}, {{orderId}}",
  buyer_confirmation: "{{buyerName}}, {{productTitle}}, {{amount}}, {{orderId}}",
}

export default function AdminEmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedKey, setSelectedKey] = useState("welcome")
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    fetch("/api/admin/email-templates")
      .then(r => r.json())
      .then((data: EmailTemplate[]) => {
        setTemplates(data)
        const initial = data.find(t => t.key === "welcome") || data[0]
        if (initial) setEditing({ ...initial })
      })
  }, [])

  function selectTemplate(t: EmailTemplate) {
    setSelectedKey(t.key)
    setEditing({ ...t })
    setMessage(null)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/email-templates/${editing.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editing.name, subject: editing.subject, html: editing.html }),
      })
      if (!res.ok) throw new Error("Save failed")
      const updated: EmailTemplate = await res.json()
      setTemplates(prev => prev.map(t => t.key === updated.key ? updated : t))
      setEditing({ ...updated })
      setMessage({ type: "success", text: "Template saved successfully." })
    } catch {
      setMessage({ type: "error", text: "Failed to save template. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  function openPreview() {
    setShowPreview(true)
    setTimeout(() => dialogRef.current?.showModal(), 50)
  }

  function closePreview() {
    dialogRef.current?.close()
    setShowPreview(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Templates</h1>
      <p className="text-sm text-gray-500 mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        Use <code className="font-mono bg-blue-100 px-1 rounded">{"{{variableName}}"}</code> placeholders — they are replaced automatically when the email is sent.
      </p>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Templates</p>
            </div>
            <ul>
              {templates.map(t => (
                <li key={t.key}>
                  <button
                    onClick={() => selectTemplate(t)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 transition-colors ${
                      selectedKey === t.key
                        ? "bg-blue-50 border-l-4 border-l-blue-700"
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedKey === t.key ? "text-blue-700" : "text-gray-900"}`}>
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(t.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Editor panel */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Template Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject Line</label>
                <input
                  type="text"
                  value={editing.subject}
                  onChange={e => setEditing(prev => prev ? { ...prev, subject: e.target.value } : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                />
                {VARIABLE_HINTS[editing.key] && (
                  <p className="mt-1.5 text-xs text-gray-400">
                    Available: <span className="font-mono">{VARIABLE_HINTS[editing.key]}</span>
                  </p>
                )}
              </div>

              {/* HTML body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">HTML Body</label>
                <textarea
                  value={editing.html}
                  onChange={e => setEditing(prev => prev ? { ...prev, html: e.target.value } : prev)}
                  style={{ minHeight: 400, fontFamily: "monospace", fontSize: 13 }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent resize-y"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : "Save Template"}
                </button>
                <button
                  onClick={openPreview}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Preview
                </button>
              </div>

              {message && (
                <div className={`text-sm px-4 py-3 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-400 text-sm">
              Select a template to edit.
            </div>
          )}
        </div>
      </div>

      {/* Preview dialog */}
      {showPreview && editing && (
        <dialog
          ref={dialogRef}
          className="w-full max-w-3xl rounded-xl shadow-2xl p-0 backdrop:bg-black/40"
          onClick={e => { if (e.target === dialogRef.current) closePreview() }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Email Preview — {editing.name}</h2>
            <button
              onClick={closePreview}
              className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              aria-label="Close preview"
            >
              &times;
            </button>
          </div>
          <div className="p-1">
            <iframe
              srcDoc={editing.html}
              title="Email preview"
              className="w-full rounded-b-xl border-0"
              style={{ height: 560 }}
            />
          </div>
        </dialog>
      )}
    </div>
  )
}
