import { NextRequest } from "next/server"
import { requireMobileAuth, json, err } from "@/lib/mobile-auth"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return err("No file provided")

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`
  const result = await uploadImage(base64, "themarket/products")

  return json({ url: result.url, publicId: result.publicId })
}
