import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore, extractToken, verifyIdToken } from "@/lib/firebase-admin";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
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
    const { uid, verified } = body;

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400, headers });
    }

    const db = getAdminFirestore();
    await db.collection("users").doc(uid).set(
      { verified: verified === true },
      { merge: true }
    );

    return NextResponse.json({ ok: true, verified }, { headers });
  } catch (error) {
    console.error("[API] Failed to set verification:", error);
    return NextResponse.json(
      { error: "Failed to set verification status" },
      { status: 500, headers }
    );
  }
}
