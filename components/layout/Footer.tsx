import Link from "next/link";
import { Twitter, Linkedin, Github, Facebook } from "lucide-react";

export function Footer() {
  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blog" },
    { name: "Features", href: "/#features" },
    { name: "FAQs", href: "/#faq" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-blue-600 border-t border-gray-100 py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* TOP SECTION: Aligned Start (Left) on Mobile, Center on Desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* LEFT: Brand */}
          <div className="flex flex-col items-start gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-bold text-xl tracking-tight text-white">
                SwiftLink
              </span>
            </Link>
            <p className="text-white text-sm">
              Simplify your links, amplify your reach.
            </p>
          </div>

          {/* RIGHT: Navigation Links (Vertical List on Mobile) */}
          <nav className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* BOTTOM: Divider & Socials */}
        <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} SwiftLink Inc. All rights reserved.
          </p>
          
          <div className="flex gap-6 md:gap-4">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}