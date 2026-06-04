
"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as any

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [buying, setBuying] = useState(false)
  const [buyForm, setBuyForm] = useState({ buyerName:"", buyerPhone:"", buyerEmail:"", buyerAddress:"" })

  useEffect(()=>{
    if (user) setBuyForm(f=>({...f, buyerName:user.name||"", buyerEmail:user.email||""}))
  },[user])

  useEffect(()=>{
    fetch(`/api/products/${id}`).then(r=>r.json()).then(p=>{ setProduct(p); setLoading(false) })
  },[id])

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault()
    if (!session) { router.push("/login"); return }
    setBuying(true)
    const res = await fetch("/api/orders",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ productId:id, ...buyForm }),
    })
    const data = await res.json()
    setBuying(false)
    if (res.ok && data.checkoutUrl) {
      window.location.href = data.checkoutUrl
    }
  }

  if (loading) return <><Navbar/><div className="p-12 text-center text-gray-500">Loading...</div><Footer/></>
  if (!product || !product.id) return <><Navbar/><div className="p-12 text-center text-gray-500">Product not found.</div><Footer/></>

  const conditionLabel: Record<string,string> = { BRAND_NEW:"Brand New", USED:"Used", FOREIGN_USED:"Foreign Used", LOCAL_USED:"Local Used" }
  const isLoggedIn = !!session

  return (
    <>
      <Navbar/>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          {" › "}
          <Link href={`/${product.category?.slug}`} className="hover:text-blue-700">{product.category?.name}</Link>
          {" › "}
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3">
              {product.images?.length > 0 ? (
                <img src={product.images[activeImg]?.url} alt={product.title} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img:any,i:number)=>(
                  <button key={i} onClick={()=>setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i===activeImg?"border-blue-700":"border-gray-200"}`}>
                    <img src={img.url} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-sm text-gray-500">{product.category?.name}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-blue-700">₦{product.price?.toLocaleString()}</span>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{conditionLabel[product.condition] || product.condition}</span>
            </div>

            {/* Seller */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{product.seller?.businessName || product.seller?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.seller?.salesCount} sales · Member since {new Date(product.seller?.createdAt).getFullYear()}
                  </p>
                </div>
                {product.seller?.trustedBadge && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">✓ Trusted</span>
                )}
              </div>
              {/* Contact — only visible to logged-in users */}
              {isLoggedIn ? (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                  {product.seller?.phone1 && <p className="text-sm text-gray-700">📞 {product.seller.phone1}</p>}
                  {product.seller?.phone2 && <p className="text-sm text-gray-700">📞 {product.seller.phone2}</p>}
                </div>
              ) : (
                <p className="mt-3 text-xs text-blue-700">
                  <Link href="/login" className="hover:underline">Sign in</Link> to see seller contact details
                </p>
              )}
            </div>

            {/* Location + delivery */}
            {(product.state || product.city) && (
              <p className="mt-3 text-sm text-gray-600">📍 {[product.city, product.state].filter(Boolean).join(", ")}</p>
            )}
            {product.deliveryInfo && (
              <p className="mt-1 text-sm text-gray-600">🚚 {product.deliveryInfo}</p>
            )}

            {/* Escrow note */}
            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-800">
              🔒 Payment held in escrow for 24 hours. Dispute window available after purchase.
            </div>

            {/* Buy button */}
            {!product.isSold ? (
              <button onClick={()=>setShowBuyForm(true)} className="btn-primary w-full mt-4 text-base py-3">
                Buy Now — ₦{product.price?.toLocaleString()}
              </button>
            ) : (
              <div className="mt-4 py-3 text-center bg-gray-100 rounded-xl text-gray-500 font-medium">Sold</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Buy form modal */}
      {showBuyForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Complete Purchase</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your delivery details. You'll be redirected to pay securely.</p>
            {!session && (
              <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg mb-4">
                <Link href="/login" className="font-medium hover:underline">Sign in</Link> for a faster checkout and order tracking.
              </div>
            )}
            <form onSubmit={handleBuy} className="space-y-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label><input className="input" value={buyForm.buyerName} onChange={e=>setBuyForm(f=>({...f,buyerName:e.target.value}))} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" className="input" value={buyForm.buyerPhone} onChange={e=>setBuyForm(f=>({...f,buyerPhone:e.target.value}))} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" className="input" value={buyForm.buyerEmail} onChange={e=>setBuyForm(f=>({...f,buyerEmail:e.target.value}))} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label><textarea className="input h-20 resize-none" value={buyForm.buyerAddress} onChange={e=>setBuyForm(f=>({...f,buyerAddress:e.target.value}))} required/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowBuyForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={buying} className="btn-primary flex-1 disabled:opacity-60">{buying?"Processing...":"Pay ₦"+product.price?.toLocaleString()}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer/>
    </>
  )
}
