"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface AdminUser {
  id: string; name: string; email: string; role: string;
  isSuspended: boolean; createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const isSuperAdmin = (session?.user as any)?.role === "SUPER_ADMIN"

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  function load() {
    setLoading(true)
    fetch("/api/admin/users?role=ADMIN")
      .then(r => r.json())
      .then(d => {
        const admins = (d.users || []).filter(
          (u: AdminUser) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
        )
        setUsers(admins)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true); setError("")
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setCreating(false)
    if (!res.ok) { const d = await res.json(); setError(d.error || "Failed to create"); return }
    setShowCreate(false)
    setForm({ name: "", email: "", password: "", role: "ADMIN" })
    load()
  }

  async function toggle(id: string, isSuspended: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isSuspended ? "unsuspend" : "suspend" }),
    })
    setUsers(u => u.map(x => x.id === id ? { ...x, isSuspended: !x.isSuspended } : x))
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
        {isSuperAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
            + Add Admin
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "Role", "Status", "Joined", ...(isSuperAdmin ? ["Actions"] : [])].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")}>
                    {u.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (u.isSuspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700")}>
                    {u.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                {isSuperAdmin && u.role !== "SUPER_ADMIN" && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(u.id, u.isSuspended)}
                      className={"text-xs hover:underline " + (u.isSuspended ? "text-green-600" : "text-orange-600")}
                    >
                      {u.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                )}
                {isSuperAdmin && u.role === "SUPER_ADMIN" && <td className="px-4 py-3" />}
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-10">No admin users yet.</p>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-4">Create Admin User</h3>
            <form onSubmit={create} className="space-y-4">
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 disabled:opacity-60">
                  {creating ? "Creating..." : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
