
"use client"
import { useEffect, useState } from "react"

export default function AdminSellers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [action, setAction] = useState<{type:string;userId:string;value?:string}|null>(null)
  const [input, setInput] = useState("")

  useEffect(()=>{
    fetch("/api/admin/users?role=SELLER").then(r=>r.json()).then(d=>{ setUsers(d.users||[]); setLoading(false) })
  },[])

  async function doAction(type: string, userId: string, value?: string) {
    await fetch(`/api/admin/users/${userId}`,{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(type==="commission"?{commissionRate:value}:type==="reset"?{password:value}:{action:type}),
    })
    if (type==="suspend") setUsers(u=>u.map(x=>x.id===userId?{...x,isSuspended:true}:x))
    if (type==="unsuspend") setUsers(u=>u.map(x=>x.id===userId?{...x,isSuspended:false}:x))
    setAction(null); setInput("")
  }

  const filtered = users.filter(u=>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>
        <input className="input w-64 text-sm" placeholder="Search name or email..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Name","Email","Sales","KYC","Status","Joined","Actions"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u:any)=>(
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{u.name}</p>
                    {u.trustedBadge && <span className="text-xs text-blue-600">✓ Trusted</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-gray-900">{u.salesCount}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs space-y-0.5">
                      <span className={`block ${u.bvnStatus==="VERIFIED"?"text-green-600":"text-yellow-600"}`}>BVN: {u.bvnStatus}</span>
                      <span className={`block ${u.ninStatus==="VERIFIED"?"text-green-600":"text-yellow-600"}`}>NIN: {u.ninStatus}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isSuspended?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}`}>
                      {u.isSuspended?"Suspended":"Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={()=>setAction({type:u.isSuspended?"unsuspend":"suspend",userId:u.id})} className={`text-xs hover:underline ${u.isSuspended?"text-green-600":"text-orange-600"}`}>
                        {u.isSuspended?"Unsuspend":"Suspend"}
                      </button>
                      <button onClick={()=>{setAction({type:"reset",userId:u.id});setInput("")}} className="text-xs text-blue-600 hover:underline">Reset PW</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action modal */}
      {action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            {action.type==="reset" ? (
              <>
                <h3 className="font-bold text-gray-900 mb-4">Reset Password</h3>
                <input type="password" className="input mb-4" placeholder="New password" value={input} onChange={e=>setInput(e.target.value)} minLength={8}/>
                <div className="flex gap-3">
                  <button onClick={()=>setAction(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={()=>doAction("reset",action.userId,input)} className="btn-primary flex-1">Reset</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Confirm {action.type}?</h3>
                <div className="flex gap-3 mt-4">
                  <button onClick={()=>setAction(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={()=>doAction(action.type,action.userId)} className="btn-primary flex-1">Confirm</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
