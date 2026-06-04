
"use client"
import { useEffect, useState } from "react"

export default function AdminAgents() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{id:string;rate:string}|null>(null)

  useEffect(()=>{
    fetch("/api/admin/users?role=AGENT").then(r=>r.json()).then(d=>{ setAgents(d.users||[]); setLoading(false) })
  },[])

  async function setCommission(id: string, rate: string) {
    await fetch(`/api/admin/users/${id}`,{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ commissionRate: Number(rate) }),
    })
    setAgents(prev=>prev.map(a=>a.id===id?{...a,commissionRate:Number(rate)}:a))
    setEditing(null)
  }

  async function toggleSuspend(agent: any) {
    const action = agent.isSuspended ? "unsuspend" : "suspend"
    await fetch(`/api/admin/users/${agent.id}`,{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ action }),
    })
    setAgents(prev=>prev.map(a=>a.id===agent.id?{...a,isSuspended:!a.isSuspended}:a))
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agents</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Name","Email","Commission %","Sellers","Status","Actions"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map((a:any)=>(
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.email}</td>
                  <td className="px-4 py-3">
                    {editing?.id===a.id ? (
                      <div className="flex gap-2 items-center">
                        <input type="number" min={0} max={100} className="input w-20 text-sm py-1" value={editing?.rate ?? ""} onChange={e=>setEditing(ed=>ed?{...ed,rate:e.target.value}:null)}/>
                        <button onClick={()=>setCommission(a.id,editing?.rate ?? "0")} className="text-xs text-green-600 hover:underline">Save</button>
                        <button onClick={()=>setEditing(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                      </div>
                    ) : (
                      <span className="font-semibold text-blue-700 cursor-pointer hover:underline" onClick={()=>setEditing({id:a.id,rate:String(a.commissionRate||0)})}>
                        {a.commissionRate||0}% <span className="text-gray-400 font-normal text-xs">edit</span>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900">—</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.isSuspended?"bg-red-100 text-red-600":"bg-green-100 text-green-700"}`}>
                      {a.isSuspended?"Suspended":"Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>toggleSuspend(a)} className={`text-xs hover:underline ${a.isSuspended?"text-green-600":"text-orange-600"}`}>
                      {a.isSuspended?"Unsuspend":"Suspend"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
