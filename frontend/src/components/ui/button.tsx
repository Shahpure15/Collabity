import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "glass"
    | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
}

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground shadow-lg shadow-[var(--shadow-primary)] hover:opacity-95",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline:
    "border border-border bg-background hover:bg-muted/60",
  ghost: "hover:bg-muted/60 hover:text-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  glass:
    "border border-white/20 bg-white/30 text-slate-800 shadow-glass backdrop-blur hover:bg-white/40 dark:text-slate-100 dark:border-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-900/60",
  gradient:
    "bg-gradient-to-r from-sky-400 via-fuchsia-400 to-violet-500 text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-6 py-2",
  sm: "h-9 px-4 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
