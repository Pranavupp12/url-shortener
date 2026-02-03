import { HeroSection } from "@/components/home-page/HeroSection";
import { HowItWorks } from "@/components/home-page/HowItWorks";
import { FeaturesBento } from "@/components/home-page/FeaturesBento";
import { FaqSection } from "@/components/home-page/FaqSection";
import { AbstractCtaBanner } from "@/components/home-page/CtaBanner"; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "MinifyLinks - Shorten URLs & Increase your presence for Free",
  description: "Create short, memorable links in seconds. Boost your brand visibility and performance with our free URL shortener.",
  alternates: {
    canonical: "https://minifylinks.com",
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