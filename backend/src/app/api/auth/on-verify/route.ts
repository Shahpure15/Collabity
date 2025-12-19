import { NextRequest, NextResponse } from "next/server";
import { extractToken, verifyIdToken, getAdminFirestore } from "@/lib/firebase-admin";
import { validateEmailForCollege } from "@/lib/college-email-domains";
import admin from "firebase-admin";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": FRONTEND_URL,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

/**
 * POST /api/auth/on-verify
 * Protected endpoint: expects Authorization: Bearer <idToken>
 * Verifies token, validates email domain against supplied collegeSlug,
 * then creates/updates a Firestore `users` document with minimal fields.
 */
export async function POST(request: NextRequest) {
  try {
    // Add CORS headers on POST responses as well
    const baseHeaders = corsHeaders();

    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401, headers: baseHeaders });
    }

    const decoded = await verifyIdToken(token);
    const uid = decoded.uid;
    const email = decoded.email;

    if (!uid || !email) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400, headers: baseHeaders });
    }

    const body = await request.json().catch(() => ({}));
    const collegeSlug = body?.collegeSlug || null;

    // Validate email domain server-side
    const validation = validateEmailForCollege(email, collegeSlug);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || "Email domain mismatch" }, { status: 400, headers: baseHeaders });
    }

    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    const now = admin.firestore.FieldValue.serverTimestamp();

    if (!userSnap.exists) {
      await userRef.set({
        email,
        collegeSlug: collegeSlug || "",
        isEmailVerified: true,
        hasPassword: false,
        createdAt: now,
        lastLogin: now,
      });
    } else {
      await userRef.update({
        email,
        ...(collegeSlug ? { collegeSlug } : {}),
        isEmailVerified: true,
        lastLogin: now,
      });
    }

    return NextResponse.json({ ok: true, uid }, { headers: baseHeaders });
  } catch (error) {
    console.error("[API] on-verify failed:", error);
    const headers = corsHeaders();
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers });
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  // Reply to preflight requests
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
