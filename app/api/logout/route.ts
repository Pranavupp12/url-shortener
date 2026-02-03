import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Delete with specific path to ensure it catches the right cookie
  response.cookies.delete({
    name: "admin_token",
    path: "/", 
  });
  
  return response;
}