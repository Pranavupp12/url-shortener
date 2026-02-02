import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetUrl } = await req.json();
    
    // 1. Parse the incoming request using the Next.js helper
    const { device, browser, os } = userAgent(req);
    
    // 2. Extract standard headers
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "unknown";
    const uaString = req.headers.get("user-agent") || "unknown";

    // 3. Save to DB with parsed fields
    await prisma.adBounceLog.create({
      data: { 
        ipAddress: ip,
        userAgent: uaString,
        targetUrl: targetUrl,
        device: device.type === 'mobile' ? 'Mobile' : 'Desktop',
        os: os.name || 'Unknown', 
        browser: browser.name || 'Unknown',
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}