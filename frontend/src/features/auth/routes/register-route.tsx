import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithEmail, signInWithGoogle } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-service";
import { useCollege } from "@/features/college";

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const userCredential = await registerWithEmail(values.email, values.password);
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        email: values.email,
        name: values.name,
        collegeSlug: collegeSlug || undefined,
      });
      
      console.log("[auth] User profile created successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("[auth] registration failed", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to create account right now. Try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleGoogle = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithGoogle();
      
      if (userCredential) {
        // Create/update user profile in Firestore
        await createUserProfile(userCredential.user.uid, {
          email: userCredential.user.email!,
          name: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
          collegeSlug: collegeSlug || undefined,
        });
      }
      
      console.log("[auth] Google sign-up successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("[auth] google register failed", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to sign in with Google right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
      <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
      <div className="relative z-10 space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
            register
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Build your profile to discover internships and academic projects.
            </p>
          </div>
        </header>
        <form className="space-y-5" onSubmit={handleRegister}>
          <Field label="Full name" name="name">
            <Input placeholder="Aarav Gupta" {...form.register("name")} />
          </Field>
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
          <Field label="Email" name="email">
            <Input placeholder="you@college.edu" type="email" {...form.register("email")} />
          </Field>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
          <Field label="Password" name="password">
            <Input type="password" {...form.register("password")} />
          </Field>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
          <Field label="Confirm password" name="confirmPassword">
            <Input type="password" {...form.register("confirmPassword")} />
          </Field>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
          <div className="text-sm text-muted-foreground">
            By creating an account you agree to our <Link className="text-primary" to="/terms">Terms</Link> and
            <Link className="text-primary" to="/privacy"> Privacy Policy</Link>.
          </div>
          {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        <div className="space-y-4">
          <div className="relative text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="bg-white px-4 dark:bg-transparent">or</span>
            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>
          <Button className="w-full" disabled={isSubmitting} onClick={handleGoogle} type="button" variant="outline">
            <GoogleSymbol className="mr-2 h-4 w-4" /> Continue with Google
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link className="text-primary" to="/auth/login">Log in</Link>
        </p>
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

function GoogleSymbol({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.6h8.4c-.36 2.04-2.28 5.88-8.4 5.88a7.8 7.8 0 1 1 0-15.6c2.28 0 3.84.96 4.74 1.8l3.24-3.24C18.84.96 15.96 0 12 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.96 0 12-4.86 12-11.7 0-.78-.12-1.26-.24-1.8H12Z" />
    </svg>
  );
}
