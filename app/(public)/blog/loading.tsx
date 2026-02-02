import { Skeleton } from "@/components/ui/skeleton"

export default function BlogListLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 px-6">
      
      {/* 1. Header Area */}
      <div className="sm:mb-10 text-center max-w-2xl mx-auto space-y-4">
         <Skeleton className="h-4 w-24 mx-auto" />
         <Skeleton className="h-12 w-3/4 mx-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10 sm:pb-20 flex flex-col lg:flex-row gap-12">
        
        {/* 2. Sidebar Skeleton (Hidden on mobile to match responsive logic) */}
        <div className="hidden lg:block w-64 space-y-6 shrink-0">
           <Skeleton className="h-10 w-full rounded-lg" /> {/* Search */}
           <div className="space-y-3">
             <Skeleton className="h-5 w-20" />
             <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-8 w-16 rounded-full" />)}
             </div>
           </div>
        </div>

        {/* 3. Main Content Area */}
        <div className="flex-1 space-y-10">
          
          {/* Featured Post Skeleton */}
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden bg-gray-100 p-8 flex flex-col justify-end">
             <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          {/* Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    {/* Image */}
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    {/* Meta */}
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {/* Title */}
                    <Skeleton className="h-8 w-full" />
                    {/* Excerpt */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}