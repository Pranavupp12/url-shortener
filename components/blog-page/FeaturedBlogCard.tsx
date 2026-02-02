import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, User, ImageIcon } from "lucide-react";
import { BlogPost } from "@/types/blog"; 

export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      
      <article className="relative flex flex-col bg-white  overflow-hidden border-none border-gray-100 p-3">
        
        {/* --- Image Area --- */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-50 rounded-2xl">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
              <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
              <span className="text-sm font-bold opacity-20 uppercase">No Cover Image</span>
            </div>
          )}
          
          {/* 1. "Featured" Badge (Kept as layout anchor) */}
          <div className="absolute top-4 left-4">
             <Badge className="bg-white/90 text-blue-600 hover:bg-white backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
               Featured
             </Badge>
          </div>

          {/* 2. NEW: Hover Overlay Icon (From BlogCard) */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-black" />
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className="flex flex-col py-6 space-y-4">
          
          {/* 3. NEW: Category Badges (From BlogCard) */}
          <div className="flex flex-wrap gap-2">
             {post.categories && post.categories.length > 0 ? (
               post.categories.slice(0, 3).map((cat, idx) => (
                 <Badge key={idx} variant="secondary" className="font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md px-2 py-0.5">
                   {cat}
                 </Badge>
               ))
             ) : (
               <span className="text-gray-400 italic text-sm">Uncategorized</span>
             )}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-gray-500 text-md sm:text-lg line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Metadata Footer (Kept Original Layout) */}
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                 <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">MinifyLinks Team</span>
                <span className="text-xs text-gray-400 font-medium">
                   {new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}