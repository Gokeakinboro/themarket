import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, signRegToken, signToken, formatUser, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const { tempId, acceptsInAppPayments } = await req.json()

  const payload = verifyToken(tempId)
  if (!payload || payload.type !== "reg_temp" || payload.step !== 2)
    return err("Invalid or expired registration session. Please start over.", 400)

  if (acceptsInAppPayments) {
    // Needs KYC — return new tempId with payment flag
    const newTempId = signRegToken({ ...payload, step: 3, acceptsInAppPayments: true })
    return json({ tempId: newTempId, requiresKyc: true })
  }

  // No payments — create user immediately
  const user = await prisma.user.create({
    data: {
      name: payload.name as string,
      email: payload.email as string,
      phone1: payload.phone as string,
      phone2: payload.phone2 as string | null,
      password: payload.passwordHash as string,
      businessName: payload.businessName as string,
      businessAddress: payload.businessAddress as string,
      registrationType: payload.registrationType as any,
      registrationNum: payload.registrationNumber as string | null,
      acceptsInAppPayments: false,
      role: "SELLER",
    },
  })

  return json({ user: formatUser(user), token: signToken(user.id) })
}
