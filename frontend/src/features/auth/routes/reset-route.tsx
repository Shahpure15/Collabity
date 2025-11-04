import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/firebase";

const resetSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordRoute() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleReset = form.handleSubmit(async (values) => {
    setStatus(null);
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setStatus("Password reset email sent. Check your inbox.");
      form.reset();
    } catch (error) {
      console.error("[auth] reset failed", error);
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("Unable to send reset email right now.");
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="relative">
      <div className="absolute -left-6 -top-6 h-20 w-20 animate-pulse-orbit rounded-full border border-primary/30 bg-primary/20" />
      <div className="absolute -right-10 bottom-10 h-28 w-28 animate-pulse-orbit rounded-full border border-purple-400/30 bg-purple-300/20" />
      <div className="relative z-10 space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
            reset
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              Enter the email you used to sign up and we will send password instructions.
            </p>
          </div>
        </header>
        <form className="space-y-4" onSubmit={handleReset}>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="reset-email">
              Email
            </label>
            <Input id="reset-email" placeholder="you@college.edu" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          {status && <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">{status}</p>}
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending email
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Remembered? <Link className="text-primary" to="/auth/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
