
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendOrderNotification(to: string, data: {
  sellerName: string
  productTitle: string
  amount: number
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  buyerAddress: string
  orderId: string
}) {
  await transporter.sendMail({
    from: `"themarket" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Order: ${data.productTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e40af;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">themarket</h1>
        </div>
        <div style="padding:24px">
          <h2>You have a new order!</h2>
          <p>Hi ${data.sellerName}, someone has paid for <strong>${data.productTitle}</strong>.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Amount</b></td><td style="padding:8px;border:1px solid #e5e7eb">&#8358;${data.amount.toLocaleString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Buyer</b></td><td style="padding:8px;border:1px solid #e5e7eb">${data.buyerName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Phone</b></td><td style="padding:8px;border:1px solid #e5e7eb">${data.buyerPhone}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Email</b></td><td style="padding:8px;border:1px solid #e5e7eb">${data.buyerEmail}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Delivery Address</b></td><td style="padding:8px;border:1px solid #e5e7eb">${data.buyerAddress}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><b>Order ID</b></td><td style="padding:8px;border:1px solid #e5e7eb">${data.orderId}</td></tr>
          </table>
          <p style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px">Payment is held in escrow for <strong>24 hours</strong>. Deliver the item to trigger fund release.</p>
        </div>
      </div>
    `,
  })
}

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({ from: `"themarket" <${process.env.SMTP_USER}>`, to, subject, html })
}
