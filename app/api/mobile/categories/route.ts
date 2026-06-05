import { prisma } from "@/lib/prisma"
import { json } from "@/lib/mobile-auth"

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, icon: true },
  })
  return json(categories)
}
