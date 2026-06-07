const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const templates = [
    {
      key: "welcome",
      name: "Welcome Email",
      subject: "Welcome to biz9ja!",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to biz9ja</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:#1e40af;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px">biz9ja</h1>
    </div>
    <div style="padding:32px 24px">
      <h2 style="color:#111827;margin-top:0">Welcome, {{name}}!</h2>
      <p style="color:#374151;line-height:1.6">Your seller account on biz9ja has been created successfully. You can now start listing products and reaching thousands of buyers across Nigeria.</p>
      <p style="color:#374151;line-height:1.6">Get started by visiting your dashboard and adding your first product.</p>
      <p style="margin-top:24px">
        <a href="https://biz9ja.com/dashboard/seller" style="background:#1e40af;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Go to your Dashboard</a>
      </p>
      <p style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
        If you have questions, contact us at <a href="mailto:admin@biz9ja.com" style="color:#1e40af">admin@biz9ja.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
    },
    {
      key: "order_seller",
      name: "Order Notification (Seller)",
      subject: "New Order: {{productTitle}}",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Order on biz9ja</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:#1e40af;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px">biz9ja</h1>
    </div>
    <div style="padding:32px 24px">
      <h2 style="color:#111827;margin-top:0">You have a new order!</h2>
      <p style="color:#374151;line-height:1.6">Hi {{sellerName}}, someone has paid for <strong>{{productTitle}}</strong>. Please fulfil this order promptly.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:40%">Product</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{productTitle}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Amount</td><td style="padding:10px 12px;border:1px solid #e5e7eb">&#8358;{{amount}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Order ID</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{orderId}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Buyer Name</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{buyerName}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Buyer Phone</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{buyerPhone}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Buyer Email</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{buyerEmail}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Delivery Address</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{buyerAddress}}</td></tr>
      </table>
      <p style="margin-top:20px;padding:14px 16px;background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b;color:#92400e;font-size:14px">
        <strong>Important:</strong> Payment is held in escrow for <strong>24 hours</strong>. Deliver the item to the buyer to trigger fund release.
      </p>
      <p style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
        Questions? Contact us at <a href="mailto:admin@biz9ja.com" style="color:#1e40af">admin@biz9ja.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
    },
    {
      key: "buyer_confirmation",
      name: "Order Confirmation (Buyer)",
      subject: "Order Confirmed — {{productTitle}}",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order Confirmed - biz9ja</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:#1e40af;padding:24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px">biz9ja</h1>
    </div>
    <div style="padding:32px 24px">
      <h2 style="color:#111827;margin-top:0">Order Confirmed!</h2>
      <p style="color:#374151;line-height:1.6">Hi {{buyerName}}, your order has been confirmed and payment received. The seller has been notified and will fulfil your order shortly.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;width:40%">Product</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{productTitle}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Amount Paid</td><td style="padding:10px 12px;border:1px solid #e5e7eb">&#8358;{{amount}}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600">Order ID</td><td style="padding:10px 12px;border:1px solid #e5e7eb">{{orderId}}</td></tr>
      </table>
      <p style="margin-top:20px;padding:14px 16px;background:#ecfdf5;border-radius:8px;border-left:4px solid #10b981;color:#065f46;font-size:14px">
        Your payment is protected in escrow. Funds are only released to the seller after you confirm delivery.
      </p>
      <p style="color:#374151;line-height:1.6;margin-top:20px">The seller will contact you directly to arrange delivery. If you have not heard from them within 24 hours, please contact us at <a href="mailto:admin@biz9ja.com" style="color:#1e40af">admin@biz9ja.com</a>.</p>
      <p style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">
        Questions? Contact us at <a href="mailto:admin@biz9ja.com" style="color:#1e40af">admin@biz9ja.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
    }
  ]

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { key: t.key },
      update: { name: t.name, subject: t.subject, html: t.html },
      create: t,
    })
    console.log("Seeded:", t.key)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
