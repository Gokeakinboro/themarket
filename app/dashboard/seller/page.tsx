
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/seller/me").then(r=>r.json()),
      fetch("/api/orders").then(r=>r.json()),
    ]).then(([u, o]) => {
      setUser(u); setOrders(Array.isArray(o) ? o : [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  const activeOrders = orders.filter(o => ["IN_ESCROW","PAID"].includes(o.status))
  const released = orders.filter(o => o.status === "RELEASED")
  const totalEarned = released.reduce((sum:number, o:any) => sum + o.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(" ")[0]}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Member since {new Date(user?.createdAt).toLocaleDateString("en-NG", { year:"numeric", month:"long" })}
            {user?.trustedBadge && <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">✓ Trusted Seller</span>}
          </p>
        </div>
        <Link href="/dashboard/seller/products" className="btn-primary">+ Add Product</Link>
      </div>

      {/* KYC status */}
      {(user?.bvnStatus !== "VERIFIED" || user?.ninStatus !== "VERIFIED") && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm font-medium">KYC Verification Pending</p>
          <p className="text-amber-700 text-xs mt-1">BVN: {user?.bvnStatus} · NIN: {user?.ninStatus}. Verification is automatic and usually completes within minutes.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Sales", value: user?.salesCount || 0 },
          { label: "Active Orders", value: activeOrders.length },
          { label: "Total Earned", value: `₦${totalEarned.toLocaleString()}` },
          { label: "Products", value: "-" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/seller/orders" className="text-sm text-blue-700 hover:underline">View all</Link>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No orders yet.</p>
            <Link href="/dashboard/seller/products" className="text-blue-700 hover:underline text-sm mt-2 inline-block">Add products to start selling</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.slice(0,5).map((o:any) => (
              <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{o.product?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.buyerName} · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₦{o.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    o.status==="RELEASED"?"bg-green-100 text-green-700":
                    o.status==="IN_ESCROW"?"bg-blue-100 text-blue-700":
                    o.status==="DISPUTED"?"bg-red-100 text-red-700":
                    "bg-gray-100 text-gray-600"
                  }`}>{o.status.replace("_"," ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent referral link */}
      {user?.role === "AGENT" && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">Your Agent Referral Link</h3>
          <div className="flex gap-2">
            <input readOnly value={`${typeof window!=="undefined"?window.location.origin:""}/register?ref=${user?.id}`} className="input bg-white text-sm flex-1" />
            <button onClick={()=>navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id}`)} className="btn-primary text-sm">Copy</button>
          </div>
          <p className="text-xs text-blue-600 mt-2">Share this link to recruit sellers under your account.</p>
        </div>
      )}
    </div>
  )
}
