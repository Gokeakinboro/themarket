
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

function isAdmin(role: string) { return role === "ADMIN" || role === "SUPER_ADMIN" }

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user || !isAdmin((session.user as any).role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { action, commissionRate, password, ...rest } = body

  const data: any = { ...rest }
  if (action === "suspend") data.isSuspended = true
  if (action === "unsuspend") data.isSuspended = false
  if (action === "deactivate") data.isActive = false
  if (action === "activate") data.isActive = true
  if (commissionRate !== undefined) data.commissionRate = Number(commissionRate)
  if (password) data.password = await bcrypt.hash(password, 12)

  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json(user)
}
