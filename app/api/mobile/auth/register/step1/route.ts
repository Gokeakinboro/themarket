import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signRegToken, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json()

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !password)
    return err("All fields are required")
  if (password.length < 8) return err("Password must be at least 8 characters")
  if (!/\S+@\S+\.\S+/.test(email)) return err("Invalid email address")

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existing) return err("An account with this email already exists")

  const passwordHash = await bcrypt.hash(password, 10)

  const tempId = signRegToken({
    step: 1,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    passwordHash,
  })

  return json({ tempId })
}
