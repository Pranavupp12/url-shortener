'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X ,Copy, Check, ArrowLeft, Share2, ExternalLink, ClipboardCheck, Sparkles, CornerDownRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { ChatInput, ChatInputTextArea } from "@/components/ui/chat-input";

interface ResultHeroProps {
    initialCode: string;
}

export function ResultHero({ initialCode }: ResultHeroProps) {
    const router = useRouter();

    const [displayUrl, setDisplayUrl] = useState<string>('');
    const [displayOriginal, setDisplayOriginal] = useState<string | null>(null);
    const [storageKey, setStorageKey] = useState('');
    
    // Button state
    const [isCopied, setIsCopied] = useState(false);
    
    // Message state
    const [showPostClickMessage, setShowPostClickMessage] = useState(false);
    
    const [hasClickedAd, setHasClickedAd] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Default redirect to Google if fetch fails
    const [activeRedirectUrl, setActiveRedirectUrl] = useState("https://republicnews.us");

    useEffect(() => {
        setMounted(true);

        async function getAdLink() {
            const CACHE_KEY = 'ad_target_url_v1';
            const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

            const cached = localStorage.getItem(CACHE_KEY);
            
            if (cached) {
                const { url, timestamp } = JSON.parse(cached);
                const isFresh = (Date.now() - timestamp) < CACHE_DURATION;

                if (isFresh && url) {
                    console.log("Using cached URL (Saved $)");
                    setActiveRedirectUrl(url);
                    return; 
                }
            }

            try {
                const res = await fetch('/api/admin/ad-settings');
                const data = await res.json();
                
                if (data.url) {
                    setActiveRedirectUrl(data.url);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        url: data.url,
                        timestamp: Date.now()
                    }));
                }
            } catch (e) { console.error("Ad fetch error", e); }
        }
        getAdLink();

        let codeToUse = initialCode;
        if (initialCode === 'success') {
            const sessionCode = sessionStorage.getItem('latest_short_code');
            const sessionOriginal = sessionStorage.getItem('latest_original_url');
            if (!sessionCode) { router.replace('/'); return; }
            codeToUse = sessionCode;
            setDisplayOriginal(sessionOriginal);
        }

        setStorageKey(codeToUse);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setDisplayUrl(`${origin}/${codeToUse}`);

        const previouslyClicked = sessionStorage.getItem(`ad_clicked_${codeToUse}`) === 'true';
        setHasClickedAd(previouslyClicked);

        // Fire confetti
        setTimeout(() => {
            confetti({ 
                particleCount: 150, 
                spread: 70, 
                origin: { y: 0.6 },
                colors: ['#2563eb', '#4f46e5', '#3b82f6', '#60a5fa'] 
            });
        }, 300);

    }, [initialCode, router]);

    const handleCopyAction = async () => {
        try {
            await navigator.clipboard.writeText(displayUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
            setShowPostClickMessage(true);
        } catch (err) {
            console.error("Failed to copy!", err);
        }

        if (activeRedirectUrl && !hasClickedAd) {
            window.open(activeRedirectUrl, '_blank');
            fetch('/api/track-copy-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUrl: activeRedirectUrl }),
                keepalive: true 
            });
            sessionStorage.setItem(`ad_clicked_${storageKey}`, 'true');
            setHasClickedAd(true);
        }
    };

    if (!mounted) return <div className="min-h-[90vh] flex items-center justify-center text-blue-600 animate-pulse">Initializing...</div>;

    return (
        <section className="relative pt-20 pb-20 text-center space-y-8 overflow-hidden min-h-[90vh] flex flex-col justify-center px-4 md:px-0">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] sm:h-[600px] bg-blue-200/40 blur-[30px] rounded-full pointer-events-none" />

            {/* Header Text */}
            <div className="relative z-10 space-y-2 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                    Your Link is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ready</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-lg mx-auto">
                    Copy your secure link below and share it with the world.
                </p>
            </div>

            {/* Main Result Card */}
            <Card className="relative z-10 w-full max-w-xl lg:max-w-2xl mx-auto bg-white/80 border border-blue-100 rounded-2xl overflow-hidden">
                <CardContent className="p-6 md:p-10 space-y-8">
                    
                    {/* --- Primary Action Area --- */}
                    <div className="space-y-4 text-left">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <Share2 className="w-3 h-3 text-blue-500" /> Short Link
                        </label>

                        {/* ChatInput Wrapper */}
                        <div className="relative group">
                             <ChatInput 
                                variant="default" 
                                value={displayUrl} 
                                className="min-h-[84px] bg-white border-2 border-blue-500 rounded-2xl"
                             >
                                <ChatInputTextArea 
                                    readOnly 
                                    className="text-md sm:text-xl font-mono text-slate-900 pointer-events-none select-none min-h-[50px] shadow-none resize-none pt-4 pl-4 bg-transparent" 
                                />
                                
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                                     <Button
                                        size="lg"
                                        onClick={handleCopyAction}
                                        className={`h-12 px-8 font-bold rounded-xl transition-all shadow-md transform active:scale-95 ${
                                            isCopied 
                                            ? 'bg-green-400 hover:bg-green-500 text-white ring-2 ring-green-200' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-100'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Copied</span>
                                        ) : (
                                            <span className="flex items-center gap-2"><Copy className="w-5 h-5" /> Copy</span>
                                        )}
                                    </Button>
                                </div>
                             </ChatInput>
                        </div>
                        
                       {/* Success Feedback */}
                        <div className={`transition-all duration-500 ease-out overflow-hidden ${showPostClickMessage ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                             {/* Added 'relative' and 'pr-10' to make room for the X button */}
                             <div className="relative bg-green-50/50 border border-green-200 rounded-xl p-3 pr-10 flex items-center gap-3 text-green-800">
                                <div className="bg-green-100 p-1.5 rounded-full shrink-0">
                                    <ClipboardCheck className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">Copied to clipboard</p>
                                </div>
                                
                                {/* Close Button */}
                                <button 
                                    onClick={() => setShowPostClickMessage(false)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* --- Destination Context --- */}
                    {displayOriginal && (
                        <div className="relative">
                            <div className="absolute left-6 -top-6 w-px h-6 bg-blue-500" /> {/* Connector Line */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                <CornerDownRight className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">Redirects to</p>
                                    <a 
                                        href={decodeURIComponent(displayOriginal)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-sm text-slate-600 font-medium  block hover:text-blue-600 hover:underline transition-colors"
                                    >
                                        {decodeURIComponent(displayOriginal)}
                                        <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-50" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer Action */}
            <div className="relative z-10">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-500 hover:text-blue-600 hover:bg-transparent gap-2 transition-all z-10 relative">
                        <ArrowLeft className="h-4 w-4" /> Shorten another link
                    </Button>
                </Link>
            </div>
        </section>
    )
}