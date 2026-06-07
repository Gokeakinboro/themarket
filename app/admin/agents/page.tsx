"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function AdminAgentsInner() {
  const searchParams = useSearchParams()
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ id: string; rate: string } | null>(null)
  const [showCreate, setShowCreate] = useState(searchParams.get("create") === "1")
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", phone: "", state: "" })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  function load() {
    setLoading(true)
    fetch("/api/admin/users?role=AGENT").then(r => r.json()).then(d => { setAgents(d.users || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function setCommission(id: string, rate: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionRate: Number(rate) }),
    })
    setAgents(prev => prev.map(a => a.id === id ? { ...a, commissionRate: Number(rate) } : a))
    setEditing(null)
  }

  async function toggleSuspend(agent: any) {
    await fetch(`/api/admin/users/${agent.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: agent.isSuspended ? "unsuspend" : "suspend" }),
    })
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, isSuspended: !a.isSuspended } : a))
  }

  async function createAgent(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true); setCreateError("")
    const res = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...createForm, role: "AGENT" }),
    })
    setCreating(false)
    if (!res.ok) { const d = await res.json(); setCreateError(d.error || "Failed"); return }
    setShowCreate(false)
    setCreateForm({ name: "", email: "", password: "", phone: "", state: "" })
    load()
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">+ Create Agent</button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-4">Create Agent Account</h3>
            <form onSubmit={createAgent} className="space-y-3">
              {createError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{createError}</p>}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input className="input" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" className="input" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} required minLength={8} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input className="input" value={createForm.phone} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input className="input" value={createForm.state} onChange={e => setCreateForm(f => ({ ...f, state: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 disabled:opacity-60">{creating ? "Creating..." : "Create Agent"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Name", "Email", "Commission %", "Sellers Recruited", "Status", "Joined", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.email}</td>
                  <td className="px-4 py-3">
                    {editing?.id === a.id ? (
                      <div className="flex gap-2 items-center">
                        <input type="number" className="input w-16 text-sm py-1" value={editing.rate} onChange={e => setEditing({ id: a.id, rate: e.target.value })} min={0} max={100} />
                        <button onClick={() => setCommission(a.id, editing.rate)} className="text-xs text-blue-600 hover:underline">Save</button>
                        <button onClick={() => setEditing(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{a.commissionRate}%</span>
                        <button onClick={() => setEditing({ id: a.id, rate: String(a.commissionRate) })} className="text-xs text-blue-600 hover:underline">Edit</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{a.recruits?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (a.isSuspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700")}>
                      {a.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSuspend(a)} className={"text-xs hover:underline " + (a.isSuspended ? "text-green-600" : "text-orange-600")}>
                      {a.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {agents.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No agents yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default function AdminAgents() {
  return <Suspense fallback={<div className="text-gray-500">Loading...</div>}><AdminAgentsInner /></Suspense>
}
