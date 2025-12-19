import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isEmailLink, completeEmailLinkSignIn, getFirebaseAuth } from "@/lib/firebase";
import { useCollege } from "@/features/college";

export function VerifyEmailRoute() {
  const navigate = useNavigate();
  const { collegeSlug: detectedCollegeSlug } = useCollege();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verifyEmailLink = async () => {
      // Check if this is a sign-in link
      if (!isEmailLink()) {
        setStatus("error");
        setError("Invalid sign-in link");
        return;
      }

      // Get email from localStorage (same device)
      let email = window.localStorage.getItem('emailForSignIn');
      // Get college saved when link was requested (if present)
      const storedCollege = window.localStorage.getItem('collegeForSignIn');

      // Prefer stored college (same device). Fallback to detected college from context
      const usedCollegeSlug = storedCollege || detectedCollegeSlug || null;

      // If not found, ask user to enter it
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        if (!email) {
          setStatus("error");
          setError("Email is required to complete sign-in");
          return;
        }
      }

      try {
        // Complete the sign-in
        const userCredential = await completeEmailLinkSignIn(email);

        // Validate email domain still matches the college stored/selected
        try {
          const domainValidation = await import("@/lib/email-validation");
          const validation = domainValidation.validateEmailForCollege(
            userCredential.user.email || email,
            usedCollegeSlug
          );
          if (!validation.isValid) {
            throw new Error(validation.error || "Email domain does not match selected college");
          }
        } catch (vErr) {
          console.error("[auth] College domain validation failed after link click", vErr);
          setStatus("error");
          setError("Email domain does not match the selected college. Contact support.");
          return;
        }

        // Notify backend to create/update user record (pass ID token)
        try {
          const auth = getFirebaseAuth();
          const idToken = auth && auth.currentUser ? await auth.currentUser.getIdToken() : null;

          if (!idToken) {
            throw new Error("Missing ID token after sign-in");
          }

          const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
          const res = await fetch(`${apiBase}/api/auth/on-verify`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ collegeSlug: usedCollegeSlug }),
          });

          if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            throw new Error(payload.error || `Server returned ${res.status}`);
          }

          console.log("[auth] Backend on-verify successful");
          setStatus("success");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 2000);
        } catch (netErr) {
          console.error("[auth] Backend on-verify failed", netErr);
          setStatus("error");
          if (netErr instanceof Error) setError(netErr.message);
          else setError("Failed to register user on server");
          return;
        }
      } catch (err) {
        console.error("[auth] Email link sign-in failed", err);
        setStatus("error");
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to verify sign-in link. It may have expired.");
        }
      }
    };

    verifyEmailLink();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative">
        <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
        <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
        <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
          {status === "loading" && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h1 className="mt-6 text-2xl font-bold">Verifying your link...</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we sign you in.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Success!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                You've been signed in successfully. Redirecting to your dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Verification failed</h1>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button onClick={() => navigate("/auth/email-link")} className="w-full">
                  Request new link
                </Button>
                <Button onClick={() => navigate("/auth/login")} variant="outline" className="w-full">
                  Sign in with password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
