"use client"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/">
          <Image src="/biz9ja-logo.svg" alt="biz9ja" width={280} height={94} priority />
        </Link>

        {/* Search */}
        <form action="/search" className="hidden md:flex flex-1 mx-8">
          <input
            name="q"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
          />
          <button type="submit" className="bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded-r-lg font-medium transition-colors">
            Search
          </button>
        </form>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard/seller" className="hover:text-blue-200 text-sm font-medium">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm hover:text-blue-200">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-blue-200 font-medium">Sign in</Link>
              <Link href="/register" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 pb-4 space-y-2">
          <form action="/search" className="flex">
            <input name="q" placeholder="Search..." className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none" />
            <button type="submit" className="bg-blue-900 px-3 py-2 rounded-r-lg text-sm">Go</button>
          </form>
          {session ? (
            <>
              <Link href="/dashboard/seller" className="block py-2 text-sm hover:text-blue-200">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block py-2 text-sm hover:text-blue-200 w-full text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-sm hover:text-blue-200">Sign in</Link>
              <Link href="/register" className="block py-2 text-sm hover:text-blue-200">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
