import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="py-10 bg-white px-6 md:px-0" id="faq">
      <div className="max-w-3xl mx-auto w-full">

        {/* --- Header --- */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
            Support
          </span>
          <h2 className="text-2xl md:text-5xl font-semibold text-gray-900 tracking-tight">
            Everything you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-700">need to know.</span>
          </h2>
        </div>

        {/* --- Accordion --- */}
        <Accordion type="single" collapsible className="w-full space-y-4">

          {/* 1. Free (Removed ad mention) */}
          <AccordionItem value="item-1" className="bg-white px-6 border-b rounded-none">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6 text-left">
              Is SwiftLink completely free to use?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              Yes! SwiftLink is 100% free. You can use our URL shortening features instantly without any subscriptions, hidden fees, or payment requirements.
            </AccordionContent>
          </AccordionItem>

          {/* 2. Daily Limit */}
          <AccordionItem value="item-2" className="bg-white px-6 border-b rounded-none">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6 text-left">
              Is there a limit on how many links I can create?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              To ensure high performance and fair usage for everyone, we limit users to <strong>5 short links per day</strong>. If you reach this limit, simply come back tomorrow to create more.
            </AccordionContent>
          </AccordionItem>

          {/* 3. Account / Dashboard */}
          <AccordionItem value="item-3" className="bg-white px-6 border-b rounded-none">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6 text-left">
              Do I need to create an account?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              No account is required. We believe in speed and simplicity—just paste your link and shorten it instantly. Since there are no accounts, we do not store personal user data or provide a dashboard for link management.
            </AccordionContent>
          </AccordionItem>

          {/* 4. Expiration Policy */}
          <AccordionItem value="item-4" className="bg-white px-6 border-b rounded-none">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6 text-left">
              Do my short links expire?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              Your links are designed to be permanent. We do not set an expiry date on standard links. However, we actively monitor for abuse; links used for spam, phishing, or malicious activity will be removed immediately.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  )
}