import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isEmailLink, completeEmailLinkSignIn } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-service";

export function VerifyEmailRoute() {
  const navigate = useNavigate();
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
        
        // Create/update user profile
        await createUserProfile(userCredential.user.uid, {
          email: userCredential.user.email!,
          name: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
        });

        console.log("[auth] Email link sign-in successful");
        setStatus("success");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
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
