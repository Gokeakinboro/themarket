
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: { include: { images: true } },
      seller: { select: { name: true, businessName: true, phone1: true } },
      dispute: true,
      review: true,
    },
  })
  return order ? NextResponse.json(order) : NextResponse.json({ error: "Not found" }, { status: 404 })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as any

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()

  if (body.action === "confirm_delivery" && order.buyerId === user.id) {
    await prisma.order.update({ where: { id }, data: { status: "DELIVERED", deliveredAt: new Date() } })
    await prisma.order.update({ where: { id }, data: { status: "RELEASED", releasedAt: new Date() } })
    await prisma.product.update({ where: { id: order.productId }, data: { isSold: true } })
    await prisma.user.update({ where: { id: order.sellerId }, data: { salesCount: { increment: 1 } } })
    const seller = await prisma.user.findUnique({ where: { id: order.sellerId } })
    if (seller && seller.salesCount >= 100 && !seller.trustedBadge) {
      await prisma.user.update({ where: { id: order.sellerId }, data: { trustedBadge: true } })
    }
    return NextResponse.json({ success: true, status: "RELEASED" })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
