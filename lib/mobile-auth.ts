import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { User } from "@prisma/client"

const SECRET = process.env.NEXTAUTH_SECRET!

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "access" }, SECRET, { expiresIn: "30d" })
}

export function signRegToken(data: Record<string, unknown>): string {
  return jwt.sign({ ...data, type: "reg_temp" }, SECRET, { expiresIn: "1h" })
}

export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as jwt.JwtPayload
  } catch {
    return null
  }
}

export async function requireMobileAuth(req: NextRequest): Promise<User | null> {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null
  const payload = verifyToken(auth.slice(7))
  if (!payload?.sub || payload.type !== "access") return null
  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || user.isSuspended) return null
  return user
}

export function formatUser(user: User) {
  const kycVerified = user.bvnStatus === "VERIFIED" && user.ninStatus === "VERIFIED"
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone1,
    businessName: user.businessName,
    businessAddress: user.businessAddress,
    registrationType: user.registrationType,
    registrationNumber: user.registrationNum,
    location: user.state ? { state: user.state, area: user.city ?? "" } : null,
    acceptsInAppPayments: user.acceptsInAppPayments,
    kycVerified,
    averageRating: user.averageRating,
    totalRatings: user.totalRatings,
    trustedBadge: user.trustedBadge,
    createdAt: user.createdAt,
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}

export function err(message: string, status = 400) {
  return Response.json({ message }, { status })
}
