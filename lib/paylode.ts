
import crypto from "crypto"

const BASE = process.env.PAYLODE_API_URL || "https://paylodeservices.com/api/v1"
const KEY  = process.env.PAYLODE_API_KEY  || ""

export async function createTransaction(data: {
  amount: number
  email: string
  name: string
  phone: string
  description: string
  metadata?: Record<string, string>
}) {
  const res = await fetch(`${BASE}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      amount: data.amount,
      currency: "NGN",
      email: data.email,
      customer_name: data.name,
      phone: data.phone,
      description: data.description,
      metadata: data.metadata,
    }),
  })
  return res.json()
}

export function verifyWebhookSignature(payload: string, signature: string) {
  const secret = process.env.PAYLODE_WEBHOOK_SECRET || ""
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return expected === signature
}
