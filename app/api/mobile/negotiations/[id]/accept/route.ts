import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const neg = await prisma.negotiation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  })

  if (!neg) return err("Negotiation not found", 404)
  if (neg.buyerId !== user.id && neg.sellerId !== user.id) return err("Forbidden", 403)
  if (neg.status !== "ACTIVE") return err("Negotiation is no longer active")

  const lastMsg = neg.messages[0]
  if (!lastMsg?.amount) return err("No offer to accept")
  // The recipient accepts — the sender cannot accept their own offer
  if (lastMsg.senderId === user.id) return err("You cannot accept your own offer")

  const updated = await prisma.negotiation.update({
    where: { id },
    data: {
      status: "ACCEPTED",
      agreedPrice: lastMsg.amount,
      messages: {
        create: { type: "ACCEPT", senderId: user.id, senderName: user.name, text: "Offer accepted" },
      },
    },
  })

  return json({ success: true, agreedPrice: updated.agreedPrice, status: updated.status })
}
