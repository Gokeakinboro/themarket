
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  title: string
  price: number
  condition: string
  state?: string
  city?: string
  images: { url: string }[]
  seller: { name: string; trustedBadge: boolean }
  category: { name: string }
  createdAt: string
}

export function ProductCard({ product }: { product: Product }) {
  const img = product.images[0]?.url || "/placeholder.png"
  const location = [product.city, product.state].filter(Boolean).join(", ")
  const conditionLabel: Record<string, string> = {
    BRAND_NEW: "New", USED: "Used", FOREIGN_USED: "Foreign Used", LOCAL_USED: "Local Used"
  }

  return (
    <Link href={`/product/${product.id}`} className="card block group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-white text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
          {conditionLabel[product.condition] || product.condition}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">{product.title}</h3>
        <p className="text-blue-700 font-bold text-lg mt-1">₦{product.price.toLocaleString()}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{location || "Nigeria"}</span>
          {product.seller.trustedBadge && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">✓ Trusted</span>
          )}
        </div>
      </div>
    </Link>
  )
}
