import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

const MAX_ROUNDS = 5
const EXPIRY_HOURS = 48

function formatNeg(n: any) {
  return {
    id: n.id,
    productId: n.productId,
    productTitle: n.product?.title ?? "",
    productPhoto: n.product?.images?.[0]?.url ?? "",
    listedPrice: n.product?.price ?? 0,
    agreedPrice: n.agreedPrice,
    status: n.status,
    buyerId: n.buyerId,
    sellerId: n.sellerId,
    roundsUsed: n.roundsUsed,
    expiresAt: n.expiresAt,
    messages: (n.messages ?? []).map((m: any) => ({
      id: m.id,
      type: m.type,
      amount: m.amount,
      text: m.text,
      senderId: m.senderId,
      senderName: m.senderName,
      createdAt: m.createdAt,
    })),
    createdAt: n.createdAt,
  }
}

const negInclude = {
  product: { include: { images: { take: 1, orderBy: { order: "asc" as const } } } },
  messages: { orderBy: { createdAt: "asc" as const } },
}

export async function GET(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const negotiations = await prisma.negotiation.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    include: negInclude,
    orderBy: { updatedAt: "desc" },
  })

  return json(negotiations.map(formatNeg))
}

export async function POST(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { productId, amount, message } = await req.json()
  if (!productId || !amount || amount <= 0) return err("Product and valid offer amount are required")

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: { select: { id: true, name: true } } },
  })
  if (!product || !product.isActive) return err("Product not found or unavailable", 404)
  if (product.sellerId === user.id) return err("You cannot negotiate on your own listing")

  const existing = await prisma.negotiation.findFirst({
    where: { productId, buyerId: user.id, status: "ACTIVE" },
  })
  if (existing) return err("You already have an active negotiation on this product")

  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000)

  const neg = await prisma.negotiation.create({
    data: {
      productId,
      buyerId: user.id,
      sellerId: product.sellerId,
      expiresAt,
      roundsUsed: 1,
      messages: {
        create: {
          type: "OFFER",
          amount,
          text: message || null,
          senderId: user.id,
          senderName: user.name,
        },
      },
    },
    include: negInclude,
  })

  return json(formatNeg(neg), 201)
}
