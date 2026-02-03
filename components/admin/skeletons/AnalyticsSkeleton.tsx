import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AnalyticsSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* 1. Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 bg-slate-200" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded bg-indigo-50" />
            <Skeleton className="h-4 w-48 bg-slate-100" />
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-100 shadow-none p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 w-[70%]">
                <Skeleton className="h-3 w-24 bg-slate-200" /> {/* Label */}
                <Skeleton className="h-10 w-16 bg-slate-800/10" /> {/* Big Value */}
                <Skeleton className="h-3 w-32 bg-slate-100" /> {/* Subtext */}
              </div>
              <Skeleton className="h-12 w-12 rounded-xl bg-slate-100" /> {/* Icon Box */}
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Asset Table Card */}
      <Card className="border border-gray-100 shadow-none rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg bg-indigo-50" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 bg-slate-200" />
              <Skeleton className="h-3 w-64 bg-slate-100" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          
          {/* Table Header */}
          <div className="bg-gray-50/50 p-4 border-b border-gray-200 flex justify-between">
             <div className="flex gap-8 md:gap-20">
               <Skeleton className="h-3 w-16 bg-slate-300" /> {/* Link */}
               <Skeleton className="h-3 w-20 bg-slate-200" /> {/* Geo */}
               <Skeleton className="h-3 w-20 bg-slate-200" /> {/* Device */}
             </div>
             <Skeleton className="h-3 w-24 bg-slate-200" /> {/* Clicks */}
          </div>

          {/* Table Body */}
          <div className="space-y-0 divide-y divide-gray-50">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 pl-6">
                <div className="flex items-center gap-8 md:gap-20">
                   {/* Link Col */}
                   <Skeleton className="h-4 w-32 bg-indigo-50" />
                   
                   {/* Geo Badge */}
                   <Skeleton className="h-5 w-12 rounded bg-gray-100" />
                   
                   {/* Device Badge */}
                   <Skeleton className="h-5 w-16 rounded bg-blue-50" />
                   
                   {/* Browser Text */}
                   <Skeleton className="hidden md:block h-3 w-20 bg-slate-100" />
                </div>

                {/* Clicks (Right aligned) */}
                <div className="pr-6">
                   <Skeleton className="h-4 w-10 bg-slate-900/10" />
                </div>
              </div>
            ))}
          </div>

           {/* Pagination */}
           <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
             <Skeleton className="h-3 w-40 bg-slate-200" />
             <div className="flex gap-2">
                <Skeleton className="h-8 w-16 bg-slate-100" />
                <Skeleton className="h-8 w-16 bg-slate-100" />
             </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}