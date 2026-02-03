import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AbstractCtaBanner() {
  return (
    <section className="py-10 px-6 md:px-25">
      <div className="relative max-w-5xl mx-auto bg-gray-50 rounded-[3rem] p-10 text-center overflow-hidden">
        
        {/* --- Abstract Geometric Shapes (Updated Colors) --- */}

        {/* 1. Top Left: Vertical Light Blue Pill */}
        <div className="absolute -top-10 left-10 w-32 h-64 bg-blue-50 rounded-full -rotate-12 opacity-80 pointer-events-none" />
        
        {/* 2. Top Left: Deep Blue Circle Overlap */}
        <div className="absolute top-10 -left-10 w-30 sm:w-40 h-30 sm:h-40 bg-blue-600 rounded-full opacity-90 pointer-events-none mix-blend-multiply" />

        {/* 3. Top Right: Sky Blue Pill (Was Gray) */}
        <div className="absolute -top-20 right-20 w-28 sm:w-48 h-40 sm:h-48 bg-sky-100 rounded-full pointer-events-none opacity-80" />
        

        {/* 5. Bottom Left: Soft Indigo Circle (Was Gray) */}
        <div className="absolute -bottom-20 left-20 w-36 sm:w-56 h-36 sm:h-56 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-full pointer-events-none" />

        {/* 6. Bottom Right: Vibrant Blue Pill */}
        <div className="absolute -bottom-24 -right-12 w-40 h-55 sm:h-80 bg-blue-600 rounded-t-full rounded-b-none pointer-events-none opacity-90" />


        {/* --- Content --- */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-8 mt-7 sm:mt-0">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
            Get Started
          </span>
          
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1] text-gray-900">
            Start sharing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-700">smarter links.</span>
          </h2>
          
          <p className="text-md sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto font-medium">
            Experience secure and fast redirection,
            <br className="hidden sm:block"/> Join thousands of users today.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center">
            <Button 
              size="lg" 
              className="h-12 sm:h-14 px-6 sm:px-10 bg-blue-600 text-white hover:bg-blue-700 font-medium text-md sm:text-lg rounded-full shadow-lg sm:w-auto"
              asChild
            >
              <Link href="/#hero-section">
                Create Short Link <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}