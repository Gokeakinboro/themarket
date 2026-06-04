
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CATEGORIES } from "@/lib/categories"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-seed-secret")
  if (secret !== process.env.SEED_SECRET) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  return NextResponse.json({ seeded: CATEGORIES.length })
}
