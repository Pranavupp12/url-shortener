import { HeroSection } from "@/components/home-page/HeroSection";
import { HowItWorks } from "@/components/home-page/HowItWorks";
import { FeaturesBento } from "@/components/home-page/FeaturesBento";
import { FaqSection } from "@/components/home-page/FaqSection";
import { AbstractCtaBanner } from "@/components/home-page/CtaBanner";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free URL Shortener & Custom Links",
  description: "Turn long URLs into smart, branded short links with MinifyLinks. Track clicks, use custom aliases, and grow your reach with a fast, reliable, and free URL shortener.",
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