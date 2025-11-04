import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  trailingIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, trailingIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl border border-input bg-background/60 text-sm shadow-sm transition hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40",
          className,
        )}
      >
        <input
          type={type}
          className="flex-1 rounded-xl bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <span className="pointer-events-none mr-3 text-muted-foreground">{trailingIcon}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
