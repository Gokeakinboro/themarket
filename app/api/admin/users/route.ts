
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

function isAdmin(role: string) { return role === "ADMIN" || role === "SUPER_ADMIN" }

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !isAdmin((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role")
  const page = Number(searchParams.get("page") || 1)
  const limit = 50

  const where: any = {}
  if (role) where.role = role

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true,
        businessName: true, phone1: true, isActive: true,
        isSuspended: true, trustedBadge: true, salesCount: true,
        bvnStatus: true, ninStatus: true, createdAt: true,
        recruitedBy: { select: { name: true, email: true } },
        commissionRate: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { name, email, password, role } = body

  const hash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hash, role: role || "ADMIN" },
  })
  return NextResponse.json(user, { status: 201 })
}
