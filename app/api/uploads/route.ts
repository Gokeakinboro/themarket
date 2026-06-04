
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { image, folder } = await req.json()
  if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 })

  const result = await uploadImage(image, folder || "themarket/products")
  return NextResponse.json(result)
}
