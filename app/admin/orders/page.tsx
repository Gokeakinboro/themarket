
"use client"
import { useEffect, useState } from "react"

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch("/api/orders").then(r=>r.json()).then(d=>{ setOrders(Array.isArray(d)?d:[]); setLoading(false) })
  },[])

  const disputed = orders.filter(o=>o.status==="DISPUTED")
  const escrow = orders.filter(o=>o.status==="IN_ESCROW")

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      {disputed.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-800 font-semibold">{disputed.length} disputed order{disputed.length>1?"s":""} require attention</p>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Product","Buyer","Seller","Amount","Status","Date"].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o:any)=>(
                <tr key={o.id} className={`hover:bg-gray-50 ${o.status==="DISPUTED"?"bg-red-50":""}`}>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-28 truncate">{o.product?.title}</td>
                  <td className="px-4 py-3 text-gray-900">{o.buyerName}</td>
                  <td className="px-4 py-3 text-gray-500">{o.seller?.name}</td>
                  <td className="px-4 py-3 font-semibold">₦{o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status==="RELEASED"?"bg-green-100 text-green-700":o.status==="DISPUTED"?"bg-red-100 text-red-700":o.status==="IN_ESCROW"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-600"}`}>
                      {o.status.replace(/_/g," ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
