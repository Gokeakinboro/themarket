
"use client"
import Link from "next/link"
export default function AgentSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agent Settings</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-gray-500 text-sm mb-4">Manage your profile and password.</p>
        <Link href="/dashboard/seller/settings" className="btn-primary inline-block">Go to Settings</Link>
      </div>
    </div>
  )
}
