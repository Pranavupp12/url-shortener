import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    // 1. Get a batch of logs
    const logs = await redis.lrange('analytics_queue', 0, 99)
    
    if (logs.length === 0) {
      return NextResponse.json({ message: 'Nothing to sync' })
    }

    let processedCount = 0
    
    for (const logString of logs) {
      try {
        // Parse the log
        let log;
        if (typeof logString === 'object') {
          log = logString;
        } else if (typeof logString === 'string') {
          if (logString === '[object Object]') continue; 
          log = JSON.parse(logString);
        } else {
          continue;
        }

        const link = await prisma.shortLink.findUnique({
          where: { shortCode: log.shortCode }
        })

        if (link) {
          // A. Store the Detailed Log (Demographics Sample)
          await prisma.clickLog.create({
            data: {
              shortLinkId: link.id,
              ipAddress: log.ip,
              userAgent: log.userAgent,
              referrer: log.referrer,
              country: log.country,
              city: log.city,
              device: log.device,
              os: log.os,          
              browser: log.browser,
            }
          })

          // B. UPDATE CLICK COUNT (THE FIX)
          // Don't guess by adding 10. Fetch the REAL accurate count from Redis.
          const realCount = await redis.get<number>(`clicks:${log.shortCode}`)
          
          if (realCount) {
             await prisma.shortLink.update({
               where: { id: link.id },
               data: { clicks: Number(realCount) } // Sync exact value
             })
          }
          
          processedCount++
        }

      } catch (innerError) {
        console.error("Skipped bad log entry", innerError)
        continue;
      }
    }

    // Remove processed logs from queue
    await redis.ltrim('analytics_queue', logs.length, -1)

    return NextResponse.json({ synced: processedCount })

  } catch (error) {
    console.error("Sync Critical Error:", error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}