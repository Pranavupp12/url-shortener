import { HeroSection } from "@/components/home-page/HeroSection";
import { HowItWorks } from "@/components/home-page/HowItWorks";
import { FeaturesBento } from "@/components/home-page/FeaturesBento";
import { FaqSection } from "@/components/home-page/FaqSection";
import { AbstractCtaBanner } from "@/components/home-page/CtaBanner"; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SwiftLink - Shorten URLs & Increase your presence Free",
  description: "Create short, memorable links in seconds. Track locations, devices, and click stats with our free URL shortener dashboard.",
  alternates: {
    canonical: "https://your-domain.com",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col ">
      
      {/* 1. Hero */}
      <HeroSection />

      {/* 3. Steps */}
      <HowItWorks />

      {/* 4. Features */}
      <FeaturesBento />

      {/* 5. FAQ */}
      <FaqSection />

      {/* 6. NEW CTA BANNER */}
      <AbstractCtaBanner />

    </div>
  );
}