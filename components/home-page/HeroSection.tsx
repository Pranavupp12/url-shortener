'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ChatInput, ChatInputTextArea, ChatInputSubmit } from "@/components/ui/chat-input";

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">{number}</span>
      <span className="text-xs sm:text-sm font-medium text-white uppercase tracking-wide">{label}</span>
    </div>
  )
}

export function HeroSection() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault(); // ChatInputSubmit handles click, but good to have safeguard
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Link shortened successfully!")

        // --- 1. Save Real Data to Session Storage ---
        sessionStorage.setItem('latest_short_code', data.shortCode);
        sessionStorage.setItem('latest_original_url', url);

        // --- 2. Redirect to existing page with a GENERIC placeholder ---
        router.push('/result/success');

      } else {
        toast.error(data.error || "Failed to shorten link.")
      }
    } catch (err) {
      toast.error("Network Error.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="relative pt-15 sm:pt-27 pb-0 sm:pb-10 text-center space-y-8 px-6 lg:px-0" id='hero-section'>
      <div className="absolute top-40 lg:top-30 left-1/2 -translate-x-1/2 w-[400px] lg:w-[900px] h-[500px] bg-blue-100/60 blur-[50px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-0">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-4 sm:mb-6">
          Shorten URLs, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Expand Your Reach.
          </span>
        </h1>
        <p className="text-sm sm:text-md md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A powerful, free tool to shrink long links into memorable short URLs. Track clicks, analyze traffic, and boost your brand visibility.
        </p>
      </div>

      <Card className="max-w-2xl lg:max-w-3xl mx-auto bg-transparent border-none relative z-10 py-0 mb-4 sm:mb-6">
        <CardContent className="px-2 sm:px-8">
            <ChatInput 
                variant="default"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onSubmit={handleSubmit}
                loading={loading}
                className='border-2 border-blue-500 bg-white/80'
            >
                <ChatInputTextArea placeholder="Paste your long link here..." className="text-sm md:text-lg min-h-[50px]" />
                <ChatInputSubmit className="bg-blue-600 hover:bg-blue-700 text-white border-transparent" />
            </ChatInput>
          <p className="text-xs text-gray-600 mt-3 z-10 relative">By using this service, you agree to our Terms.</p>
        </CardContent>
      </Card>

    </section>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 my-2.5 py-15 px-10 bg-blue-600 max-w-full mx-0 relative z-10">
        <StatItem number="10K+" label="Links Shortened" />
        <StatItem number="5M+" label="Clicks Made" />
        <StatItem number="99.9%" label="Uptime" />
        <StatItem number="Free" label="To Use" />
      </div>

    </>
  )
}