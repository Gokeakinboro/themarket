import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const orders = await prisma.order.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    include: {
      product: { include: { images: { take: 1, orderBy: { order: "asc" } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  return json(
    orders.map((o) => ({
      id: o.id,
      productTitle: o.product.title,
      amount: o.amount,
      type: o.buyerId === user.id ? "purchase" : "sale",
      status: o.status,
      canReport:
        o.buyerId === user.id &&
        o.status === "IN_ESCROW" &&
        o.escrowExpiresAt &&
        new Date() < o.escrowExpiresAt,
      createdAt: o.createdAt,
    }))
  )
}
