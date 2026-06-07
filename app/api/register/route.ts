import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    name, email, password, role,
    businessName, registrationType, registrationNum,
    businessAddress, phone1, phone2,
    bankName, accountNumber, accountName,
    bvn, nin,
    agentCode,
  } = body

  if (!name || !email || !password) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

  const hash = await bcrypt.hash(password, 12)

  let recruitedById: string | undefined
  if (agentCode) {
    const agent = await prisma.user.findUnique({ where: { id: agentCode, role: "AGENT" } })
    if (agent) recruitedById = agent.id
  }

  const user = await prisma.user.create({
    data: {
      name, email, password: hash,
      role: role === "AGENT" ? "AGENT" : "SELLER",
      businessName, registrationType, registrationNum,
      businessAddress, phone1, phone2,
      bankName, accountNumber, accountName,
      bvn, nin,
      recruitedById,
    },
  })

  // Send welcome email — fire-and-forget, don't block registration if SMTP isn't configured yet
  setImmediate(async () => {
    try {
      const { sendWelcomeEmail } = await import("@/lib/email")
      await sendWelcomeEmail(email, name)
    } catch (err) {
      console.error("Welcome email failed:", err)
    }
  })

  // Kick off KYC async
  if (bvn || nin) {
    setImmediate(async () => {
      try {
        const { verifyBvn, verifyNin } = await import("@/lib/youverify")
        const [first, ...rest] = name.split(" ")
        const last = rest.join(" ") || first
        if (bvn) {
          const r = await verifyBvn(bvn, first, last)
          await prisma.user.update({
            where: { id: user.id },
            data: { bvnStatus: r.data?.verified ? "VERIFIED" : "FAILED" },
          })
        }
        if (nin) {
          const r = await verifyNin(nin)
          await prisma.user.update({
            where: { id: user.id },
            data: { ninStatus: r.data?.verified ? "VERIFIED" : "FAILED" },
          })
        }
      } catch (err) {
        console.error("KYC verification failed:", err)
      }
    })
  }

  return NextResponse.json({ success: true, id: user.id }, { status: 201 })
}
