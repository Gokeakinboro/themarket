import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createTransaction } from "@/lib/paylode"

interface Props {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ buyerPhone?: string; buyerEmail?: string; buyerName?: string; buyerAddress?: string }>
}

export default async function MobileCheckoutPage({ params, searchParams }: Props) {
  const { orderId } = await params
  const sp = await searchParams

  // Handle negotiated checkout: orderId is a negotiation ID
  if (!orderId.startsWith("direct-")) {
    const neg = await prisma.negotiation.findUnique({
      where: { id: orderId },
      include: {
        product: { include: { seller: true } },
        buyer: true,
      },
    })

    if (!neg || neg.status !== "ACCEPTED" || !neg.agreedPrice) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 text-center">
          <div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Checkout unavailable</h1>
            <p className="text-gray-500">This negotiation is not in an accepted state.</p>
          </div>
        </div>
      )
    }

    // Create or find the pending order for this negotiation
    let order = await prisma.order.findFirst({ where: { negotiationId: neg.id } })

    if (!order) {
      const txn = await createTransaction({
        amount: neg.agreedPrice,
        email: neg.buyer.email,
        name: neg.buyer.name,
        phone: neg.buyer.phone1 ?? "",
        description: `Payment for ${neg.product.title} (negotiated price)`,
        metadata: {
          negotiationId: neg.id,
          productId: neg.productId,
          buyerId: neg.buyerId,
          sellerId: neg.sellerId,
        },
      })

      order = await prisma.order.create({
        data: {
          buyerName: neg.buyer.name,
          buyerEmail: neg.buyer.email,
          buyerPhone: neg.buyer.phone1 ?? "",
          buyerAddress: sp.buyerAddress ?? "To be confirmed",
          productId: neg.productId,
          buyerId: neg.buyerId,
          sellerId: neg.sellerId,
          amount: neg.agreedPrice,
          negotiatedPrice: neg.agreedPrice,
          negotiationId: neg.id,
          paylodeRef: txn?.data?.reference ?? null,
          status: "PENDING_PAYMENT",
        },
      })

      if (txn?.data?.payment_url) {
        redirect(txn.data.payment_url)
      }
    }

    return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center">
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">Processing checkout…</h1>
          <p className="text-gray-500">Please wait while we prepare your payment.</p>
        </div>
      </div>
    )
  }

  // Direct buy: orderId is "direct-{productId}"
  const productId = orderId.replace("direct-", "")
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true },
  })

  if (!product || !product.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center">
        <div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Product unavailable</h1>
          <p className="text-gray-500">This product is no longer available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Secure Checkout</h1>
      <p className="text-gray-500 text-sm mb-6">Powered by Paylode Escrow</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-gray-600 text-sm">Item</p>
        <p className="font-semibold text-gray-900">{product.title}</p>
        <p className="text-blue-700 font-bold text-xl mt-1">₦{product.price.toLocaleString("en-NG")}</p>
      </div>

      <form action="/api/mobile/checkout/initiate" method="POST">
        <input type="hidden" name="productId" value={productId} />
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="buyerName" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="buyerEmail" type="email" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="buyerPhone" type="tel" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <textarea name="buyerAddress" required rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold text-base">
          Pay ₦{product.price.toLocaleString("en-NG")} — Secured by Escrow
        </button>
      </form>

      <p className="text-gray-400 text-xs text-center mt-4">
        Your payment is held safely in escrow for 24 hours. Funds release to the seller only after you confirm receipt.
      </p>
    </div>
  )
}
