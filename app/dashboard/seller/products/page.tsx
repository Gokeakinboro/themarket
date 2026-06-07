"use client"
import { useEffect, useState, useRef } from "react"

const CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
]

export default function SellerProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: "", description: "", price: "", condition: "NEW",
    categoryId: "", state: "", city: "", deliveryInfo: "",
    discountPercent: "",
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/products?sellerId=me").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(p.products || []); setCategories(Array.isArray(c) ? c : [])
      setLoading(false)
    })
  }, [])

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 4)
    const readers = files.map(f => new Promise<string>(res => {
      const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f)
    }))
    Promise.all(readers).then(setImagePreviews)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError("")
    const res = await fetch("/api/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        discountPercent: form.discountPercent ? Number(form.discountPercent) : 0,
        images: imagePreviews,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error || "Failed to save"); return }
    setProducts(prev => [data, ...prev])
    setShowForm(false)
    setForm({ title: "", description: "", price: "", condition: "NEW", categoryId: "", state: "", city: "", deliveryInfo: "", discountPercent: "" })
    setImagePreviews([])
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const conditionLabel: Record<string, string> = { NEW: "New", USED: "Used", REFURBISHED: "Refurbished" }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length}/20 product slots used</p>
        </div>
        {products.length < 20 && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New Product</h2>
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                <input type="number" className="input" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min={0} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input h-24 resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                  <option value="">Select...</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                <select className="input" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input className="input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="e.g. Lagos" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Area</label>
                <input className="input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Ikeja" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Info</label>
                <input className="input" value={form.deliveryInfo} onChange={e => setForm(f => ({ ...f, deliveryInfo: e.target.value }))} placeholder="e.g. Lagos ₦2,000 | Nationwide ₦4,500" />
              </div>
            </div>

            {/* Discount */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-orange-800 mb-1">
                Special Discount % <span className="font-normal text-orange-600">(optional — leave blank for no discount)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="input w-32"
                  value={form.discountPercent}
                  onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                  placeholder="e.g. 20"
                  min={1} max={90}
                />
                <span className="text-orange-700 text-sm font-medium">% off</span>
                {form.discountPercent && Number(form.discountPercent) > 0 && form.price && (
                  <span className="text-sm text-gray-700">
                    Listed: <span className="line-through text-gray-400">₦{Number(form.price).toLocaleString()}</span>
                    {" → "}
                    <span className="text-green-700 font-bold">
                      ₦{Math.round(Number(form.price) * (1 - Number(form.discountPercent) / 100)).toLocaleString()}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-orange-600 mt-1">Discounted items are promoted in the Special Deals section on the homepage.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos (max 4)</label>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline text-sm">Choose Images</button>
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => setImagePreviews(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No products yet. Add your first product to start selling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p: any) => {
            const discount = p.discountPercent ?? 0
            const discountedPrice = discount > 0 ? Math.round(p.price * (1 - discount / 100)) : null
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}% OFF</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{p.title}</h3>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {discountedPrice ? (
                      <>
                        <span className="text-blue-700 font-bold">₦{discountedPrice.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs line-through">₦{p.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="text-blue-700 font-bold">₦{p.price.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.category?.name} · {conditionLabel[p.condition] ?? p.condition}</p>
                  <div className="flex gap-2 mt-3 items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isSold ? "bg-gray-100 text-gray-500" : p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {p.isSold ? "Sold" : p.isActive ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-600 hover:underline ml-auto">Remove</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
