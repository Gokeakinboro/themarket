import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Completed orders by this buyer, without a review, within 7 days
  const orders = await prisma.order.findMany({
    where: {
      buyerId: user.id,
      status: { in: ["RELEASED", "DELIVERED"] },
      review: null,
      OR: [
        { releasedAt: { gte: sevenDaysAgo } },
        { deliveredAt: { gte: sevenDaysAgo } },
      ],
    },
    include: {
      product: { select: { title: true } },
      seller: { select: { id: true, name: true, businessName: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return json(
    orders.map((o) => ({
      transactionId: o.id,
      sellerId: o.sellerId,
      sellerName: o.seller.businessName ?? o.seller.name,
      productTitle: o.product.title,
    }))
  )
}
