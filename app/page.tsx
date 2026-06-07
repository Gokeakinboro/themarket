import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { CATEGORIES } from "@/lib/categories"

async function getProducts(params: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?${params}`, { next: { revalidate: 60 } })
    return (await res.json()).products || []
  } catch { return [] }
}

export default async function HomePage() {
  const [latest, deals] = await Promise.all([
    getProducts("limit=12"),
    getProducts("discounted=1&limit=8"),
  ])

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy & Sell Anything in Nigeria</h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Secure escrow payments. Verified sellers. Thousands of listings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-lg">
              Start Selling
            </Link>
            <Link href="#categories" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-lg">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How biz9ja works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Seller lists product", desc: "Post up to 20 products with photos, price, and delivery info." },
              { step: "2", title: "Buyer pays securely", desc: "Payment is held in escrow by Paylode for 24 hours." },
              { step: "3", title: "Confirm & release", desc: "Confirm delivery and funds are released to the seller instantly." },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-700 hover:bg-blue-50 transition-colors text-center group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Deals — only shown when deals exist */}
      {deals.length > 0 && (
        <section className="py-10 px-4 bg-red-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Special Deals</h2>
                  <p className="text-sm text-red-600 font-medium">Limited-time discounts from verified sellers</p>
                </div>
              </div>
              <Link href="/deals" className="text-red-600 font-medium hover:underline text-sm">View all deals →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {deals.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Latest listings */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
            <Link href="/all" className="text-blue-700 font-medium hover:underline text-sm">View all →</Link>
          </div>
          {latest.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {latest.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No listings yet. Be the first to sell!</p>
              <Link href="/register" className="btn-primary inline-block mt-4">Start Selling</Link>
            </div>
          )}
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="bg-blue-700 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to start selling?</h2>
          <p className="text-blue-200 mb-6">Join thousands of sellers on biz9ja. Sign up today and list your first product for free.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Sign up as Seller
            </Link>
            <Link href="/register/agent" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Become an Agent
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
