import { prisma } from "@/lib/prisma";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const GLOBAL_ID = "65b2f3e4d5c6a7b890123456";

// ADD THIS: Allows the website to fetch the link
export async function GET() {
  try {
    // 1. Try Redis first (Instant)
    let url = await redis.get<string>("ad_redirect_url");

    // 2. Fallback to Prisma if Redis is empty
    if (!url) {
      const settings = await prisma.adminSettings.findUnique({
        where: { id: GLOBAL_ID }
      });
      url = settings?.adRedirectUrl || "https://google.com";
      await redis.set("ad_redirect_url", url);
    }

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ url: "https://google.com" }); // Safe fallback
  }
}

// YOUR EXISTING POST (Correct)
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    await prisma.adminSettings.upsert({
      where: { id: GLOBAL_ID },
      update: { adRedirectUrl: url },
      create: { 
        id: GLOBAL_ID, 
        adRedirectUrl: url 
      }
    });

    await redis.set("ad_redirect_url", url);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}