import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/lib/firebase";
import { useAuth } from "@/features/auth/auth-context";
import { verifyToken } from "@/lib/api";
import { getUserProfile } from "@/lib/user-service";
import { createUserProfile } from "@/lib/user-service";
import { useCollege } from "@/features/college";
import { validateEmailForCollege } from "@/lib/email-validation";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginRoute() {
  const navigate = useNavigate();  const { collegeSlug } = useCollege();  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = form.handleSubmit(async (values) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      // Admin shortcut: username 'admin' and password 'Adminmax'
      // Validate email domain for college
      const emailValidation = validateEmailForCollege(values.email, collegeSlug);
      if (!emailValidation.isValid) {
        setAuthError(emailValidation.error || "Invalid email for this institution");
        setIsSubmitting(false);
        return;
      }

      const userCredential = await signInWithEmail(values.email, values.password);
      
      // Ensure user profile exists in Firestore
      await createUserProfile(userCredential.user.uid, {
        email: userCredential.user.email!,
        name: userCredential.user.displayName || undefined,
        photoURL: userCredential.user.photoURL || undefined,
        collegeSlug: collegeSlug || undefined,
      });
      
      // Verify token with backend
      try {
        await verifyToken();
        console.log("[auth] Backend verification successful");
      } catch (backendError) {
        console.warn("[auth] Backend verification failed:", backendError);
        // Continue anyway - frontend auth succeeded
      }
      // After login, check if user has a redirectUrl set in profile
      try {
        const profile = await getUserProfile(userCredential.user.uid);
        const redirectUrl = profile?.redirectUrl;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      } catch (err) {
        // ignore
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("[auth] login failed", error);
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Unable to sign in. Check your credentials or try another method.");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  // Google sign-in removed to enforce college email-only authentication

  return (
    <div className="relative">
      <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
      <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
      <div className="relative z-10 space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
            login
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Access your profile and explore available opportunities.
            </p>
          </div>
        </header>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              placeholder="you@college.edu"
              type="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link className="text-muted-foreground underline hover:text-primary" to="/auth/reset">
              Forgot password?
            </Link>
              <span className="text-muted-foreground">
                New here? Use the <Link className="text-primary" to="/auth/email-link">Email link</Link> option to sign in.
              </span>
          </div>
          {authError && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{authError}</p>}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
        <div className="space-y-3">
          <div className="relative text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="bg-white px-4 dark:bg-transparent">or</span>
            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>
          <div className="grid gap-3 sm:grid-cols-1">
            <Link to="/auth/email-link" className="w-full">
              <Button
                className="w-full"
                disabled={isSubmitting}
                type="button"
                variant="outline"
              >
                Email Link
              </Button>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/60 p-4 text-sm text-muted-foreground shadow-inner dark:border-white/10 dark:bg-slate-900/70">
          💡 <strong>New here?</strong> Create an account or sign in with Google to get started!
        </div>
      </div>
    </div>
  );
}

// Google sign-in removed to enforce college email only flow
