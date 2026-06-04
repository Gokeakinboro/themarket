
"use client"
import { useEffect, useState } from "react"

export default function SellerSettings() {
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirm:"" })

  useEffect(()=>{ fetch("/api/seller/me").then(r=>r.json()).then(setUser) },[])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg("")
    const res = await fetch("/api/seller/me",{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name:user.name, businessName:user.businessName, phone1:user.phone1, phone2:user.phone2, businessAddress:user.businessAddress }),
    })
    setSaving(false)
    setMsg(res.ok ? "Profile saved." : "Save failed.")
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { setMsg("Passwords do not match"); return }
    setSaving(true); setMsg("")
    const res = await fetch("/api/seller/me",{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword }),
    })
    const data = await res.json()
    setSaving(false)
    setMsg(res.ok ? "Password changed." : data.error||"Failed")
    if (res.ok) setPwForm({ currentPassword:"", newPassword:"", confirm:"" })
  }

  if (!user) return <div className="text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      {msg && <p className={`text-sm p-3 rounded-lg ${msg.includes("failed")||msg.includes("error")||msg.includes("match")?"bg-red-50 text-red-600":"bg-green-50 text-green-700"}`}>{msg}</p>}

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input className="input" value={user.name||""} onChange={e=>setUser((u:any)=>({...u,name:e.target.value}))}/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input className="input bg-gray-50" value={user.email||""} disabled/></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input className="input" value={user.businessName||""} onChange={e=>setUser((u:any)=>({...u,businessName:e.target.value}))}/></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone 1</label><input className="input" value={user.phone1||""} onChange={e=>setUser((u:any)=>({...u,phone1:e.target.value}))}/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label><input className="input" value={user.phone2||""} onChange={e=>setUser((u:any)=>({...u,phone2:e.target.value}))}/></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label><input className="input" value={user.businessAddress||""} onChange={e=>setUser((u:any)=>({...u,businessAddress:e.target.value}))}/></div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving?"Saving...":"Save Changes"}</button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" className="input" value={pwForm.currentPassword} onChange={e=>setPwForm(f=>({...f,currentPassword:e.target.value}))} required/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" className="input" value={pwForm.newPassword} onChange={e=>setPwForm(f=>({...f,newPassword:e.target.value}))} required minLength={8}/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label><input type="password" className="input" value={pwForm.confirm} onChange={e=>setPwForm(f=>({...f,confirm:e.target.value}))} required/></div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving?"Saving...":"Change Password"}</button>
        </form>
      </div>

      {/* KYC status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">KYC Verification</h2>
        <div className="space-y-2">
          {[{label:"BVN", status:user.bvnStatus},{label:"NIN", status:user.ninStatus}].map(({label,status})=>(
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{label}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${status==="VERIFIED"?"bg-green-100 text-green-700":status==="FAILED"?"bg-red-100 text-red-600":"bg-yellow-100 text-yellow-700"}`}>{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
