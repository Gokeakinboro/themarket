
"use client"
import { useEffect, useState, useRef } from "react"

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
    title:"", description:"", price:"", condition:"BRAND_NEW",
    categoryId:"", state:"", city:"", deliveryInfo:"",
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/products?sellerId=me").then(r=>r.json()),
      fetch("/api/categories").then(r=>r.json()),
    ]).then(([p,c]) => {
      setProducts(p.products||[]); setCategories(Array.isArray(c)?c:[])
      setLoading(false)
    })
  }, [])

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0,4)
    const readers = files.map(f => new Promise<string>(res => {
      const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f)
    }))
    Promise.all(readers).then(setImagePreviews)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError("")
    const res = await fetch("/api/products", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ...form, price: Number(form.price), images: imagePreviews }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error||"Failed to save"); return }
    setProducts(prev => [data, ...prev])
    setShowForm(false)
    setForm({ title:"",description:"",price:"",condition:"BRAND_NEW",categoryId:"",state:"",city:"",deliveryInfo:"" })
    setImagePreviews([])
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product?")) return
    await fetch(`/api/products/${id}`, { method:"DELETE" })
    setProducts(prev => prev.filter(p=>p.id!==id))
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length}/20 product slots used</p>
        </div>
        {products.length < 20 && (
          <button onClick={()=>setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        )}
      </div>

      {/* Add product form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New Product</h2>
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input className="input" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
                <input type="number" className="input" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required min={0}/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input h-24 resize-none" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="input" value={form.categoryId} onChange={e=>setForm(f=>({...f,categoryId:e.target.value}))} required>
                  <option value="">Select...</option>
                  {categories.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select className="input" value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))}>
                  <option value="BRAND_NEW">Brand New</option>
                  <option value="USED">Used</option>
                  <option value="FOREIGN_USED">Foreign Used</option>
                  <option value="LOCAL_USED">Local Used</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input className="input" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} placeholder="e.g. Lagos"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Info</label>
              <input className="input" value={form.deliveryInfo} onChange={e=>setForm(f=>({...f,deliveryInfo:e.target.value}))} placeholder="e.g. Lagos delivery ₦2,000 | Nationwide ₦4,500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos (max 4)</label>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages}/>
              <button type="button" onClick={()=>fileRef.current?.click()} className="btn-outline text-sm">Choose Images</button>
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {imagePreviews.map((src,i)=>(
                    <div key={i} className="relative">
                      <img src={src} className="w-16 h-16 object-cover rounded-lg border border-gray-200"/>
                      <button type="button" onClick={()=>setImagePreviews(prev=>prev.filter((_,j)=>j!==i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
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

      {/* Products list */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>No products yet. Add your first product to start selling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p:any)=>(
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {p.images?.[0] ? (
                  <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{p.title}</h3>
                <p className="text-blue-700 font-bold mt-1">₦{p.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.category?.name} · {p.condition.replace("_"," ")}</p>
                <div className="flex gap-2 mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isSold?"bg-gray-100 text-gray-500":p.isActive?"bg-green-100 text-green-700":"bg-red-100 text-red-600"}`}>
                    {p.isSold?"Sold":p.isActive?"Active":"Inactive"}
                  </span>
                  <button onClick={()=>deleteProduct(p.id)} className="text-xs text-red-600 hover:underline ml-auto">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
