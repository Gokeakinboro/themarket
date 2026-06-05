import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { json, err } from "@/lib/mobile-auth"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const seller = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, businessName: true, state: true, city: true,
      trustedBadge: true, averageRating: true, totalRatings: true,
      acceptsInAppPayments: true, salesCount: true, createdAt: true,
    },
  })
  if (!seller) return err("Seller not found", 404)

  return json({
    ...seller,
    location: seller.state ? { state: seller.state, area: seller.city ?? "" } : null,
  })
}
