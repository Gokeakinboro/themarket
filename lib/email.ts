import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

async function renderTemplate(key: string, vars: Record<string, string>): Promise<{ subject: string; html: string } | null> {
  try {
    const { prisma } = await import("@/lib/prisma")
    const tpl = await prisma.emailTemplate.findUnique({ where: { key } })
    if (!tpl) return null
    let subject = tpl.subject
    let html = tpl.html
    for (const [k, v] of Object.entries(vars)) {
      subject = subject.replaceAll(`{{${k}}}`, v)
      html = html.replaceAll(`{{${k}}}`, v)
    }
    return { subject, html }
  } catch { return null }
}

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
  const rendered = await renderTemplate("order_seller", {
    sellerName: data.sellerName,
    productTitle: data.productTitle,
    amount: data.amount.toLocaleString(),
    buyerName: data.buyerName,
    buyerPhone: data.buyerPhone,
    buyerEmail: data.buyerEmail,
    buyerAddress: data.buyerAddress,
    orderId: data.orderId,
  })

  const subject = rendered?.subject ?? `New Order: ${data.productTitle}`
  const html = rendered?.html ?? `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e40af;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">biz9ja</h1>
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
    `

  await transporter.sendMail({
    from: '"biz9ja" <admin@biz9ja.com>',
    to,
    subject,
    html,
  })
}

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({ from: '"biz9ja" <admin@biz9ja.com>', to, subject, html })
}

export async function sendWelcomeEmail(to: string, name: string) {
  const rendered = await renderTemplate("welcome", { name })

  const subject = rendered?.subject ?? "Welcome to biz9ja!"
  const html = rendered?.html ?? `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e40af;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">biz9ja</h1>
        </div>
        <div style="padding:24px">
          <h2>Welcome, ${name}!</h2>
          <p>Your account on biz9ja has been created successfully. You can now start listing products and reaching thousands of buyers across Nigeria.</p>
          <p style="margin-top:16px"><a href="https://biz9ja.com/dashboard/seller" style="background:#1e40af;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Go to your Dashboard</a></p>
          <p style="margin-top:24px;font-size:12px;color:#6b7280">If you have questions, contact us at <a href="mailto:admin@biz9ja.com">admin@biz9ja.com</a></p>
        </div>
      </div>
    `

  await transporter.sendMail({
    from: '"biz9ja" <admin@biz9ja.com>',
    to,
    subject,
    html,
  })
}
