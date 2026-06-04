
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as any

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (order.buyerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  if (!["IN_ESCROW", "PAID"].includes(order.status)) {
    return NextResponse.json({ error: "Cannot dispute this order" }, { status: 400 })
  }

  const paidAt = order.paidAt || order.createdAt
  const hoursSincePaid = (Date.now() - new Date(paidAt).getTime()) / (1000 * 60 * 60)
  if (hoursSincePaid > 24) {
    return NextResponse.json({ error: "Dispute window has expired (24 hours from payment)" }, { status: 400 })
  }

  const existing = await prisma.dispute.findUnique({ where: { orderId: id } })
  if (existing) return NextResponse.json({ error: "Dispute already filed" }, { status: 409 })

  const { reason } = await req.json()
  const dispute = await prisma.dispute.create({ data: { orderId: id, reason } })
  await prisma.order.update({ where: { id }, data: { status: "DISPUTED" } })

  return NextResponse.json(dispute, { status: 201 })
}
