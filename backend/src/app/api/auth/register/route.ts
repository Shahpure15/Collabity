import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase-admin";
import { validateEmailForCollege } from "@/lib/college-email-domains";
import admin from "firebase-admin";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": FRONTEND_URL,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function POST(request: NextRequest) {
  const baseHeaders = corsHeaders();

  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email || "").toString().trim().toLowerCase();
    const password = (body?.password || "").toString();
    const collegeSlug = body?.collegeSlug || null;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400, headers: baseHeaders });
    }

    // Validate domain server-side
    const validation = validateEmailForCollege(email, collegeSlug);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || "Email domain mismatch" }, { status: 400, headers: baseHeaders });
    }

    const auth = getAdminAuth();
    // Create Firebase Auth user
    let userRecord;
    try {
      userRecord = await auth.createUser({ email, password });
    } catch (err: any) {
      // Email already exists
      if (err?.code === "auth/email-already-exists") {
        return NextResponse.json({ error: "Email already exists" }, { status: 400, headers: baseHeaders });
      }
      console.error("[API] createUser error:", err);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500, headers: baseHeaders });
    }

    const uid = userRecord.uid;
    const db = getAdminFirestore();
    const userRef = db.collection("users").doc(uid);
    const now = admin.firestore.FieldValue.serverTimestamp();

    await userRef.set({
      email,
      collegeSlug: collegeSlug || "",
      preVerified: true,
      isEmailVerified: false,
      hasPassword: true,
      createdAt: now,
      lastLogin: now,
    });

    return NextResponse.json({ ok: true, uid }, { headers: baseHeaders });
  } catch (error) {
    console.error("[API] register failed:", error);
    const headers = corsHeaders();
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
