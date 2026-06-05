import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, formatUser, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)
  if (user.acceptsInAppPayments) return err("Payments are already enabled")

  const { bvn, nin, bankAccountNumber, bankAccountName, bankCode, termsAccepted } = await req.json()

  if (!termsAccepted) return err("You must accept the Terms & Conditions")
  if (!bvn || bvn.length !== 11) return err("BVN must be 11 digits")
  if (!nin || nin.length !== 11) return err("NIN must be 11 digits")
  if (!bankAccountNumber || bankAccountNumber.length !== 10) return err("Account number must be 10 digits")
  if (!bankAccountName?.trim()) return err("Account name is required")
  if (!bankCode?.trim()) return err("Bank name is required")

  // TODO: Call YouVerify to validate BVN and NIN
  // const bvnResult = await verifyBvn(bvn)

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      acceptsInAppPayments: true,
      bvn,
      nin,
      bankName: bankCode.trim(),
      accountNumber: bankAccountNumber,
      accountName: bankAccountName.trim(),
      bvnStatus: "PENDING",
      ninStatus: "PENDING",
    },
  })

  return json({ success: true, user: formatUser(updated) })
}
