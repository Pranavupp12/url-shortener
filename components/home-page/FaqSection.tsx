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
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Everything you need to <span className="text-blue-600">know.</span>
          </h2>
        </div>

        {/* --- Accordion --- */}
        <Accordion type="single" collapsible className="w-full space-y-4">

          <AccordionItem value="item-1" className="bg-white px-6">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6">
              Is SwiftLink completely free?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              Yes! SwiftLink is a free tool for shortening URLs. We support our platform via unobtrusive advertisements, allowing us to keep the core features free for everyone without hidden paywalls.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white px-6 ">
            <AccordionTrigger className="text-md  font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6">
              Do my short links expire?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              No. Once you create a short link, it stays active indefinitely. We rarely remove links unless they violate our terms of service (e.g., used for spam, phishing, or malicious content).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white px-6 ">
            <AccordionTrigger className="text-md font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6">
              Do my short links expire?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              No, your links are permanent. Once you create a short link, it remains active for a very long time , you can trust them for long-term campaigns and printed materials.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white px-6 ">
            <AccordionTrigger className="text-md  font-semibold text-gray-800 hover:text-blue-600 hover:no-underline py-6">
              Is it SEO friendly?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-6">
              Yes. We use permanent 301/302 redirects which are standard for SEO. However, URL shorteners are primarily designed for sharing on social media, emails, and SMS, rather than for direct SEO ranking benefit.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </section>
  )
}