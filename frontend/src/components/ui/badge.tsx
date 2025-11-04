import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "glow" | "glass";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
        variant === "default" && "bg-primary/15 text-primary",
        variant === "outline" && "border border-primary/40 text-primary",
        variant === "glow" &&
          "bg-gradient-to-r from-sky-400/20 via-fuchsia-300/30 to-indigo-400/30 text-sky-900 dark:text-slate-100",
        variant === "glass" &&
          "glass-panel border-white/30 text-slate-800 dark:text-slate-200",
        className,
      )}
      {...props}
    />
  );
}
