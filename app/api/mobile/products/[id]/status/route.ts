import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const { status } = await req.json()

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return err("Product not found", 404)
  if (product.sellerId !== user.id) return err("Forbidden", 403)

  if (status === "AVAILABLE") {
    await prisma.product.update({ where: { id }, data: { isActive: true, isSold: false } })
  } else if (status === "SOLD_OUT") {
    await prisma.product.update({ where: { id }, data: { isActive: false } })
  } else {
    return err("Status must be AVAILABLE or SOLD_OUT")
  }

  return json({ success: true })
}
