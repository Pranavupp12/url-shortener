import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url');

    // --- NEW DATE LOGIC: Current Week (Monday - Sunday) ---
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
    // Calculate distance to previous Monday (if today is Sunday (0), go back 6 days)
    const distanceToMonday = (dayOfWeek + 6) % 7; 
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Filter Logic
    const trendFilter: any = {
      createdAt: { gte: startOfWeek }
    };
    if (targetUrl) trendFilter.targetUrl = targetUrl;

    const totalCountFilter: any = {};
    if (targetUrl) totalCountFilter.targetUrl = targetUrl;

    const [totalLinks, clicksAggregate, totalAdClicks, dailyStats] = await Promise.all([
      prisma.shortLink.count(),
      prisma.shortLink.aggregate({ _sum: { clicks: true } }),
      prisma.adBounceLog.count({ where: totalCountFilter }),
      prisma.adBounceLog.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: trendFilter,
      })
    ]);

    // Process dailyStats into a Map
    const chartDataMap: Record<string, number> = {};
    dailyStats.forEach(stat => {
      const date = stat.createdAt.toISOString().split('T')[0];
      chartDataMap[date] = (chartDataMap[date] || 0) + stat._count.id;
    });

    // --- Generate Monday-Sunday Array ---
    const currentWeekData = [];
    // Loop 0 to 6 (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        currentWeekData.push({
            date: dateStr,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
            clicks: chartDataMap[dateStr] || 0
        });
    }

    return NextResponse.json({
      totalLinks,
      totalClicks: clicksAggregate._sum.clicks || 0,
      totalAdClicks,
      clickTrends: currentWeekData
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}