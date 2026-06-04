
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyWebhookSignature } from "@/lib/paylode"
import { sendOrderNotification } from "@/lib/email"
import { sendOrderWhatsApp } from "@/lib/whatsapp"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("x-paylode-signature") || ""

  if (!verifyWebhookSignature(body, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === "transaction.successful") {
    const { reference, metadata } = event.data || {}
    const orderId = metadata?.orderId

    if (!orderId) return NextResponse.json({ received: true })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true, seller: true },
    })
    if (!order) return NextResponse.json({ received: true })

    const escrowExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "IN_ESCROW",
        paidAt: new Date(),
        paylodeRef: reference,
        escrowExpiresAt,
      },
    })

    // Notify seller via email + WhatsApp
    const notifData = {
      sellerName: order.seller.name,
      productTitle: order.product.title,
      amount: order.amount,
      buyerName: order.buyerName,
      buyerPhone: order.buyerPhone,
      buyerEmail: order.buyerEmail,
      buyerAddress: order.buyerAddress,
      orderId: order.id,
    }

    if (order.seller.email) {
      sendOrderNotification(order.seller.email, notifData).catch(console.error)
    }
    if (order.seller.phone1) {
      sendOrderWhatsApp(order.seller.phone1, {
        productTitle: order.product.title,
        amount: order.amount,
        buyerName: order.buyerName,
        buyerPhone: order.buyerPhone,
        buyerAddress: order.buyerAddress,
        orderId: order.id,
      }).catch(console.error)
    }

    // Auto-release after 24hrs if no dispute — handled by a cron or scheduled check
  }

  return NextResponse.json({ received: true })
}
