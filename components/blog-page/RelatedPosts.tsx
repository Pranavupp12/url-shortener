import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedPostsProps {
  currentSlug: string;
  categories: string[];
}

export async function RelatedPosts({ currentSlug, categories }: RelatedPostsProps) {
  // 1. Find up to 3 posts that have ANY of the same categories
  // AND are not the current post.
  const related = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { not: currentSlug }, // Exclude current
      categories: { hasSome: categories }, // Match category
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: { title: true, slug: true, image: true, publishedAt: true }
  });

  if (related.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 text-md sm:text-lg border-b pb-2">Related Articles</h3>
      <div className="flex flex-col gap-6">
        {related.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
            {/* Small Thumbnail */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {post.image ? (
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            
            {/* Title & Date */}
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <span className="text-xs text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}