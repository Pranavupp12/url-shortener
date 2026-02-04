import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

;export const metadata: Metadata = {
  metadataBase: new URL('https://minifylinks.com'), 
  alternates: {
    canonical: './', 
  },
  title: {
    default: "MinifyLinks - Free URL Shortener",
    template: "%s | MinifyLinks",
  },
  description: "Simplify your links, amplify your reach. A powerful, free tool to shrink long links.",
  keywords: ["url shortener", "link shortener", "free url shortener"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://minifylinks.com",
    siteName: "MinifyLinks",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: '/logos/favicon.ico' },
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/logos/favicon.ico',
    apple: '/logos/apple-touch-icon.png',
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