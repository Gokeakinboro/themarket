"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.replace("/login"); return }
    const role = (session.user as any)?.role
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      router.replace("/admin")
    } else if (role === "AGENT") {
      router.replace("/dashboard/agent")
    } else {
      router.replace("/dashboard/seller")
    }
  }, [status, session])

  return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Redirecting...</div></div>
}
