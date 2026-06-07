import Link from "next/link"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="bg-blue-700 py-4 px-6">
        <Link href="/">
          <Image src="/biz9ja-logo.svg" alt="biz9ja" width={240} height={80} priority />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}
