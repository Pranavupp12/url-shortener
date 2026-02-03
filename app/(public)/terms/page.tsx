import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText, Ban, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for MinifyLinks. Understand the rules, usage limits, and your rights when using our URL shortener.",
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link href="/">
          <Button variant="ghost" className="text-slate-500 hover:text-blue-500 hover:bg-white pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black font-semibold tracking-tight text-slate-900">Terms of Service</h1>
          <p className="text-slate-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Content Card */}
        <Card className="border-none bg-white py-0">
          <CardContent className="p-8 md:p-12 space-y-10">
            
            {/* 1. Agreement */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using <strong>MinifyLinks</strong> ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to abide by these terms, please do not use this Service.
              </p>
            </section>

            <hr className="border-gray-100" />

            {/* 2. Service Usage & Limits */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" /> 2. Usage & Limits
              </h2>
              <p className="text-gray-600 leading-relaxed">
                MinifyLinks is a free service provided on an "as is" basis. No account registration is required to use the basic features of the platform.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 space-y-2">
                <div className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Fair Usage Policy
                </div>
                <p>
                  To prevent abuse and ensure high performance for all users, we enforce a strict limit of <strong>5 short links per user, per day</strong>. 
                  Attempts to bypass this limit (e.g., using VPNs or bot automation) may result in a permanent ban from the Service.
                </p>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* 3. Prohibited Use */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Ban className="w-5 h-5 text-blue-500" /> 3. Prohibited Content
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree strictly <strong>not</strong> to use the Service to shorten links that redirect to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Phishing, malware, viruses, or scams.</li>
                <li>Content that is illegal, threatening, defamatory, or harassing.</li>
                <li>Pornographic or explicit material.</li>
                <li>Spam or unsolicited advertising.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                We actively monitor links. We reserve the right to <strong>disable any link</strong> and block any user at our sole discretion, without prior notice, if we suspect a violation of these terms.
              </p>
            </section>

            <hr className="border-gray-100" />

            {/* 4. Ads & Third Party */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-500" /> 4. Advertisements & Disclaimers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                <strong>Ad-Supported Service:</strong> To keep MinifyLinks free, we may display advertisements. By using the service, you acknowledge and agree to the presence of these advertisements.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>No Warranty:</strong> We do not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for any damages resulting from the use of our Service or the inability to access your shortened links.
              </p>
            </section>

            <hr className="border-gray-100" />

            {/* Contact */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold">5. Contact Us</h2>
              <p className="text-gray-600">
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="font-medium text-slate-900 hover:underline hover:text-blue-500">support@minifylinks.com</p>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}