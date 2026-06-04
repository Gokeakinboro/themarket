
"use client"
import { useEffect, useState } from "react"

const STATUS_COLORS: Record<string,string> = {
  PENDING_PAYMENT:"bg-gray-100 text-gray-600",
  PAID:"bg-yellow-100 text-yellow-700",
  IN_ESCROW:"bg-blue-100 text-blue-700",
  DELIVERED:"bg-teal-100 text-teal-700",
  RELEASED:"bg-green-100 text-green-700",
  DISPUTED:"bg-red-100 text-red-700",
  REFUNDED:"bg-orange-100 text-orange-700",
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [disputeForm, setDisputeForm] = useState<{orderId:string; reason:string} | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/orders").then(r=>r.json()).then(data => {
      setOrders(Array.isArray(data)?data:[]); setLoading(false)
    })
  }, [])

  async function fileDispute() {
    if (!disputeForm) return
    setSubmitting(true)
    const res = await fetch(`/api/orders/${disputeForm.orderId}/dispute`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ reason: disputeForm.reason }),
    })
    setSubmitting(false)
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id===disputeForm.orderId ? {...o, status:"DISPUTED"} : o))
      setDisputeForm(null)
    }
  }

  function canDispute(order: any) {
    if (!["IN_ESCROW","PAID"].includes(order.status)) return false
    const paidAt = order.paidAt || order.createdAt
    const hrs = (Date.now() - new Date(paidAt).getTime()) / (1000*60*60)
    return hrs <= 24
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No orders yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Product","Buyer","Amount","Status","Date","Action"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o:any)=>(
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-32">{o.product?.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{o.buyerName}</p>
                      <p className="text-xs text-gray-500">{o.buyerPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₦{o.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status]||"bg-gray-100 text-gray-600"}`}>
                        {o.status.replace(/_/g," ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {canDispute(o) && (
                        <button
                          onClick={()=>setDisputeForm({orderId:o.id, reason:""})}
                          className="text-xs text-red-600 hover:underline font-medium"
                        >
                          Report issue
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispute modal */}
      {disputeForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Report an Issue</h3>
            <p className="text-sm text-gray-500 mb-4">Describe the problem. Payment will be withheld until resolved.</p>
            <textarea
              className="input h-24 resize-none mb-4"
              placeholder="e.g. Item not received after 3 days..."
              value={disputeForm.reason}
              onChange={e=>setDisputeForm(f=>f?{...f,reason:e.target.value}:null)}
            />
            <div className="flex gap-3">
              <button onClick={()=>setDisputeForm(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={fileDispute} disabled={submitting||!disputeForm.reason} className="btn-primary flex-1 disabled:opacity-60">
                {submitting?"Submitting...":"File Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
