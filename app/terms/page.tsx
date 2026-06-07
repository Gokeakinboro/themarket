import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export const metadata = {
  title: "Terms & Conditions | biz9ja",
  description: "Terms and Conditions for biz9ja marketplace, including Data Protection and NDPR compliance.",
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Welcome to biz9ja, a Nigerian online marketplace operated by biz9ja (hereinafter referred to as &quot;biz9ja&quot;,
                &quot;we&quot;, &quot;our&quot; or &quot;us&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the biz9ja
                platform, including our website at biz9ja.com and any related services (collectively, the &quot;Platform&quot;).
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                By registering an account, browsing the Platform, or engaging in any transaction on biz9ja, you agree to be
                bound by these Terms in full. If you do not agree with any part of these Terms, you must not use the Platform.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria and are compliant with the Nigeria
                Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act 2023 (NDPA).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">2. Definitions</h2>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-none">
                <li><strong>&quot;Platform&quot;</strong> means the biz9ja website and all associated services operated at biz9ja.com.</li>
                <li><strong>&quot;User&quot;</strong> means any individual who accesses or uses the Platform, including Buyers, Sellers, and Agents.</li>
                <li><strong>&quot;Seller&quot;</strong> means a registered user who lists products or services for sale on the Platform.</li>
                <li><strong>&quot;Buyer&quot;</strong> means a registered or guest user who purchases products or services via the Platform.</li>
                <li><strong>&quot;Agent&quot;</strong> means an individual registered to recruit sellers and earn commission.</li>
                <li><strong>&quot;Escrow&quot;</strong> means the payment holding mechanism by which funds are retained by biz9ja pending confirmation of delivery.</li>
                <li><strong>&quot;Personal Data&quot;</strong> has the meaning given to it under the Nigeria Data Protection Regulation 2019 and Nigeria Data Protection Act 2023.</li>
                <li><strong>&quot;NDPR&quot;</strong> means the Nigeria Data Protection Regulation 2019 issued by the National Information Technology Development Agency (NITDA).</li>
                <li><strong>&quot;NDPA&quot;</strong> means the Nigeria Data Protection Act 2023.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">3. User Accounts</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                To access certain features of the Platform, you must register and create an account. You agree to:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5">
                <li>Provide accurate, current, and complete information during registration and keep such information updated.</li>
                <li>Maintain the confidentiality of your account credentials and not share your password with any third party.</li>
                <li>Accept responsibility for all activities that occur under your account.</li>
                <li>Notify biz9ja immediately at admin@biz9ja.com if you suspect any unauthorised use of your account.</li>
                <li>Not register more than one account without prior written consent from biz9ja.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                biz9ja reserves the right to suspend or permanently close any account that it reasonably believes has breached
                these Terms, is engaged in fraudulent activity, or poses a risk to the Platform or other Users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">4. Seller Obligations</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">By registering as a Seller on biz9ja, you agree to:</p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5">
                <li>List only goods and services that you lawfully own or have the right to sell.</li>
                <li>Provide accurate descriptions, photographs, prices, and availability for all listed products.</li>
                <li>Fulfil orders promptly and deliver goods in the condition described to the Buyer.</li>
                <li>Complete all required KYC (Know Your Customer) verification, including submission of valid BVN and NIN, as required by Nigerian law and biz9ja policy.</li>
                <li>Comply with all applicable Nigerian laws, including the Consumer Protection Council Act, the Federal Competition and Consumer Protection Act (FCCPA), and any applicable sector regulations.</li>
                <li>Not list any prohibited items as set out in Section 7 of these Terms.</li>
                <li>Understand that funds from sales are held in escrow and released only upon confirmation of delivery or after the applicable holding period.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">5. Buyer Obligations</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">By placing an order on biz9ja, you agree to:</p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5">
                <li>Provide accurate delivery address and contact information.</li>
                <li>Make payment in full at the time of placing your order.</li>
                <li>Inspect goods upon receipt and raise any dispute within the applicable escrow window.</li>
                <li>Not engage in chargebacks or payment reversals outside of the biz9ja dispute resolution process.</li>
                <li>Use the Platform only for lawful purposes and not to acquire prohibited items.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">6. Escrow and Payments</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                All transactions on biz9ja are processed through a secure escrow mechanism. The following terms apply:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5">
                <li>Payment is collected from the Buyer at the time of order and held in escrow pending delivery confirmation.</li>
                <li>The escrow holding period is 24 hours from the time the Seller marks the order as delivered, unless a dispute is raised by the Buyer.</li>
                <li>Funds are released to the Seller upon expiry of the holding period, less any applicable platform fees.</li>
                <li>In the event of a dispute, funds remain in escrow until the dispute is resolved in accordance with Section 11.</li>
                <li>biz9ja uses Paylode as its payment processor. By transacting on the Platform, you also agree to Paylode&apos;s terms of service.</li>
                <li>biz9ja does not store card details. All payment data is handled by our PCI-compliant payment processor.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">7. Prohibited Items</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                The following items and services are strictly prohibited from being listed or sold on the biz9ja Platform:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5">
                <li>Illegal drugs, narcotics, or controlled substances.</li>
                <li>Firearms, ammunition, explosives, or any items that require a government licence that has not been verified.</li>
                <li>Counterfeit, stolen, or fraudulently obtained goods.</li>
                <li>Items that infringe any third-party intellectual property rights.</li>
                <li>Human beings, human organs, or any form of human trafficking.</li>
                <li>Pornographic or obscene material.</li>
                <li>Hazardous chemicals or materials not approved for civilian sale.</li>
                <li>Any goods or services that violate Nigerian law or any applicable international law.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mt-3">
                biz9ja reserves the right to remove any listing and suspend any account involved in the sale or attempted sale
                of prohibited items without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">8. Intellectual Property</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                All rights, copyrights, patents, trademarks and intellectual property on the biz9ja platform are exclusively
                owned by biz9ja. No part may be copied, reproduced or used without written permission.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                This includes, without limitation, the biz9ja name, logo, brand identity, website design, source code, text
                content, photographs, graphics, and all other materials published on the Platform.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Users who upload product images, descriptions, and other content to the Platform grant biz9ja a non-exclusive,
                royalty-free, worldwide licence to use, display, and distribute such content solely for the purpose of operating
                and promoting the Platform. You represent and warrant that you own or have the necessary rights to all content
                you upload and that such content does not infringe any third-party intellectual property rights.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Any unauthorised use of biz9ja intellectual property may result in civil and criminal liability under the
                Copyright Act (Cap C28) LFN 2004 and the Trademarks Act (Cap T13) LFN 2004, as applicable.
              </p>
            </section>

            <section id="privacy" className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">9. Data Protection and Privacy (NDPR Compliance)</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                biz9ja is committed to protecting your personal data in accordance with the Nigeria Data Protection Regulation
                (NDPR) 2019 and the Nigeria Data Protection Act (NDPA) 2023. This section explains how we collect, use, store,
                and protect your personal data.
              </p>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.1 Lawful Basis for Processing</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                biz9ja processes your personal data on the following lawful bases as recognised by the NDPR and NDPA:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-4">
                <li><strong>Performance of contract:</strong> Processing necessary to register your account, process orders, manage escrow payments, and facilitate transactions between Buyers and Sellers.</li>
                <li><strong>Legitimate interest:</strong> Processing necessary for fraud prevention, security monitoring, dispute resolution, and improvement of the Platform.</li>
                <li><strong>Consent:</strong> Where you have given explicit consent, for example for marketing communications. You may withdraw consent at any time by contacting admin@biz9ja.com.</li>
                <li><strong>Legal obligation:</strong> Processing required to comply with applicable Nigerian law, including anti-money laundering (AML) and Know Your Customer (KYC) obligations.</li>
              </ul>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.2 Data Collected</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">We collect the following categories of personal data:</p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-4">
                <li><strong>Identity data:</strong> Full name, date of birth, profile photograph.</li>
                <li><strong>Contact data:</strong> Email address, phone number(s), delivery address.</li>
                <li><strong>KYC data (Sellers and Agents only):</strong> Bank Verification Number (BVN), National Identification Number (NIN), business registration details. This data is collected to satisfy Nigerian regulatory requirements and is processed through our verified KYC partner, YouVerify.</li>
                <li><strong>Financial data:</strong> Bank account name, account number, bank name. We do not store card numbers or CVV codes.</li>
                <li><strong>Transaction data:</strong> Details of orders placed, payments made, and escrow transactions conducted on the Platform.</li>
                <li><strong>Technical data:</strong> IP address, browser type, device information, and cookies used to maintain your session and for analytics purposes.</li>
                <li><strong>Usage data:</strong> Information about how you use the Platform, including pages visited and searches made.</li>
              </ul>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.3 Your Rights as a Data Subject</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Under the NDPR and NDPA, you have the following rights in relation to your personal data:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-4">
                <li><strong>Right of access:</strong> You may request a copy of the personal data we hold about you at any time.</li>
                <li><strong>Right to rectification:</strong> You may request that we correct any inaccurate or incomplete personal data.</li>
                <li><strong>Right to erasure:</strong> You may request deletion of your personal data, subject to our legal obligations to retain certain data (see Section 9.4).</li>
                <li><strong>Right to data portability:</strong> You may request that we provide your personal data in a structured, commonly used, and machine-readable format for transfer to another service.</li>
                <li><strong>Right to object:</strong> You may object to the processing of your personal data where we rely on legitimate interest as our lawful basis.</li>
                <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw that consent at any time without affecting the lawfulness of prior processing.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                To exercise any of these rights, please contact our Data Protection Officer at admin@biz9ja.com. We will respond
                to all verified requests within 30 days in accordance with the NDPR.
              </p>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.4 Data Retention</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">We retain your personal data only for as long as necessary for the purposes set out in these Terms:</p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-4">
                <li><strong>Transaction data</strong> (orders, payments, escrow records) is retained for a minimum of <strong>7 years</strong> from the date of the transaction to comply with Nigerian financial regulations and tax laws.</li>
                <li><strong>Account data</strong> is deleted within <strong>30 days</strong> of a valid account closure request, subject to the transaction data retention obligation above.</li>
                <li><strong>KYC data</strong> is retained for the duration required by applicable Nigerian anti-money laundering regulations.</li>
              </ul>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.5 Third-Party Data Sharing</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                We may share your personal data with the following categories of third-party service providers, solely to the extent necessary to operate the Platform:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-4">
                <li><strong>YouVerify:</strong> For KYC verification of Sellers and Agents, including verification of BVN and NIN against government databases.</li>
                <li><strong>Payment processors (Paylode):</strong> For processing payments, managing escrow, and facilitating disbursements.</li>
                <li><strong>Cloudinary:</strong> For storage and delivery of product images and user-uploaded media.</li>
                <li><strong>Analytics providers:</strong> For anonymised usage analytics to improve Platform performance.</li>
                <li><strong>Law enforcement and regulatory bodies:</strong> Where required by law, court order, or lawful request from a Nigerian government authority.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                We do not sell your personal data to any third party for marketing or commercial purposes.
              </p>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.6 Security Measures</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                biz9ja implements appropriate technical and organisational security measures to protect your personal data
                against unauthorised access, loss, destruction, or alteration. These measures include encrypted storage of
                sensitive data, role-based access controls limiting staff access to personal data on a need-to-know basis, and
                regular security reviews of our systems and processes. Despite these measures, no system is entirely immune to
                security threats and we cannot guarantee absolute security.
              </p>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.7 Cross-Border Data Transfers</h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                biz9ja does not transfer personal data outside of Nigeria except to the extent necessary to operate the Platform
                through our approved service providers (as listed in Section 9.5). Where any such transfer occurs, we ensure
                that the recipient provides adequate protection for personal data at a standard equivalent to or greater than
                that required by Nigerian law, including through contractual data processing agreements. All cross-border
                transfers are conducted in accordance with the NDPR and the NDPA.
              </p>
              <h3 className="font-semibold text-base text-gray-800 mb-2">9.8 Data Protection Officer</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Our Data Protection Officer (DPO) can be contacted at: <strong>admin@biz9ja.com</strong>. Any concerns,
                complaints, or requests relating to your personal data should be directed to our DPO. You also have the right
                to lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe your rights under the
                NDPR or NDPA have been violated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">10. Limitation of Liability</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                To the maximum extent permitted by applicable Nigerian law, biz9ja shall not be liable for:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-3">
                <li>Any indirect, incidental, special, or consequential loss or damage arising from your use of the Platform.</li>
                <li>Loss of profits, revenue, data, or goodwill.</li>
                <li>The conduct, acts, or omissions of any Seller, Buyer, or Agent on the Platform.</li>
                <li>Any inaccuracies in product listings or seller-provided information.</li>
                <li>Interruptions or unavailability of the Platform due to technical issues, maintenance, or events outside our control.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed">
                biz9ja acts as a marketplace facilitator. We are not a party to the contract of sale between Buyer and Seller.
                Our liability in any claim arising from a transaction shall not exceed the value of the escrow amount held in
                connection with that specific transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">11. Dispute Resolution</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                In the event of a dispute between a Buyer and a Seller, the following process applies:
              </p>
              <ul className="text-sm text-gray-700 leading-relaxed space-y-2 list-disc ml-5 mb-3">
                <li>The disputing party must raise the dispute through the Platform within the applicable escrow window by contacting admin@biz9ja.com.</li>
                <li>biz9ja will attempt to facilitate an amicable resolution between the parties within 5 business days.</li>
                <li>Where no resolution is reached, biz9ja may make a final determination based on available evidence, including delivery records and communications.</li>
                <li>biz9ja&apos;s determination shall be final and binding in respect of the escrow funds.</li>
              </ul>
              <p className="text-sm text-gray-700 leading-relaxed">
                Disputes that cannot be resolved through the above process may be referred to arbitration in Lagos, Nigeria
                under the Arbitration and Conciliation Act (Cap A18) LFN 2004 or the Arbitration and Mediation Act 2023, as applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">12. Governing Law</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                These Terms and Conditions are governed by and shall be construed in accordance with the laws of the Federal
                Republic of Nigeria. Any legal action or proceeding arising from or in connection with these Terms shall be
                subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria, without prejudice to the right of
                either party to seek urgent injunctive or other equitable relief in any competent court.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold text-lg text-gray-900 mb-3">13. Contact Us</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                If you have any questions about these Terms, your rights under the NDPR, or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                <p><strong>biz9ja</strong></p>
                <p>Nigeria</p>
                <p>Email: <a href="mailto:admin@biz9ja.com" className="text-blue-700 hover:underline">admin@biz9ja.com</a></p>
              </div>
            </section>

            <section className="mb-4">
              <h2 className="font-bold text-lg text-gray-900 mb-3">14. Amendments</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                biz9ja reserves the right to update or amend these Terms at any time. Where material changes are made, we will
                notify registered users by email at least 14 days before the changes take effect. Continued use of the Platform
                following notification constitutes acceptance of the updated Terms.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                The version of these Terms currently in force is the version dated at the top of this page. We recommend that
                you review these Terms periodically to stay informed of any updates.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
