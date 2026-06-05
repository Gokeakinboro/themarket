import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, signToken, formatUser, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const { tempId, bvn, nin, bankAccountNumber, bankAccountName, bankCode, termsAccepted } = await req.json()

  if (!termsAccepted) return err("You must accept the Terms & Conditions")
  if (!bvn || bvn.length !== 11) return err("BVN must be 11 digits")
  if (!nin || nin.length !== 11) return err("NIN must be 11 digits")
  if (!bankAccountNumber || bankAccountNumber.length !== 10) return err("Account number must be 10 digits")
  if (!bankAccountName?.trim()) return err("Account name is required")
  if (!bankCode?.trim()) return err("Bank name is required")

  const payload = verifyToken(tempId)
  if (!payload || payload.type !== "reg_temp" || payload.step !== 3)
    return err("Invalid or expired registration session. Please start over.", 400)

  // TODO: Call YouVerify to validate BVN and NIN before creating user
  // const bvnResult = await verifyBvn(bvn)
  // const ninResult = await verifyNin(nin)

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
      acceptsInAppPayments: true,
      bvn,
      nin,
      bankName: bankCode.trim(),
      accountNumber: bankAccountNumber,
      accountName: bankAccountName.trim(),
      bvnStatus: "PENDING",
      ninStatus: "PENDING",
      role: "SELLER",
    },
  })

  return json({ user: formatUser(user), token: signToken(user.id) })
}
