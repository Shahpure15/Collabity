import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore, extractToken, verifyIdToken } from "@/lib/firebase-admin";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders();

  try {
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401, headers });

    const decoded = await verifyIdToken(token);
    if (decoded.email?.toLowerCase() !== "admin@mitaoe.ac.in") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
    }

    const body = await request.json().catch(() => ({}));
    const { uid, email, redirectUrl } = body || {};

    if (!redirectUrl) {
      return NextResponse.json({ error: "Missing redirectUrl" }, { status: 400, headers });
    }

    if (!uid && !email) {
      return NextResponse.json({ error: "Provide uid or email" }, { status: 400, headers });
    }

    const auth = getAdminAuth();
    let targetUid = uid;
    if (!targetUid && email) {
      const userRecord = await auth.getUserByEmail(email).catch(() => null);
      if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404, headers });
      }
      targetUid = userRecord.uid;
    }

    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(targetUid as string);
    await userRef.set({ redirectUrl }, { merge: true });

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("[admin] set-redirect failed:", error);
    return NextResponse.json({ error: "Failed to set redirect" }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
