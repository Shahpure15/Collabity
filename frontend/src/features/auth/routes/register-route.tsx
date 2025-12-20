import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithEmail, signInWithEmail, getFirebaseAuth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-service";
import { useCollege } from "@/features/college";
import { validateEmailForCollege, getAllowedEmailDomainsText } from "@/lib/email-validation";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name should be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterRoute() {
  const navigate = useNavigate();

  const { collegeSlug } = useCollege();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    try {
      const validation = validateEmailForCollege(data.email, collegeSlug);
      if (!validation.isValid) {
        setError("email", { type: "manual", message: validation.error });
        setLoading(false);
        return;
      }

      // Create account client-side using Firebase Auth (no backend fetch)
      await registerWithEmail(data.email, data.password);

      // Sign in using client SDK (registerWithEmail usually signs in automatically, but ensure)
      try {
        await signInWithEmail(data.email, data.password);
      } catch (_) {
        // ignore - user may already be signed in
      }

      const currentUser = getFirebaseAuth()?.currentUser;
      if (currentUser) {
        await createUserProfile(currentUser.uid, { email: data.email, name: data.name, collegeSlug });
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("[auth] Registration failed", err);
      if (err instanceof Error) {
        setError("email", { type: "server", message: err.message });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative">
        <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field label="Full name" name="name">
              <Input {...register("name")} id="name" />
            </Field>

            <Field label={`Email (${getAllowedEmailDomainsText()})`} name="email">
              <Input {...register("email")} id="email" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </Field>

            <Field label="Password" name="password">
              <Input {...register("password")} id="password" type="password" />
            </Field>

            <Field label="Confirm password" name="confirmPassword">
              <Input {...register("confirmPassword")} id="confirmPassword" type="password" />
            </Field>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create account"}
            </Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link className="text-primary underline" to="/auth/login">Log in</Link>
                </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  children,
  label,
  name,
}: {
  children: React.ReactNode;
  label: string;
  name: string;
}) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Google sign-in removed to enforce college email only flow
