import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"
import { uploadImage } from "@/lib/cloudinary"
import { ProductCondition } from "@prisma/client"

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
    seller: p.seller ? {
      id: p.seller.id,
      name: p.seller.name,
      businessName: p.seller.businessName,
      averageRating: p.seller.averageRating ?? 0,
      totalRatings: p.seller.totalRatings ?? 0,
      trustedBadge: p.seller.trustedBadge ?? false,
      location: p.seller.state ? { state: p.seller.state, area: p.seller.city ?? "" } : null,
      acceptsInAppPayments: p.seller.acceptsInAppPayments ?? false,
    } : null,
    createdAt: p.createdAt,
  }
}

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get("page") || 1))
  const limit = Math.min(50, Number(searchParams.get("limit") || 20))
  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const condition = searchParams.get("condition") as ProductCondition | null
  const location = searchParams.get("location")

  const where: any = { isActive: true, isSold: false }
  if (search) where.title = { contains: search, mode: "insensitive" }
  if (category) where.category = { slug: category }
  if (condition && ["NEW", "USED", "REFURBISHED"].includes(condition)) where.condition = condition
  if (location) where.state = { contains: location, mode: "insensitive" }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return json({ products: products.map(formatProduct), total, page, limit })
}

export async function POST(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)
  if (user.role === "AGENT") return err("Agents cannot post products", 403)

  const count = await prisma.product.count({ where: { sellerId: user.id, isActive: true } })
  if (count >= 20) return err("Product limit reached (20 max)", 400)

  const { title, description, price, condition, category, photos, location } = await req.json()

  if (!title?.trim() || !description?.trim() || !price || !condition || !category)
    return err("Title, description, price, condition and category are required")
  if (!["NEW", "USED", "REFURBISHED"].includes(condition))
    return err("Condition must be NEW, USED or REFURBISHED")
  if (!photos?.length) return err("At least one photo is required")
  if (photos.length > 4) return err("Maximum 4 photos per product")

  const cat = await prisma.category.findFirst({
    where: { OR: [{ id: category }, { slug: category }] },
  })
  if (!cat) return err("Invalid category")

  // photos are already uploaded Cloudinary URLs from the mobile upload endpoint
  const product = await prisma.product.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      condition: condition as ProductCondition,
      sellerId: user.id,
      categoryId: cat.id,
      state: location?.state?.trim() || null,
      city: location?.area?.trim() || null,
      images: {
        create: photos.map((url: string, i: number) => ({
          url,
          publicId: url.split("/").pop()?.split(".")[0] ?? "",
          order: i,
        })),
      },
    },
    include: productInclude,
  })

  return json(formatProduct(product), 201)
}
