'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LinkIcon, Users, TrendingUp, Plus,
  Loader2, ShieldCheck, Clock, Link2,
  AlertTriangle, Siren, X, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Dashboard() {
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, totalAdClicks: 0 })
  const [clickTrends, setClickTrends] = useState<{ date: string, dayName: string, clicks: number }[]>([])

  const [adUrl, setAdUrl] = useState("")
  const [currentSavedUrl, setCurrentSavedUrl] = useState("")
  const [recentAdClicks, setRecentAdClicks] = useState([])
  const [deviceStats, setDeviceStats] = useState([])

  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 })

  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [anomalyDetected, setAnomalyDetected] = useState<{ type: string, diff: number } | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/ad-settings')
        if (res.ok) {
          const data = await res.json()
          setAdUrl(data.url)
          setCurrentSavedUrl(data.url)
        }
      } catch (e) { console.error("Config load failed") }
    }
    fetchConfig()
  }, [])

  const fetchUrlSpecificData = useCallback(async () => {
    if (!currentSavedUrl) return

    setLoading(true)
    try {
      const encodedUrl = encodeURIComponent(currentSavedUrl)

      const [statsRes, logsRes] = await Promise.all([
        fetch(`/api/admin/stats?url=${encodedUrl}`),
        fetch(`/api/admin/ad-logs?page=${page}&url=${encodedUrl}`)
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
        setClickTrends(statsData.clickTrends || [])
        checkForAnomalies(statsData.clickTrends || [])
      }

      if (logsRes.ok) {
        const data = await logsRes.json()
        setRecentAdClicks(data.logs || [])
        setDeviceStats(data.deviceStats || [])
        setPagination({
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0
        })
      }
    } catch (error) {
      console.error("Data load failed", error)
    } finally {
      setLoading(false)
    }
  }, [currentSavedUrl, page])

  useEffect(() => {
    fetchUrlSpecificData()
  }, [fetchUrlSpecificData])

  const checkForAnomalies = (trends: any[]) => {
    const today = trends[trends.length - 1];
    if (today && today.clicks > 100) {
      setAnomalyDetected({ type: 'spike', diff: 50 });
    }
  }

  const handleUpdateAdLink = async () => {
    if (!adUrl.startsWith('http')) {
      toast.error("Please enter a valid URL")
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/ad-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: adUrl })
      })
      if (res.ok) {
        toast.success("Redirect URL updated")
        setCurrentSavedUrl(adUrl)
      }
    } catch (err) {
      toast.error("Failed to update redirect")
    } finally {
      setIsSaving(false)
    }
  }

  // --- CHART HELPERS ---
  const maxClicks = Math.max(...clickTrends.map(t => t.clicks), 1);
  const yAxisMax = Math.ceil(maxClicks / 10) * 10;
  const yAxisTicks = [yAxisMax, yAxisMax * 0.75, yAxisMax * 0.5, yAxisMax * 0.25, 0];

  if (!currentSavedUrl && loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 bg-white min-h-screen text-slate-900">

      {anomalyDetected && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 shadow-md">
          <Siren className="h-5 w-5 text-red-600 animate-pulse" />
          <div className="flex-1 ml-2">
            <AlertTitle className="text-red-900 font-bold">Anomaly Detected</AlertTitle>
            <AlertDescription className="text-red-800/90 text-xs">High traffic volume detected.</AlertDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setAnomalyDetected(null)}><X className="h-4 w-4" /></Button>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">Monitoring unique visitors and redirect performance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/"><Button variant="outline">View Site</Button></Link>
          <Link href="/admin/blog"><Button className="bg-blue-500 hover:bg-blue-600"><Plus className="w-4 h-4 mr-2" /> New Post</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Assets" value={stats.totalLinks} label="Active Links" icon={<LinkIcon />} />
        <StatCard title="Audience Reach" value={stats.totalClicks} label="Est. Unique Visitors" icon={<Users />} />
        <StatCard title="Current Ad Performance" value={stats.totalAdClicks} label="Unique Redirects (24h)" icon={<TrendingUp />} subLabel={currentSavedUrl} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Settings Card */}
        <Card className="lg:col-span-5 border border-gray-100 shadow-none rounded-xl overflow-hidden flex flex-col bg-white gap-0">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm shadow-blue-100"><ShieldCheck className="w-5 h-5 text-white" /></div>
              <div><CardTitle className="text-lg font-bold">Redirect Logic</CardTitle><CardDescription>Configure "Copy Link" destination.</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 flex-1">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800 uppercase"> caching active</p>
                <p className="text-xs text-amber-700 leading-relaxed">Browsers cache this link for <strong>24h</strong>,advised not to change it before that so that the new link does not loose the ad value.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 group transition-all hover:border-blue-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />Live Target URL
              </div>
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <Link2 className="w-4 h-4 flex-shrink-0" /><span className="truncate">{currentSavedUrl}</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase">New Target URL</label>
              <Input value={adUrl} onChange={(e) => setAdUrl(e.target.value)} placeholder="https://..." />
            </div>
            <Button onClick={handleUpdateAdLink} disabled={isSaving} className="w-full bg-blue-500 hover:bg-blue-600">
              {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Configuration"}
            </Button>
          </CardContent>
        </Card>

        {/* --- CHART SECTION --- */}
        <Card className="lg:col-span-7 border border-gray-100 shadow-none rounded-xl overflow-hidden flex flex-col bg-white gap-0">
          <CardHeader className="bg-white border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div><CardTitle className="text-sm font-bold uppercase">Weekly Traffic</CardTitle><CardDescription className="text-[11px]">Unique sessions (Mon - Sun)</CardDescription></div>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1">
            {/* UPDATED: Changed h-48 to h-full and added min-h-[300px] to fill space */}
            <div className="flex h-full w-full gap-4 min-h-[300px]">

              {/* Y-Axis Column */}
              <div className="flex flex-col justify-between items-end h-full text-[10px] font-bold text-gray-400 pr-2 border-r border-gray-100 min-w-[30px] pb-6">
                {yAxisTicks.map((tick, i) => (
                  <span key={i}>{Math.round(tick)}</span>
                ))}
              </div>

              {/* Chart Bars */}
              <div className="flex-1 flex items-end justify-between gap-2 h-full relative pb-6">
                {/* Background Grid Lines*/}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                  {yAxisTicks.map((tick, i) => (
                    <div
                      key={i}
                      // Logic: If the value is 0, use 'bg-transparent', otherwise use 'bg-gray-400'
                      className={`w-full h-px ${tick === 0 ? 'bg-transparent' : 'bg-gray-400'}`}
                    />
                  ))}
                </div>


                {clickTrends.map((day) => {
                  const heightPercent = (day.clicks / yAxisMax) * 100;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative z-10 h-full justify-end">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                        {day.clicks} Visitors
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600 cursor-help"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: day.clicks > 0 ? '4px' : '2px',
                          opacity: day.clicks > 0 ? 1 : 0.1
                        }}
                      />
                      <div className="text-center absolute -bottom-8 w-full">
                        <span className="block text-[10px] font-bold text-gray-600 uppercase truncate">{day.dayName}</span>
                        <span className="block text-[9px] text-gray-400">{new Date(day.date).getDate()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-none rounded-xl overflow-hidden bg-white gap-0">
        <CardHeader className="border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold">Unique Visitor Log</CardTitle>
              <CardDescription>Filtered logs for: <span className="text-blue-500 font-mono">{currentSavedUrl}</span></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[550px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase pl-6">Timestamp</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">IP Address</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Device</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">Browser</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase">OS</TableHead>
                  <TableHead className="font-bold text-gray-900 text-[10px] py-4 uppercase text-right pr-6">Destination</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAdClicks.length > 0 ? (
                  recentAdClicks.map((log: any) => (
                    <TableRow key={log.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                      <TableCell className="py-4 pl-6"><span className="text-xs font-bold flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue-500" />{new Date(log.createdAt).toLocaleTimeString()}</span></TableCell>
                      <TableCell className="py-4"><span className="text-[11px] font-mono bg-gray-50 px-2 py-1 rounded border">{log.ipAddress}</span></TableCell>
                      <TableCell className="py-4"><span className="text-[10px] font-bold uppercase">{log.device}</span></TableCell>
                      <TableCell className="py-4"><span className="text-[11px] font-medium text-gray-600">{log.browser || "Unknown"}</span></TableCell>
                      <TableCell className="py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{log.os}</span></TableCell>
                      <TableCell className="py-4 text-right pr-6"><div className="flex items-center justify-end gap-2 text-blue-500 text-xs font-bold"><span className="truncate max-w-[200px]">{log.targetUrl}</span><ExternalLink className="w-3 h-3 opacity-40" /></div></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="text-center py-20 text-gray-400 text-sm font-medium italic">No visitors for this Target URL yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Page {page} of {pagination.totalPages} ({pagination.totalCount} events)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="h-8 text-[10px] font-bold uppercase">Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="h-8 text-[10px] font-bold uppercase text-blue-600">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, label, icon, subLabel }: any) {
  return (
    <Card className="border border-gray-100 shadow-none rounded-xl p-6 bg-white hover:border-blue-500 transition-all group cursor-default">
      <div className="flex items-center justify-between">
        <div className="space-y-1 max-w-[80%]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
          <h2 className="text-4xl font-black text-slate-900 leading-none">{value}</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{label}</p>
          {subLabel && <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50"><Link2 className="w-3 h-3 text-blue-500" /><p className="text-[10px] text-blue-500 font-medium truncate italic" title={subLabel}>{subLabel}</p></div>}
        </div>
        <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50">{icon}</div>
      </div>
    </Card>
  )
}