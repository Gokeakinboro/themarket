import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { json, err } from "@/lib/mobile-auth"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const reviews = await prisma.review.findMany({
    where: { sellerId: id },
    include: {
      reviewer: { select: { name: true } },
      order: { include: { product: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return json(
    reviews.map((r) => ({
      id: r.id,
      stars: r.rating,
      comment: r.comment,
      buyerName: r.reviewer.name,
      productTitle: r.order.product.title,
      createdAt: r.createdAt,
    }))
  )
}
