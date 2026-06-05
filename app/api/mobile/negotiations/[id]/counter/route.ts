import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

const MAX_ROUNDS = 5

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const { amount, message } = await req.json()
  if (!amount || amount <= 0) return err("Valid counter amount is required")

  const neg = await prisma.negotiation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  })

  if (!neg) return err("Negotiation not found", 404)
  if (neg.buyerId !== user.id && neg.sellerId !== user.id) return err("Forbidden", 403)
  if (neg.status !== "ACTIVE") return err("Negotiation is no longer active")
  if (neg.roundsUsed >= MAX_ROUNDS) return err("Maximum rounds reached. Accept or decline.")

  const lastMsg = neg.messages[0]
  if (lastMsg?.senderId === user.id) return err("It is not your turn")

  const updated = await prisma.negotiation.update({
    where: { id },
    data: {
      roundsUsed: { increment: 1 },
      messages: {
        create: {
          type: "COUNTER",
          amount,
          text: message || null,
          senderId: user.id,
          senderName: user.name,
        },
      },
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  })

  return json({ success: true, roundsUsed: updated.roundsUsed })
}
