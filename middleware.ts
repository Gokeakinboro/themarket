import { NextRequest, NextResponse } from "next/server"

const ADMIN_HOST = process.env.ADMIN_HOST ?? "admin.themarket.paylodeservices.com"

// Paths always allowed regardless of subdomain
const ALWAYS_ALLOW = ["/_next", "/api/auth", "/favicon.ico"]

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const { pathname } = req.nextUrl

  const isAdminSubdomain = host === ADMIN_HOST || host.startsWith("admin.")

  if (!isAdminSubdomain) return NextResponse.next()

  // Always allow Next.js internals, auth API, and login page
  if (
    ALWAYS_ALLOW.some(p => pathname.startsWith(p)) ||
    pathname === "/login" ||
    pathname === "/dashboard"
  ) {
    return NextResponse.next()
  }

  // On admin subdomain: root → /admin, non-admin paths → /admin
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
