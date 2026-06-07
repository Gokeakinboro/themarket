"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

const REG_TYPES = ["LLC","ENTERPRISE","UNREGISTERED","SOLE_PROPRIETORSHIP"]
const REG_LABELS: Record<string,string> = {
  LLC:"Limited Liability Company", ENTERPRISE:"Enterprise",
  UNREGISTERED:"Unregistered Business", SOLE_PROPRIETORSHIP:"Sole Proprietorship"
}

export default function AgentRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tcAccepted, setTcAccepted] = useState(false)
  const [form, setForm] = useState({
    name:"", email:"", password:"", confirm:"",
    businessName:"", registrationType:"UNREGISTERED", registrationNum:"",
    businessAddress:"", phone1:"", phone2:"",
    bankName:"", accountNumber:"", accountName:"",
    bvn:"", nin:"",
  })
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}))

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError("Passwords do not match"); return }
    setLoading(true); setError("")
    const res = await fetch("/api/register",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({...form, role:"AGENT"}),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || "Registration failed"); return }
    await signIn("credentials",{email:form.email,password:form.password,redirect:false})
    router.push("/dashboard/agent")
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Become an Agent</h1>
            <p className="text-sm text-gray-500 mt-1">Recruit sellers and earn commission on their activity</p>
          </div>
          <span className="text-sm text-gray-400">Step {step} of 3</span>
        </div>
        <div className="flex gap-1 mb-6">
          {[1,2,3].map(n=><div key={n} className={`flex-1 h-1.5 rounded-full ${n<=step?"bg-blue-700":"bg-gray-200"}`}/>)}
        </div>
        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {step===1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input className="input" value={form.name} onChange={e=>set("name",e.target.value)} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" className="input" value={form.email} onChange={e=>set("email",e.target.value)} required/></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label><input className="input" value={form.businessName} onChange={e=>set("businessName",e.target.value)}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                <select className="input" value={form.registrationType} onChange={e=>set("registrationType",e.target.value)}>
                  {REG_TYPES.map(t=><option key={t} value={t}>{REG_LABELS[t]}</option>)}
                </select>
              </div>
              {form.registrationType !== "UNREGISTERED" && <div><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label><input className="input" value={form.registrationNum} onChange={e=>set("registrationNum",e.target.value)}/></div>}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label><input className="input" value={form.businessAddress} onChange={e=>set("businessAddress",e.target.value)}/></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone 1 *</label><input type="tel" className="input" value={form.phone1} onChange={e=>set("phone1",e.target.value)} required/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label><input type="tel" className="input" value={form.phone2} onChange={e=>set("phone2",e.target.value)}/></div>
              </div>
              <button type="button" onClick={()=>setStep(2)} className="btn-primary w-full">Next →</button>
            </div>
          )}
          {step===2 && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label><input className="input" value={form.bankName} onChange={e=>set("bankName",e.target.value)} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label><input className="input" value={form.accountNumber} onChange={e=>set("accountNumber",e.target.value)} required maxLength={10}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label><input className="input" value={form.accountName} onChange={e=>set("accountName",e.target.value)} required/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">BVN *</label><input className="input" value={form.bvn} onChange={e=>set("bvn",e.target.value)} required maxLength={11}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">NIN *</label><input className="input" value={form.nin} onChange={e=>set("nin",e.target.value)} required maxLength={11}/></div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(1)} className="btn-outline flex-1">← Back</button>
                <button type="button" onClick={()=>setStep(3)} className="btn-primary flex-1">Next →</button>
              </div>
            </div>
          )}
          {step===3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                <strong>Agent commission:</strong> Earn a % of monthly fees from each seller you recruit for 1 year. Rate set by admin.
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" className="input" value={form.password} onChange={e=>set("password",e.target.value)} required minLength={8}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label><input type="password" className="input" value={form.confirm} onChange={e=>set("confirm",e.target.value)} required/></div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={tcAccepted} onChange={e=>setTcAccepted(e.target.checked)} className="mt-0.5 shrink-0"/>
                <span className="text-xs text-gray-500 leading-snug">
                  I have read and agree to biz9ja&apos;s{" "}
                  <Link href="/terms" target="_blank" className="text-blue-700 hover:underline">Terms &amp; Conditions</Link>
                  , including the Data Protection and Privacy Policy. I understand that my personal and business information will be processed as described therein.
                </span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setStep(2)} className="btn-outline flex-1">← Back</button>
                <button type="submit" disabled={loading || !tcAccepted} className="btn-primary flex-1 disabled:opacity-60">{loading?"Registering...":"Register as Agent"}</button>
              </div>
            </div>
          )}
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Want to sell? <Link href="/register" className="text-blue-700 font-medium hover:underline">Seller signup</Link>
        </p>
      </div>
    </div>
  )
}
