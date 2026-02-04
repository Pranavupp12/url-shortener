'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Loader2, Globe, Smartphone, ArrowUpRight, 
  Link as LinkIcon 
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AnalyticsSkeleton } from './skeletons/AnalyticsSkeleton'

export default function AnalyticsView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // STATE: Tracks current page
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        await fetch('/api/admin/sync', { method: 'POST' })
        
        // FETCH: Sends the current page number to your server
        const res = await fetch(`/api/admin/analytics?page=${page}`)
        
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch (error) { console.error("Failed to load analytics") } 
      finally { setLoading(false) }
    }
    loadData()
  }, [page]) 

 if (!data && loading) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-white min-h-screen text-slate-900">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Audience Insights</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
             <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Raw Sample Data</span>
             <span>Showing actual captured logs (10% sample)</span>
          </div>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStatCard 
          title="Top Location" 
          icon={<Globe className="h-5 w-5" />} 
          items={data?.countries} 
          fallback="Unknown"
        />
        <AnalyticsStatCard 
          title="Top Device" 
          icon={<Smartphone className="h-5 w-5" />} 
          items={data?.devices} 
          fallback="Desktop"
        />
        <AnalyticsStatCard 
          title="Top Source" 
          icon={<ArrowUpRight className="h-5 w-5" />} 
          items={data?.referrers} 
          fallback="Direct"
        />
      </div>

      {/* --- ASSET PERFORMANCE TABLE --- */}
      <Card className="border border-gray-100 overflow-hidden bg-white gap-0">
        <CardHeader className="bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg shadow-sm shadow-indigo-100">
              <LinkIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Asset Performance</CardTitle>
              <CardDescription>Accurate counts of unique visitors (24h cache).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          
          {/* Opacity Overlay when loading new page */}
          <div className="relative">
             {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500"/></div>}
             
             <Table>
              <TableHeader className="bg-gray-50/50 backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase pl-6">Link</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Dominant Geo</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Dominant Device</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Dominant Browser</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Dominant OS</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase text-right pr-6">Unique Clicks (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.links?.map((link: any) => (
                  <TableRow key={link.shortCode} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <span className="text-sm font-bold text-indigo-600">/{link.shortCode}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{link.topCountry || 'Unknown'}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{link.topDevice || 'Unknown'}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[11px] font-medium text-gray-600">{link.topBrowser || 'Unknown'}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {/* ADDED OS COLUMN */}
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold uppercase">
                        {link.topOS || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <span className="text-sm font-black text-gray-900">{link.clicks}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          {data?.pagination?.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Page {page} of {data.pagination.totalPages} ({data.pagination.totalCount} assets)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8 text-[10px] font-bold uppercase border-gray-200 hover:bg-white transition-colors"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8 text-[10px] font-bold uppercase border-gray-200 text-blue-600 hover:bg-white transition-colors"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- STAT CARD COMPONENT (Matched to DashboardView) ---
function AnalyticsStatCard({ title, icon, items, fallback }: any) {
  const topItem = items && items.length > 0 ? items[0] : null;
  const value = topItem ? topItem.count : 0;
  const label = topItem ? (topItem.name || topItem.country || topItem.device || topItem.referrer) : fallback;

  return (
    <Card className="border border-gray-100 shadow-none rounded-xl p-6 bg-white hover:border-blue-500 transition-all group cursor-default">
      <div className="flex items-center justify-between">
        <div className="space-y-1 max-w-[80%]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
          <h2 className="text-4xl font-black text-slate-900 leading-none mt-2">{value}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 truncate">
            Most active: <span className="text-blue-600">{label}</span>
          </p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
      </div>
    </Card>
  )
}