import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const productInclude = {
  images: { orderBy: { order: "asc" as const }, take: 1 },
  category: { select: { name: true, slug: true } },
  seller: { select: { id: true, name: true, businessName: true, trustedBadge: true, salesCount: true, createdAt: true } },
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 20)
  const category = searchParams.get("category")
  const state = searchParams.get("state")
  const q = searchParams.get("q")
  const sellerId = searchParams.get("sellerId")
  const discounted = searchParams.get("discounted") === "1"

  const where: any = { isActive: true, isSold: false }
  if (category) where.category = { slug: category }
  if (state) where.state = state
  if (q) where.title = { contains: q, mode: "insensitive" }
  if (discounted) where.discountPercent = { gt: 0 }

  if (sellerId) {
    if (sellerId === "me") {
      const session = await getServerSession(authOptions)
      if (!session?.user) return NextResponse.json({ products: [], total: 0 })
      where.sellerId = (session.user as any).id
      delete where.isActive
      delete where.isSold
    } else {
      where.sellerId = sellerId
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ discountPercent: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as any

  const seller = await prisma.user.findUnique({ where: { id: user.id } })
  if (!seller || seller.role === "AGENT") return NextResponse.json({ error: "Only sellers can post products" }, { status: 403 })

  const count = await prisma.product.count({ where: { sellerId: user.id, isActive: true } })
  if (count >= 20) return NextResponse.json({ error: "Product limit reached (20 max)" }, { status: 400 })

  const body = await req.json()
  const { title, description, price, condition, categoryId, state, city, deliveryInfo, images, discountPercent } = body

  if (!title || !description || !price || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!["NEW", "USED", "REFURBISHED"].includes(condition)) {
    return NextResponse.json({ error: "Condition must be NEW, USED or REFURBISHED" }, { status: 400 })
  }
  if (images?.length > 4) return NextResponse.json({ error: "Max 4 images per product" }, { status: 400 })

  const discount = Math.min(90, Math.max(0, Number(discountPercent) || 0))

  const { uploadImage } = await import("@/lib/cloudinary")
  const uploadedImages = []
  for (let i = 0; i < (images || []).length; i++) {
    const img = await uploadImage(images[i], "themarket/products")
    uploadedImages.push({ ...img, order: i })
  }

  const product = await prisma.product.create({
    data: {
      title, description,
      price: Number(price),
      condition,
      sellerId: user.id,
      categoryId,
      state, city, deliveryInfo,
      discountPercent: discount,
      images: { create: uploadedImages },
    },
    include: { images: true, category: true },
  })

  return NextResponse.json(product, { status: 201 })
}
