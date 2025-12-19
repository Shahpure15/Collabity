import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerWithEmail } from "@/lib/firebase";
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

  // Registration via password is disabled for now. Redirect users to the email-link flow.
  useState(() => {
    navigate("/auth/email-link", { replace: true });
    return undefined;
  });

  return null;
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
