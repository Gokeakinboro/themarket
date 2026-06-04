
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">themarket</h3>
          <p className="text-sm text-blue-300">Nigeria's trusted marketplace for buying and selling with secure escrow payments.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Sell</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/register" className="hover:text-white transition-colors">Start Selling</Link></li>
            <li><Link href="/dashboard/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Agents</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/register/agent" className="hover:text-white transition-colors">Become an Agent</Link></li>
            <li><Link href="/dashboard/agent" className="hover:text-white transition-colors">Agent Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
            <li><Link href="/escrow" className="hover:text-white transition-colors">Escrow protection</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-800 py-4 text-center text-sm text-blue-400">
        © {new Date().getFullYear()} themarket. All rights reserved. Payments secured by Paylode.
      </div>
    </footer>
  )
}
