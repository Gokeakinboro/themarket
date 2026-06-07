
export async function sendOrderWhatsApp(phone: string, data: {
  productTitle: string
  amount: number
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  orderId: string
}) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return

  const msg = `*New Order on biz9ja!*\n\nProduct: ${data.productTitle}\nAmount: ₦${data.amount.toLocaleString()}\n\n*Buyer Details*\nName: ${data.buyerName}\nPhone: ${data.buyerPhone}\nDelivery: ${data.buyerAddress}\n\nOrder ID: ${data.orderId}\n\n_Payment held in escrow for 24hrs. Deliver to release funds._`

  const clean = phone.replace(/\D/g, "")
  const wa = clean.startsWith("0") ? "234" + clean.slice(1) : clean

  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: wa, type: "text", text: { body: msg } }),
  })
}
