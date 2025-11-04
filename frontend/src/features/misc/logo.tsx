import { cn } from "@/lib/utils";

interface LogoMarkProps extends React.SVGAttributes<SVGSVGElement> {}

export function LogoMark({ className, ...props }: LogoMarkProps) {
  return (
    <svg
      className={cn("text-sky-500", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="spark-gradient" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path
        d="M12 26c0-9.941 8.059-18 18-18 7.713 0 14.323 4.88 16.973 11.756a8 8 0 0 0 6.09 4.926A8.997 8.997 0 0 1 62 33c0 4.97-4.03 9-9 9H37l-5 11-5-11h-3c-6.627 0-12-5.373-12-12Z"
        stroke="url(#spark-gradient)"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="url(#spark-gradient)"
        fillOpacity="0.15"
      />
      <circle cx="20" cy="24" r="3" fill="url(#spark-gradient)" />
      <circle cx="34" cy="16" r="2" fill="url(#spark-gradient)" />
      <circle cx="50" cy="32" r="2.5" fill="url(#spark-gradient)" />
    </svg>
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
      <span className="font-display text-2xl">Collabity</span>
    </div>
  );
}
