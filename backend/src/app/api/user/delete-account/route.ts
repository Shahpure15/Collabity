import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore, extractToken, verifyIdToken } from "@/lib/firebase-admin";

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
    const uid = decoded.uid;

    // Delete from Firebase Auth
    const auth = getAdminAuth();
    await auth.deleteUser(uid);

    // Delete Firestore profile
    const db = getAdminFirestore();
    await db.collection("users").doc(uid).delete();

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("[API] Failed to delete own account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500, headers }
    );
  }
}
