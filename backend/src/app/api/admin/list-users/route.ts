import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore, extractToken, verifyIdToken } from "@/lib/firebase-admin";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders();

  try {
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401, headers });

    const decoded = await verifyIdToken(token);
    if (decoded.email?.toLowerCase() !== "admin@mitaoe.ac.in") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
    }

    const auth = getAdminAuth();
    const listUsersResult = await auth.listUsers(1000); // Max 1000 users per page

    const db = getAdminFirestore();
    
    const users = await Promise.all(
      listUsersResult.users.map(async (userRecord) => {
        // Get verification status from Firestore
        const userDoc = await db.collection("users").doc(userRecord.uid).get();
        const userData = userDoc.data();

        return {
          uid: userRecord.uid,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
          disabled: userRecord.disabled,
          verified: userData?.verified || false,
          metadata: {
            creationTime: userRecord.metadata.creationTime,
            lastSignInTime: userRecord.metadata.lastSignInTime,
          },
        };
      })
    );

    return NextResponse.json({ users }, { headers });
  } catch (error) {
    console.error("[API] Failed to list users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500, headers }
    );
  }
}
