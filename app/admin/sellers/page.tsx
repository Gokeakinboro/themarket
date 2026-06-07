"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface User {
  id: string; name: string; email: string; salesCount: number;
  bvnStatus: string; ninStatus: string; isSuspended: boolean;
  trustedBadge: boolean; createdAt: string;
}

function AdminSellersInner() {
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [action, setAction] = useState<{ type: string; userId: string } | null>(null)
  const [input, setInput] = useState("")
  const [showCreate, setShowCreate] = useState(searchParams.get("create") === "1")
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", phone: "", state: "", city: "" })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  function load() {
    setLoading(true)
    fetch("/api/admin/users?role=SELLER").then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function doAction(type: string, userId: string, value?: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(type === "reset" ? { password: value } : { action: type }),
    })
    if (type === "suspend") setUsers(u => u.map(x => x.id === userId ? { ...x, isSuspended: true } : x))
    if (type === "unsuspend") setUsers(u => u.map(x => x.id === userId ? { ...x, isSuspended: false } : x))
    setAction(null); setInput("")
  }

  async function createSeller(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true); setCreateError("")
    const res = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...createForm, role: "SELLER" }),
    })
    setCreating(false)
    if (!res.ok) { const d = await res.json(); setCreateError(d.error || "Failed"); return }
    setShowCreate(false)
    setCreateForm({ name: "", email: "", password: "", phone: "", state: "", city: "" })
    load()
  }

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
        <div className="flex gap-3">
          <input className="input w-56 text-sm" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">+ Create Seller</button>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-4">Create Seller Account</h3>
            <form onSubmit={createSeller} className="space-y-3">
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
                <button type="submit" disabled={creating} className="btn-primary flex-1 disabled:opacity-60">{creating ? "Creating..." : "Create Seller"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Name", "Email", "Sales", "KYC", "Status", "Joined", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    {u.trustedBadge && <span className="text-xs text-blue-600">✓ Trusted</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-gray-900">{u.salesCount}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs space-y-0.5">
                      <span className={"block " + (u.bvnStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600")}>BVN: {u.bvnStatus}</span>
                      <span className={"block " + (u.ninStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600")}>NIN: {u.ninStatus}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (u.isSuspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700")}>
                      {u.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setAction({ type: u.isSuspended ? "unsuspend" : "suspend", userId: u.id })} className={"text-xs hover:underline " + (u.isSuspended ? "text-green-600" : "text-orange-600")}>
                        {u.isSuspended ? "Unsuspend" : "Suspend"}
                      </button>
                      <button onClick={() => { setAction({ type: "reset", userId: u.id }); setInput("") }} className="text-xs text-blue-600 hover:underline">Reset PW</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-10 text-sm">No sellers found.</p>}
        </div>
      </div>

      {action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            {action.type === "reset" ? (
              <>
                <h3 className="font-bold text-gray-900 mb-4">Reset Password</h3>
                <input type="password" className="input mb-4" placeholder="New password" value={input} onChange={e => setInput(e.target.value)} minLength={8} />
                <div className="flex gap-3">
                  <button onClick={() => setAction(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={() => doAction("reset", action.userId, input)} className="btn-primary flex-1">Reset</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Confirm {action.type}?</h3>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setAction(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={() => doAction(action.type, action.userId)} className="btn-primary flex-1">Confirm</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminSellers() {
  return <Suspense fallback={<div className="text-gray-500">Loading...</div>}><AdminSellersInner /></Suspense>
}
