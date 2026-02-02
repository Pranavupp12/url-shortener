import { Skeleton } from "@/components/ui/skeleton"

export default function SingleBlogLoading() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <article className="max-w-3xl mx-auto px-6">
        
        {/* Back Button */}
        <Skeleton className="h-6 w-24 mb-8" />

        {/* Header Info */}
        <div className="space-y-4 text-center mb-10">
          <div className="flex justify-center gap-2 mb-4">
             <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-12 w-3/4 mx-auto" /> {/* Title */}
          <Skeleton className="h-12 w-1/2 mx-auto" /> {/* Title Line 2 */}
          
          <div className="flex items-center justify-center gap-4 mt-6">
             <Skeleton className="h-10 w-10 rounded-full" /> {/* Author Avatar */}
             <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
             </div>
          </div>
        </div>

        {/* Hero Image */}
        <Skeleton className="w-full aspect-video rounded-3xl mb-12" />

        {/* Content Body */}
        <div className="space-y-6 max-w-none">
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-5/6" />
           
           <div className="py-8">
             <Skeleton className="h-8 w-1/3 mb-4" /> {/* Subheading */}
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
           </div>
        </div>

      </article>
    </div>
  )
}