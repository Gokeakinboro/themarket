import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const neg = await prisma.negotiation.findUnique({ where: { id } })

  if (!neg) return err("Negotiation not found", 404)
  if (neg.buyerId !== user.id && neg.sellerId !== user.id) return err("Forbidden", 403)
  if (neg.status !== "ACTIVE") return err("Negotiation is no longer active")

  await prisma.negotiation.update({
    where: { id },
    data: {
      status: "DECLINED",
      messages: {
        create: { type: "DECLINE", senderId: user.id, senderName: user.name, text: "Offer declined" },
      },
    },
  })

  return json({ success: true })
}
