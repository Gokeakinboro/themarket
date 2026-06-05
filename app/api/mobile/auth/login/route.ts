import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signToken, formatUser, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return err("Email and password are required")

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user || !user.password) return err("Invalid credentials", 401)
  if (user.isSuspended) return err("Account suspended. Contact support.", 403)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return err("Invalid credentials", 401)

  return json({ token: signToken(user.id), user: formatUser(user) })
}
