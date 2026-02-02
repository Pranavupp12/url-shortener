import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { userAgent } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // 1. ADMIN PROTECTION
  
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return NextResponse.next()
    const token = req.cookies.get('admin_token')
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
    return NextResponse.next()
  }

  // 2. SHORT LINK LOGIC
  const shortCode = path.split('/')[1]
  const ignoredPaths = ['api', '_next', 'favicon.ico', 'admin', 'result', 'login', '']
  
  if (ignoredPaths.includes(shortCode)) {
    return NextResponse.next()
  }

  try {
    const longUrl = await redis.get<string>(`short:${shortCode}`)

    if (longUrl) {
      // --- SAMPLING LOGIC START ---
      
      // 1. Always increment the simple Redis counter (Cheap & Accurate)
      await redis.incr(`clicks:${shortCode}`)

      // 2. The 10% Rule for Detailed Analytics
      if (Math.random() < 0.1) {
          
          const { device, browser, os } = userAgent(req)
          const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'Unknown'
          const referrer = req.headers.get('referer') || 'Direct'
          let country = (req as any).geo?.country
          let city = (req as any).geo?.city

          if (!country) {
            country = req.headers.get('x-vercel-ip-country') || req.headers.get('x-country') || 'Unknown'
          }
          if (!city) {
            city = req.headers.get('x-vercel-ip-city') || req.headers.get('x-city') || 'Unknown'
          }

          const logData = {
            shortCode,
            timestamp: new Date().toISOString(),
            ip,
            userAgent: req.headers.get('user-agent'),
            referrer,
            country,
            city,
            device: device.type === 'mobile' ? 'Mobile' : 'Desktop',
            browser: browser.name,
            os: os.name
          }

          console.log("📢 MIDDLEWARE: Sampling Click (10%):", shortCode)
          
          await redis.lpush('analytics_queue', JSON.stringify(logData))
      }
      // --- SAMPLING LOGIC END ---
      
      // --- NEW: CACHED REDIRECT (24 HOURS) ---
      const response = NextResponse.redirect(new URL(longUrl))
      
      // max-age=86400 seconds = 24 Hours
      response.headers.set(
        'Cache-Control', 
        'public, max-age=86400, s-maxage=86400, stale-while-revalidate=59'
      )
      
      return response
    }
  } catch (error) {
    console.error("Redis Middleware Error:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}