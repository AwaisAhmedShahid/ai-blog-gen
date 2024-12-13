import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Extract data from the request body
  const { key, value } = await req.json();

  if (!key || !value) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
  }

  // Create a response and set the cookie
  const response = NextResponse.json({ message: "Cookie set successfully" });

  response.cookies.set(key, value, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day in seconds
  });

  return response;
}
