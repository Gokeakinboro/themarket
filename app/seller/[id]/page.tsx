
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"

async function getSeller(id: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?sellerId=${id}`, { next: { revalidate: 30 } })
    return await res.json()
  } catch { return { products: [] } }
}

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getSeller(id)
  const products = data.products || []
  const seller = products[0]?.seller

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {seller && (
          <div className="bg-blue-700 text-white rounded-2xl p-6 mb-8">
            <h1 className="text-2xl font-bold">{seller.businessName || seller.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-blue-200 text-sm">
              <span>{seller.salesCount} sales</span>
              <span>·</span>
              <span>Member since {new Date(seller.createdAt).getFullYear()}</span>
              {seller.trustedBadge && <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium">✓ Trusted</span>}
            </div>
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Products ({products.length})</h2>
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No active products.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
