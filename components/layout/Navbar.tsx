'use client'

import Link from "next/link";
import { Menu, X, Link2 } from "lucide-react"; 
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Blogs", href: "/blog" },
    { name: "FAQs", href: "/#faq" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white border-none py-5">
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO (Left) */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-2xl tracking-tight text-gray-900">
            MinifyLinks
          </span>
        </Link>

        {/* DESKTOP NAV (Right) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative group text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {link.name}
              
              {/* THE UNDERLINE BAR */}
              <span className="absolute left-0 -bottom-[25px] w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </Link>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-medium text-gray-600 hover:text-blue-600 py-2 border-b border-gray-50 last:border-0"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}