import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface LogoMarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function LogoMark({ className, ...props }: LogoMarkProps) {
  return (
    <img
      src={logoImage}
      alt="Collabity Logo"
      className={cn("object-contain", className)}
      {...props}
    />
  );
}

export function WordMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      <LogoMark className="h-8 w-8" />
      <span className="font-display text-xl">Collabity</span>
    </div>
  );
}
