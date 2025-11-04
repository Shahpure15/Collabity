import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint to verify the backend is running
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Backend is running",
  });
}
