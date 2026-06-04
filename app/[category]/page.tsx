
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { CATEGORIES, NIGERIAN_STATES } from "@/lib/categories"
import Link from "next/link"

async function getProducts(category: string, state?: string) {
  try {
    const params = new URLSearchParams({ category, limit: "24" })
    if (state) params.set("state", state)
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?${params}`, { next: { revalidate: 30 } })
    return await res.json()
  } catch { return { products: [], total: 0, pages: 1 } }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { category } = await params
  const sp = await searchParams
  const catInfo = CATEGORIES.find(c => c.slug === category)
  const data = await getProducts(category, sp.state)
  const products = data.products || []

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-700">Home</Link> › <span className="text-gray-900">{catInfo?.name || category}</span>
        </nav>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-52 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Filter by State</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                <Link href={`/${category}`} className={`block text-sm py-1 px-2 rounded hover:text-blue-700 ${!sp.state ? "text-blue-700 font-medium" : "text-gray-600"}`}>All States</Link>
                {NIGERIAN_STATES.map(s => (
                  <Link key={s} href={`/${category}?state=${encodeURIComponent(s)}`} className={`block text-sm py-1 px-2 rounded hover:text-blue-700 ${sp.state === s ? "text-blue-700 font-medium" : "text-gray-600"}`}>{s}</Link>
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {catInfo?.icon} {catInfo?.name || category}
              <span className="text-sm font-normal text-gray-500 ml-2">({data.total || 0} listings)</span>
            </h1>
            {products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>No listings in this category yet.</p>
                <Link href="/register" className="text-blue-700 hover:underline text-sm mt-2 inline-block">Be the first to sell here →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
