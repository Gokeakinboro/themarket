"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(s => { setStats(s); setLoading(false) })
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>

  const cards = [
    { label: "Total Sellers", value: stats.totalSellers, link: "/admin/sellers" },
    { label: "Total Agents", value: stats.totalAgents, link: "/admin/agents" },
    { label: "Active Products", value: stats.totalProducts, link: "/admin/sellers" },
    { label: "Total Orders", value: stats.totalOrders, link: "/admin/orders" },
    { label: "Revenue Released", value: `₦${(stats.totalRevenue || 0).toLocaleString()}`, link: "/admin/orders" },
    { label: "Open Disputes", value: stats.activeDisputes, link: "/admin/orders?status=DISPUTED" },
    { label: "Pending KYC", value: stats.pendingKyc, link: "/admin/sellers?kyc=pending" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Platform Analytics</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <Link key={c.label} href={c.link} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-700 transition-colors group">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-blue-700 transition-colors">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/sellers?create=1" className="block py-2 px-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
              + Create Seller Account
            </Link>
            <Link href="/admin/agents?create=1" className="block py-2 px-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
              + Create Agent Account
            </Link>
            <Link href="/admin/admins" className="block py-2 px-4 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
              + Manage Admin Users
            </Link>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Platform Status</h2>
          <div className="space-y-3">
            {[
              { label: "Escrow service", status: "Operational" },
              { label: "KYC verification", status: "Active" },
              { label: "Email notifications", status: "Active" },
              { label: "WhatsApp alerts", status: "Active" },
            ].map(({ label, status }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="text-green-600 font-medium">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
