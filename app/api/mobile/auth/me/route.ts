import { NextRequest } from "next/server"
import { requireMobileAuth, formatUser, json, err } from "@/lib/mobile-auth"

export async function GET(req: NextRequest) {
  const user = await requireMobileAuth(req)
  if (!user) return err("Unauthorized", 401)
  return json(formatUser(user))
}
