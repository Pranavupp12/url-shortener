import { cn } from "@/lib/utils";
import Image from "next/image";

interface BentoCardProps {
  title: string;
  description: string;
  graphic: React.ReactNode;
  className?: string;
  bgClass?: string;
  /** * 'vertical' = Text Top, Image Bottom (Default)
   * 'horizontal' = Text Left, Image Right (For Global Card)
   */
  variant?: "vertical" | "horizontal"; 
}

const BentoCard = ({ 
  title, 
  description, 
  graphic, 
  className, 
  bgClass,
  variant = "vertical" 
}: BentoCardProps) => (
  <div className={cn(
    "relative overflow-hidden rounded-3xl p-6 ", 
    // Conditional Layout: Column for standard, Row for horizontal
    variant === "horizontal" ? "flex flex-row items-center" : "flex flex-col",
    bgClass, 
    className
  )}>
    
    {/* Text Content */}
    <div className={cn(
      "relative z-20 flex flex-col mb-0",
      // If horizontal, constrain text width so it doesn't overlap image
      variant === "horizontal" ? "w-[40%] mb-0" : "w-full"
    )}>
      <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2 leading-tight">{title}</h3>
      <p className="text-gray-700 leading-relaxed font-medium text-sm">
        {description}
      </p>
    </div>
    
    {/* Graphic Slot */}
    <div className={cn(
      "relative",
      variant === "horizontal" 
        ? "absolute right-0 top-0 w-[60%] h-full" // Horizontal: Absolute Right
        : "flex-1 w-full min-h-[100px] flex items-end justify-center" // Vertical: Bottom Center
    )}>
      {graphic}
    </div>
  </div>
);

export function FeaturesBento() {
  return (
    <section className="bg-white py-10" id="features">
      <div className="max-w-7xl mx-auto ">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
         <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500">
            Features
          </span>
          
          {/* Heading (Removed the word 'Features') */}
          <h2 className="text-2xl md:text-5xl font-semibold text-gray-900 tracking-tight">
            Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-700">Growth.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px] px-6 lg:px-0">
          
          {/* 1. LIGHTNING FAST (Vertical) */}
          <BentoCard 
            title="Lightning Fast"
            description="Global edge network ensures <50ms redirects."
            bgClass="bg-[#FFF8E6]" 
            graphic={
              <div className="relative w-full h-full">
                 <Image 
                   src="/images/fast-loading.png" 
                   alt="Speed Illustration"
                   fill
                   loading="eager"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-contain object-bottom"
                 />
              </div>
            }
          />

          {/* 2. MOBILE OPTIMIZED (Vertical) */}
          <BentoCard 
            title="Mobile Optimized"
            description="Perfect experience on every device."
            bgClass="bg-[#F3E8FF]" 
            graphic={
              <div className="relative w-full h-full">
                 <Image 
                   src="/images/mobile-new.png"
                   alt="Mobile Phone"
                   fill
                   loading="eager"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-contain object-bottom"
                 />
              </div>
            }
          />

          {/* 3. SECURE & ENCRYPTED (Vertical) */}
          <BentoCard 
            title="Secure & Encrypted"
            description="Enterprise-grade HTTPS encryption."
            bgClass="bg-[#E6F4F1]" 
            graphic={
                <div className="relative w-full h-full">
                 <Image 
                   src="/images/security.png"
                   alt="Security Shield"
                   fill
                   loading="eager"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-contain object-bottom"
                 />
              </div>
            }
          />

          {/* 4. PRIVACY FOCUSED (Vertical) */}
          <BentoCard 
            title="Privacy Focused"
            description="Your data is yours. We are GDPR compliant."
            bgClass="bg-[#EFF6FF]" 
            graphic={
               <div className="relative w-full h-full">
                  <Image 
                    src="/images/privacy.png" 
                    alt="Privacy Lock" 
                    fill 
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain object-bottom"
                  />
               </div>
            }
          />

          {/* 5. GLOBAL INFRASTRUCTURE (Horizontal / Wide) */}
          <BentoCard 
            variant="horizontal" // <--- This switches the layout
            title="Global Infrastructure"
            description="99.9% uptime guaranteed with servers distributed worldwide."
            bgClass="bg-[#E0F2FE] md:col-span-2" 
            graphic={
               <div className="relative w-full h-full ">
                 <Image 
                   src="/images/global.png"
                   alt="World Map"
                   fill
                   loading="eager"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-contain object-right" // Align to right inside the slot
                 />
               </div>
            }
          />

        </div>
      </div>
    </section>
  )
}