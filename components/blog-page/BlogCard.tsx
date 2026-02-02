import Link from 'next/link'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ArrowUpRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { BlogPost } from "@/types/blog" // <--- Import the type

interface BlogCardProps {
  post: BlogPost // <--- Use the type here
  className?: string
  priority?: boolean;
}

export function BlogCard({ post, className,priority = false }: BlogCardProps) {
  return (
    <div className={cn("group flex flex-col gap-4 mb-8", className)}>
      {/* Image Container with Zoom Effect */}
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl bg-gray-100 relative aspect-[16/9] shadow-sm group-hover:shadow-md transition-all">
         {post.image ? (
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
         ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
               <span className="font-bold text-3xl opacity-20">No Image</span>
            </div>
         )}
         
         {/* Overlay Icon */}
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-black" />
         </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2">
        {/* Categories & Date Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
           <div className="flex flex-wrap gap-2">
             {post.categories && post.categories.length > 0 ? (
               post.categories.slice(0, 2).map((cat, idx) => (
                 <Badge key={idx} variant="secondary" className="font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md px-2 py-0.5">
                   {cat}
                 </Badge>
               ))
             ) : (
               <span className="text-gray-400 italic">Uncategorized</span>
             )}
           </div>
           <div className="flex items-center opacity-70">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', year: 'numeric' 
              })}
           </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {post.excerpt || "Click to read full article..."}
        </p>
      </div>
    </div>
  )
}