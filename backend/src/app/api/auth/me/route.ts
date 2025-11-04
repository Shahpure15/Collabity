import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, extractToken, getUserByUid } from "@/lib/firebase-admin";

/**
 * GET /api/auth/me
 * Get the current authenticated user's information
 */
export async function GET(request: NextRequest) {
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

    // Get full user information
    const userRecord = await getUserByUid(decodedToken.uid);

    // Return user information
    return NextResponse.json({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (error) {
    console.error("[API] Failed to get user info:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to get user information", details: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
