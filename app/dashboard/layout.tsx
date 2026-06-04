
"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { redirect } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const path = usePathname()
  const user = session?.user as any

  if (status === "loading") return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>
  if (!session) { redirect("/login"); return null }

  const isAgent = user?.role === "AGENT"
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"

  const sellerLinks = [
    { href: "/dashboard/seller", label: "Overview" },
    { href: "/dashboard/seller/products", label: "My Products" },
    { href: "/dashboard/seller/orders", label: "Orders" },
    { href: "/dashboard/seller/settings", label: "Settings" },
  ]
  const agentLinks = [
    { href: "/dashboard/agent", label: "Overview" },
    { href: "/dashboard/agent/settings", label: "Settings" },
  ]
  const adminLinks = [
    { href: "/admin", label: "Analytics" },
    { href: "/admin/sellers", label: "Sellers" },
    { href: "/admin/agents", label: "Agents" },
    { href: "/admin/orders", label: "Orders" },
  ]

  const links = isAdmin ? adminLinks : isAgent ? agentLinks : sellerLinks

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-blue-800 text-white flex flex-col min-h-screen">
        <Link href="/" className="px-6 py-5 text-xl font-bold border-b border-blue-700">
          the<span className="text-blue-300">market</span>
        </Link>
        <div className="px-4 py-3 border-b border-blue-700">
          <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-1">
            {isAdmin ? "Admin" : isAgent ? "Agent" : "Seller"}
          </p>
          <p className="text-sm font-medium truncate">{user?.name}</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${path === l.href ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-700 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-6 py-4 text-sm text-blue-300 hover:text-white border-t border-blue-700 text-left transition-colors"
        >
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
