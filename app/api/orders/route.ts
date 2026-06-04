
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createTransaction } from "@/lib/paylode"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await req.json()
  const { productId, buyerName, buyerPhone, buyerEmail, buyerAddress } = body

  if (!productId || !buyerName || !buyerPhone || !buyerEmail || !buyerAddress) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true, isSold: false },
    include: { seller: true },
  })
  if (!product) return NextResponse.json({ error: "Product not available" }, { status: 404 })

  const order = await prisma.order.create({
    data: {
      productId,
      buyerName, buyerPhone, buyerEmail, buyerAddress,
      sellerId: product.sellerId,
      buyerId: (session?.user as any)?.id,
      amount: product.price,
      status: "PENDING_PAYMENT",
    },
  })

  // Create Paylode transaction
  const txn = await createTransaction({
    amount: product.price,
    email: buyerEmail,
    name: buyerName,
    phone: buyerPhone,
    description: `themarket: ${product.title}`,
    metadata: { orderId: order.id, productId, sellerId: product.sellerId },
  })

  if (txn.data?.reference) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paylodeRef: txn.data.reference },
    })
  }

  const checkoutUrl = `https://paylodeservices.com/checkout.html?ref=${txn.data?.reference}`
  return NextResponse.json({ orderId: order.id, checkoutUrl, ref: txn.data?.reference }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as any

  const where = user.role === "SELLER"
    ? { sellerId: user.id }
    : user.role === "AGENT"
    ? {}
    : { buyerId: user.id }

  const orders = await prisma.order.findMany({
    where,
    include: {
      product: { select: { title: true, images: { take: 1 } } },
      seller: { select: { name: true, businessName: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(orders)
}
