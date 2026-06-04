
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="bg-blue-700 py-4 px-6">
        <Link href="/" className="text-white text-xl font-bold">
          the<span className="text-blue-200">market</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
