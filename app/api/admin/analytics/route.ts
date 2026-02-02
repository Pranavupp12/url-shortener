import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    jwt.verify(token, SECRET_KEY)

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const skip = (page - 1) * limit

    // 1. Fetch Raw Groups & Data
    // Removed 'totalLogs' since we don't need to calculate percentages anymore
    const [topCountries, topDevices, topReferrers, allLinksRaw, totalCount] = await Promise.all([
      prisma.clickLog.groupBy({ by: ['country'], _count: { country: true }, orderBy: { _count: { country: 'desc' } }, take: 5 }),
      prisma.clickLog.groupBy({ by: ['device'], _count: { device: true }, orderBy: { _count: { device: 'desc' } }, take: 5 }),
      prisma.clickLog.groupBy({ by: ['referrer'], _count: { referrer: true }, orderBy: { _count: { referrer: 'desc' } }, take: 5 }),
      prisma.shortLink.findMany({ orderBy: { clicks: 'desc' }, include: { logs: true }, skip, take: limit }),
      prisma.shortLink.count(),
    ])

    // 2. Process the Table Data (Top Trends per Link)
    const processedLinks = allLinksRaw.map(link => {
      // Helper: Find the most frequent item in the logs array
      const getTopStat = (field: 'country' | 'device' | 'os' | 'browser') => {
        if (link.logs.length === 0) return 'N/A'
        const counts: Record<string, number> = {}
        link.logs.forEach((log: any) => {
          const val = String(log[field] || 'Unknown')
          counts[val] = (counts[val] || 0) + 1
        })
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
        return top ? top[0] : 'N/A'
      }

      return {
        shortCode: link.shortCode,
        clicks: link.clicks, // This is your REAL total (from Redis incr)
        topCountry: getTopStat('country'),
        topDevice: getTopStat('device'),
        topBrowser: getTopStat('browser')
      }
    })

    // 3. Return Raw Counts (No Percentages)
    return NextResponse.json({
      countries: topCountries.map(c => ({ 
        name: c.country || 'Unknown', 
        count: c._count.country 
      })),
      devices: topDevices.map(d => ({ 
        name: d.device || 'Unknown', 
        count: d._count.device 
      })),
      referrers: topReferrers.map(r => ({ 
        name: r.referrer || 'Direct', 
        count: r._count.referrer 
      })),
      links: processedLinks,
      pagination: { 
        totalCount, 
        totalPages: Math.ceil(totalCount / limit), 
        currentPage: page 
      }
    })
  } catch (error) {
    console.error("Analytics Error:", error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}