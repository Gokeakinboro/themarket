import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const neg = await prisma.negotiation.findUnique({
    where: { id },
    include: {
      product: { include: { images: { take: 1, orderBy: { order: "asc" } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!neg) return err("Negotiation not found", 404)
  if (neg.buyerId !== user.id && neg.sellerId !== user.id) return err("Forbidden", 403)

  return json({
    id: neg.id,
    productId: neg.productId,
    productTitle: neg.product.title,
    productPhoto: neg.product.images[0]?.url ?? "",
    listedPrice: neg.product.price,
    agreedPrice: neg.agreedPrice,
    status: neg.status,
    buyerId: neg.buyerId,
    sellerId: neg.sellerId,
    roundsUsed: neg.roundsUsed,
    expiresAt: neg.expiresAt,
    messages: neg.messages.map((m) => ({
      id: m.id, type: m.type, amount: m.amount, text: m.text,
      senderId: m.senderId, senderName: m.senderName, createdAt: m.createdAt,
    })),
    createdAt: neg.createdAt,
  })
}
