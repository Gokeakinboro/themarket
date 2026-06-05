import { NextRequest } from "next/server"
import { verifyToken, signRegToken, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const { tempId, businessName, businessAddress, registrationType, registrationNumber, phone2 } = await req.json()

  const payload = verifyToken(tempId)
  if (!payload || payload.type !== "reg_temp" || payload.step !== 1)
    return err("Invalid or expired registration session. Please start over.", 400)

  if (!businessName?.trim() || !businessAddress?.trim() || !registrationType)
    return err("Business name, address and registration type are required")

  const newTempId = signRegToken({
    step: 2,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    passwordHash: payload.passwordHash,
    businessName: businessName.trim(),
    businessAddress: businessAddress.trim(),
    registrationType,
    registrationNumber: registrationNumber?.trim() || null,
    phone2: phone2?.trim() || null,
  })

  return json({ tempId: newTempId })
}
