import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-6 pt-24 pb-10 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-2xl mx-auto text-center">
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
        {[...Array(3)].map((_, i) => (
           <div key={i} className="space-y-3">
             <Skeleton className="h-48 w-full rounded-xl" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3" />
           </div>
        ))}
      </div>
    </div>
  )
}