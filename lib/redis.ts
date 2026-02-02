import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function checkRateLimit(ip: string) {
  const key = `rate:${ip}`
  const count = await redis.incr(key)
  
  // If first request of the day, set expiry to 24 hours (86400 seconds)
  if (count === 1) {
    await redis.expire(key, 86400)
  }
  
  return count
}