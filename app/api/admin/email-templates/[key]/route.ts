import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const t = await prisma.emailTemplate.findUnique({ where: { key: params.key } })
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(t)
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  const { subject, html, name } = await req.json()
  const t = await prisma.emailTemplate.update({
    where: { key: params.key },
    data: { subject, html, name },
  })
  return NextResponse.json(t)
}
