import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

;export const metadata: Metadata = {
  title: {
    default: "SwiftLink - Free URL Shortener & Analytics",
    template: "%s | SwiftLink", 
  },
  description: "Simplify your links, amplify your reach. A powerful, free tool to shrink long links, track clicks, and analyze traffic.",
  keywords: ["url shortener", "link shortener", "free url shortener", "link tracking", "analytics"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "SwiftLink",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}