import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import type { Metadata } from 'next'
import { RelatedPosts } from '@/components/blog-page/RelatedPosts' 
import { ShareWidget } from '@/components/blog-page/ShareWidget'

// --- TYPE DEFINITION ---
type Props = {
  params: Promise<{ slug: string }>
}

// --- 1. DYNAMIC METADATA & OPEN GRAPH ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  const post = await prisma.blogPost.findUnique({
    where: { slug: slug }
  })

  if (!post) return { title: 'Article Not Found' }

  const ogImage = post.image || '/images/og-default.jpg'; // Fallback image

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords?.split(',').map(k => k.trim()) || [],
    authors: [{ name: 'SwiftLink Team' }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'SwiftLink',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [ogImage],
    },
  }
}

export const revalidate = 60; 

// --- 2. MAIN PAGE COMPONENT ---
export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug: slug }
  })

  if (!post || !post.isPublished) {
    notFound()
  }

  // Calculate Read Time (Simple estimation)
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // --- 3. JSON-LD SCHEMA (Google Rich Results) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.image ? [post.image] : [],
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'SwiftLink Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SwiftLink',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png', // Replace with your real logo URL
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yourdomain.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white py-20  px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="bg-white border-none">
          <div className="container mx-auto max-w-5xl">
             
             {/* 1. Back Button (Ghost Variant - Top Left) */}
             <div className="flex justify-start mb-5 sm:mb-10">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-500  px-3 py-2 rounded-lg transition-all duration-200 -ml-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                </Link>
             </div>

             {/* 2. Hero Content (Centered) */}
             <div className="text-center space-y-6">

                {/* Categories (Pills Style) */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {post.categories && post.categories.length > 0 && post.categories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-xs sm:text-sm">
                      {cat}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className=" text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight max-w-4xl mx-auto">
                  {post.title}
                </h1>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-xs sm:text-sm font-medium pt-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      MinifyLinks Team
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      {new Date(post.publishedAt).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      {readTime} min read
                    </div>
                </div>
             </div>

          </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="container mx-auto px-4 max-w-6xl mt-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Content (8 cols) */}
          <div className="lg:col-span-8">
             
             {/* Main Image */}
             {post.image && (
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg mb-10">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>
             )}

             {/* Content Body */}
             <div 
               className="prose prose-lg prose-blue max-w-none 
                          prose-headings:font-bold prose-headings:text-gray-900 
                          prose-p:text-gray-600 prose-p:leading-relaxed 
                          prose-a:text-blue-600 prose-img:rounded-xl"
               dangerouslySetInnerHTML={{ __html: post.content }}
             />
             
             {/* Tags Footer */}
             {(post.focusKeyword || post.metaKeywords) && (
               <div className="mt-8 sm:mt-12 pt-8 border-t border-gray-100">
                  <h4 className=" text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                     {post.focusKeyword && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600  text-xs sm:text-sm rounded-md font-medium">#{post.focusKeyword}</span>
                     )}
                     {post.metaKeywords?.split(',').map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-md">
                          #{tag.trim()}
                        </span>
                     ))}
                  </div>
               </div>
             )}
          </div>

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-10">
             
             {/* Sticky Wrapper */}
             <div className="sticky top-24 space-y-10">
                
                {/* Share Widget */}
                <ShareWidget title={post.title} slug={post.slug} />

                {/* Related Posts Component (Server Component) */}
                <RelatedPosts currentSlug={post.slug} categories={post.categories} />

             </div>
          </aside>

        </div>

      </article>
    </>
  )
}