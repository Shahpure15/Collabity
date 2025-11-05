import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendSignInLink } from "@/lib/firebase";

const emailLinkSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type EmailLinkFormValues = z.infer<typeof emailLinkSchema>;

export function EmailLinkRoute() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmailLinkFormValues>({
    resolver: zodResolver(emailLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendLink = form.handleSubmit(async (values) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await sendSignInLink(values.email);
      setSuccess(true);
      console.log("[auth] Sign-in link sent successfully");
    } catch (err) {
      console.error("[auth] Failed to send sign-in link", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to send sign-in link. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  if (success) {
    return (
      <div className="relative">
        <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
        <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
        <div className="relative z-10 space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold">Check your email!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent a sign-in link to <strong>{form.getValues("email")}</strong>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Click the link in the email to sign in. The link will expire in 1 hour.
            </p>
            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Open the link on the same device for the best experience.
              </p>
            </div>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setSuccess(false);
                form.reset();
              }}
            >
              Send another link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
      <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
      <div className="relative z-10 space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
            passwordless
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display">Sign in with email link</h1>
            <p className="text-sm text-muted-foreground">
              No password needed. We'll send you a secure link to sign in instantly.
            </p>
          </div>
        </header>
        <form className="space-y-5" onSubmit={handleSendLink}>
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
          {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending link
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send sign-in link
              </>
            )}
          </Button>
        </form>
        <div className="space-y-4">
          <div className="relative text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="bg-white px-4 dark:bg-transparent">or</span>
            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <Link className="text-muted-foreground underline hover:text-primary" to="/auth/login">
              Sign in with password
            </Link>
            <Link className="text-muted-foreground underline hover:text-primary" to="/auth/register">
              Create account
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/60 p-4 text-sm text-muted-foreground shadow-inner dark:border-white/10 dark:bg-slate-900/70">
          🔐 Passwordless authentication is more secure. No password to remember or reset!
        </div>
      </div>
    </div>
  );
}
