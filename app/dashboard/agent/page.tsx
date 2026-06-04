
"use client"
import { useEffect, useState } from "react"

export default function AgentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch("/api/seller/me").then(r=>r.json()).then(u=>{ setUser(u); setLoading(false) })
  },[])

  if (loading) return <div className="text-gray-500">Loading...</div>

  const recruits = user?.recruits || []
  const now = new Date()

  // Filter active (within 1 year of joining)
  const activeSellers = recruits.filter((s:any) => {
    const diff = (now.getTime() - new Date(s.createdAt).getTime()) / (1000*60*60*24*365)
    return diff <= 1
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your commission rate: <strong>{user?.commissionRate}%</strong></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Recruited</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{recruits.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Active Sellers (under 1yr)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{activeSellers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Commission Rate</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{user?.commissionRate}%</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            readOnly
            value={`${typeof window!=="undefined"?window.location.origin:""}/register?ref=${user?.id}`}
            className="input bg-white text-sm flex-1"
          />
          <button
            onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id}`)}
            className="btn-primary text-sm"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-2">Share to recruit sellers. You earn {user?.commissionRate}% of their monthly fees for 1 year.</p>
      </div>

      {/* Sellers table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recruited Sellers</h2>
        </div>
        {recruits.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No sellers recruited yet. Share your referral link to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Name","Email","Sales","Joined","Status"].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recruits.map((s:any)=>{
                const yearsIn = (now.getTime()-new Date(s.createdAt).getTime())/(1000*60*60*24*365)
                const active = yearsIn <= 1
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3 text-gray-900">{s.salesCount}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${active?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>
                        {active?"Active":"Expired"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
