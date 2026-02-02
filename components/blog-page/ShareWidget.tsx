'use client'

import { Check, Copy, Facebook, Instagram } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner" 

interface ShareWidgetProps {
  title: string;
  slug: string;
}

export function ShareWidget({ title, slug }: ShareWidgetProps) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [])

  const shareFacebook = () => {
    if (!url) return;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  const shareX = () => {
    if (!url) return;
    const text = encodeURIComponent(title);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  const handleInstagram = () => {
    copyToClipboard();
  }

  const copyToClipboard = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  return (
    <div className="flex items-center gap-5">
       {/* Instagram (Brand Pink) */}
       <button 
          onClick={handleInstagram}
          className="text-[#E1306C] hover:opacity-80 transition-opacity"
          title="Instagram"
       >
          <Instagram className="w-6 h-6" />
       </button>

       {/* Facebook (Brand Blue) */}
       <button 
          onClick={shareFacebook} 
          className="text-[#1877F2] hover:opacity-80 transition-opacity"
          title="Facebook"
       >
          <Facebook className="w-6 h-6" />
       </button>

       {/* X / Twitter (Black) */}
       <button 
          onClick={shareX} 
          className="text-black hover:opacity-80 transition-opacity"
          title="X (Twitter)"
       >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
             <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
       </button>

       {/* Divider */}
       <div className="w-px h-6 bg-gray-200"></div>

       {/* Copy Link (Gray) */}
       <button 
          onClick={copyToClipboard} 
          className="text-gray-500 hover:text-gray-900 transition-colors"
          title="Copy Link"
       >
          {copied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
       </button>
    </div>
  )
}