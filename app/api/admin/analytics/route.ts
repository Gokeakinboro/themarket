
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [
    totalSellers, totalAgents, totalProducts, totalOrders,
    totalRevenue, activeDisputes, pendingKyc,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "AGENT" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: { in: ["RELEASED", "DELIVERED"] } }, _sum: { amount: true } }),
    prisma.dispute.count({ where: { status: "OPEN" } }),
    prisma.user.count({ where: { OR: [{ bvnStatus: "PENDING" }, { ninStatus: "PENDING" }] } }),
  ])

  return NextResponse.json({
    totalSellers, totalAgents, totalProducts, totalOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
    activeDisputes, pendingKyc,
  })
}
