
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true, name: true, email: true, role: true,
      businessName: true, registrationType: true, registrationNum: true,
      businessAddress: true, phone1: true, phone2: true,
      bankName: true, accountNumber: true, accountName: true,
      bvnStatus: true, ninStatus: true,
      trustedBadge: true, salesCount: true,
      isActive: true, isSuspended: true,
      commissionRate: true,
      createdAt: true,
      recruits: { select: { id: true, name: true, email: true, salesCount: true, createdAt: true } },
    },
  })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { currentPassword, newPassword, ...rest } = body

  const data: any = { ...rest }

  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } })
    if (!user?.password) return NextResponse.json({ error: "No password set" }, { status: 400 })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 })
    data.password = await bcrypt.hash(newPassword, 12)
  }

  const updated = await prisma.user.update({
    where: { id: (session.user as any).id },
    data,
    select: { id: true, name: true, email: true, businessName: true, phone1: true },
  })
  return NextResponse.json(updated)
}
