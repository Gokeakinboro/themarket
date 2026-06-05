import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

const productInclude = {
  images: { orderBy: { order: "asc" as const } },
  category: { select: { name: true, slug: true } },
  seller: {
    select: {
      id: true, name: true, businessName: true, trustedBadge: true,
      averageRating: true, totalRatings: true, state: true, city: true,
      acceptsInAppPayments: true,
    },
  },
}

function formatProduct(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    condition: p.condition,
    status: p.isSold ? "SOLD_OUT" : p.isActive ? "AVAILABLE" : "SOLD_OUT",
    category: p.category?.name ?? "",
    photos: (p.images ?? []).map((i: any) => i.url),
    location: { state: p.state ?? "", area: p.city ?? "" },
    seller: {
      id: p.seller.id,
      name: p.seller.name,
      businessName: p.seller.businessName,
      averageRating: p.seller.averageRating ?? 0,
      totalRatings: p.seller.totalRatings ?? 0,
      trustedBadge: p.seller.trustedBadge ?? false,
      location: p.seller.state ? { state: p.seller.state, area: p.seller.city ?? "" } : null,
      acceptsInAppPayments: p.seller.acceptsInAppPayments ?? false,
    },
    createdAt: p.createdAt,
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: productInclude })
  if (!product) return err("Product not found", 404)

  // Increment views
  await prisma.product.update({ where: { id }, data: { views: { increment: 1 } } })

  return json(formatProduct(product))
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return err("Product not found", 404)
  if (product.sellerId !== user.id) return err("Forbidden", 403)

  await prisma.product.delete({ where: { id } })
  return json({ success: true })
}
