import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BlogSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 min-h-screen">

      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 bg-slate-200" /> {/* Title */}
          <Skeleton className="h-4 w-96 bg-slate-100" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-11 w-40 rounded-lg bg-blue-100/50" /> {/* Create Button */}
      </div>

      {/* 2. Table Card */}
      <Card className="border border-gray-100 shadow-none rounded-xl overflow-hidden bg-white">
        <CardHeader className="border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg bg-blue-100/50" /> {/* Icon */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 bg-slate-200" /> {/* Title */}
              <Skeleton className="h-3 w-32 bg-slate-100" /> {/* Count */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0 divide-y divide-gray-50">
            
            {/* Table Header Simulation */}
            <div className="bg-gray-50/50 p-4 flex justify-between items-center border-b border-gray-100">
               <div className="flex gap-12">
                 <Skeleton className="h-3 w-16 bg-slate-200" />
                 <Skeleton className="h-3 w-24 bg-slate-200" />
                 <Skeleton className="h-3 w-20 bg-slate-200" />
               </div>
               <Skeleton className="h-3 w-16 bg-slate-200" />
            </div>

            {/* Table Rows Loop */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 pl-6">
                <div className="flex items-center gap-6">
                  {/* Image Thumbnail */}
                  <Skeleton className="h-10 w-16 rounded-lg bg-slate-200" />
                  
                  {/* Title & Date */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48 md:w-80 bg-slate-200" />
                    <div className="flex items-center gap-2">
                       <Skeleton className="h-3 w-3 rounded-full" />
                       <Skeleton className="h-3 w-24 bg-slate-100" />
                    </div>
                  </div>
                  
                  {/* Status Badge (Hidden on small screens usually, but kept for structure) */}
                  <div className="hidden md:block">
                    <Skeleton className="h-5 w-20 rounded-full bg-green-50" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pr-6">
                  <Skeleton className="h-8 w-8 rounded-md bg-slate-100" />
                  <Skeleton className="h-8 w-8 rounded-md bg-slate-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
             <Skeleton className="h-3 w-32 bg-slate-200" />
             <div className="flex gap-2">
                <Skeleton className="h-8 w-20 bg-slate-100" />
                <Skeleton className="h-8 w-20 bg-slate-100" />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}