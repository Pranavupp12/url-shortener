import { cn } from "@/lib/utils";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-start text-left h-full p-2">
      {/* UPDATED: Changed text-gray-900 to text-blue-600 */}
      <span className="text-4xl sm:text-6xl font-extrabold text-blue-600 mb-6 font-mono tracking-tighter">
        {number}
      </span>
      
      {/* Content */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="py-10 sm:py-15 px-6 md:px-0">
      {/* The Grey Container Wrapper */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] px-6 md:px-16 text-center">
        
        {/* Header Section */}
        <div className="mb-10 sm:mb-16 max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
            How it works
          </span>
          <h2 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight">
             Shorten your links in <span className="text-blue-600 ">3 Steps.</span>
          </h2>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-20">
           <StepCard 
             number="01" 
             title="Paste Your Link" 
             description="Copy your long, messy URL from your browser and paste it directly into our shortening tool above." 
           />
           <StepCard 
             number="02" 
             title="Click Shorten" 
             description="Hit the blue button. Our intelligent system instantly compresses your link into a secure, shareable format." 
           />
           <StepCard 
             number="03" 
             title="Share & Track" 
             description="Copy your new link, share it across social media, and watch the real-time analytics roll in on your dashboard." 
           />
        </div>

      </div>
    </section>
  )
}