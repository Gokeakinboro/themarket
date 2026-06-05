import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const products = await prisma.product.findMany({
    where: { sellerId: user.id },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return json(
    products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      condition: p.condition,
      status: p.isSold ? "SOLD_OUT" : p.isActive ? "AVAILABLE" : "SOLD_OUT",
      category: p.category.name,
      photos: p.images.map((i) => i.url),
      location: { state: p.state ?? "", area: p.city ?? "" },
      createdAt: p.createdAt,
    }))
  )
}
