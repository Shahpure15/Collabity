import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractToken } from "@/lib/firebase-admin";

/**
 * POST /api/auth/verify
 * Verify a Firebase ID token and return user information
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    // Verify the token
    const decodedToken = await verifyIdToken(token);

    // Return user information
    return NextResponse.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
    });
  } catch (error) {
    console.error("[API] Token verification failed:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Invalid token", details: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
