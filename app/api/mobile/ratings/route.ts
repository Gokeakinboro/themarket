import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"

export async function POST(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const { transactionId, sellerId, stars, comment } = await req.json()

  if (!transactionId || !sellerId) return err("Transaction and seller ID are required")
  if (!stars || stars < 1 || stars > 5) return err("Stars must be between 1 and 5")
  if (comment && comment.length > 160) return err("Comment must be 160 characters or fewer")

  const order = await prisma.order.findUnique({
    where: { id: transactionId },
    include: { review: true },
  })
  if (!order) return err("Transaction not found", 404)
  if (order.buyerId !== user.id) return err("You can only rate transactions you made as a buyer", 403)
  if (order.sellerId !== sellerId) return err("Seller ID does not match this transaction")
  if (order.status !== "RELEASED" && order.status !== "DELIVERED")
    return err("You can only rate completed transactions")

  // Check 7-day window
  const releaseDate = order.releasedAt ?? order.deliveredAt
  if (releaseDate) {
    const daysSince = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 7) return err("Rating window has closed (7 days after delivery)")
  }

  if (order.review) return err("You have already rated this transaction")

  const [review] = await prisma.$transaction([
    prisma.review.create({
      data: {
        orderId: transactionId,
        reviewerId: user.id,
        sellerId,
        rating: stars,
        comment: comment?.trim() || null,
      },
    }),
    // Recalculate seller average rating
    prisma.$executeRaw`
      UPDATE "User"
      SET "totalRatings" = (SELECT COUNT(*) FROM "Review" WHERE "sellerId" = ${sellerId}),
          "averageRating" = (SELECT AVG("rating") FROM "Review" WHERE "sellerId" = ${sellerId})
      WHERE "id" = ${sellerId}
    `,
    // Award Trusted badge at 100 sales
    prisma.$executeRaw`
      UPDATE "User" SET "trustedBadge" = true WHERE "id" = ${sellerId} AND "salesCount" >= 100
    `,
  ])

  return json({ success: true })
}
