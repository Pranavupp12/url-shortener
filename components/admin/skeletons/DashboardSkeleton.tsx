import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" /> {/* Button 1 */}
          <Skeleton className="h-10 w-32" /> {/* Button 2 */}
        </div>
      </div>

      {/* 2. Stats Grid (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-100 shadow-none p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" /> {/* Label */}
                <Skeleton className="h-8 w-16" /> {/* Value */}
                <Skeleton className="h-2 w-24" /> {/* Subtext */}
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" /> {/* Icon Box */}
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Main Content Grid (Settings + Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Settings Card (5 cols) */}
        <Card className="lg:col-span-5 border border-gray-100 shadow-none">
          <CardHeader className="border-b border-gray-100 pb-4">
             <div className="flex items-center gap-3">
               <Skeleton className="h-8 w-8 rounded-lg" />
               <div className="space-y-2">
                 <Skeleton className="h-5 w-32" />
                 <Skeleton className="h-3 w-48" />
               </div>
             </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-24 w-full rounded-lg" /> {/* Alert Box */}
            <Skeleton className="h-12 w-full rounded-lg" /> {/* Current URL */}
            <div className="space-y-3">
               <Skeleton className="h-3 w-20" /> 
               <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Button */}
          </CardContent>
        </Card>

        {/* Right: Chart Card (7 cols) */}
        <Card className="lg:col-span-7 border border-gray-100 shadow-none">
          <CardHeader className="border-b border-gray-100 pb-4">
             <div className="flex justify-between">
               <div className="space-y-2">
                 <Skeleton className="h-4 w-32" />
                 <Skeleton className="h-3 w-24" />
               </div>
               <Skeleton className="h-4 w-4" />
             </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px] flex items-end gap-4">
             {/* Fake Chart Bars */}
             {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${Math.random() * 80 + 10}%` }} />
             ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Table Area */}
      <Card className="border border-gray-100 shadow-none">
        <CardHeader className="border-b border-gray-100 pb-4">
           <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-0">
           <div className="space-y-0 divide-y divide-gray-100">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="flex items-center justify-between p-4">
                 <div className="flex gap-4">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-4 w-32" />
                 </div>
                 <div className="flex gap-4">
                   <Skeleton className="h-4 w-16" />
                   <Skeleton className="h-4 w-20" />
                 </div>
               </div>
             ))}
           </div>
        </CardContent>
      </Card>

    </div>
  )
}