import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // 1. Extract Pagination & Filter Parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const targetUrl = searchParams.get('url'); // <--- NEW: Get the filter URL
    
    const limit = 10;
    const skip = (page - 1) * limit;

    // 2. Define Filter Condition
    const whereCondition = targetUrl ? { targetUrl: targetUrl } : {};

    // 3. Fetch Data in Parallel
    const [logs, totalCount, urlStats, deviceStats] = await Promise.all([
      // Paginated Logs (Filtered)
      prisma.adBounceLog.findMany({
        where: whereCondition, // <--- APPLIED FILTER
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      }),
      // Total count (Filtered - needed for correct page numbers)
      prisma.adBounceLog.count({
        where: whereCondition // <--- APPLIED FILTER
      }),
      // Global URL Stats (Usually kept global so you can see other top links)
      prisma.adBounceLog.groupBy({
        by: ['targetUrl'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),
      // Device Stats (Filtered - specific to this URL)
      prisma.adBounceLog.groupBy({
        by: ['device'],
        where: whereCondition, // <--- APPLIED FILTER
        _count: { id: true },
      })
    ]);

    return NextResponse.json({ 
      logs,
      urlStats,
      deviceStats,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Ad log fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}