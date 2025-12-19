import { Link, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LogoMark } from "@/features/misc/logo";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-48 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/60">
        <div className="hidden w-1/2 flex-col justify-between border-r border-white/20 bg-gradient-to-b from-sky-400/40 via-purple-500/30 to-indigo-500/50 p-12 text-white dark:border-white/10 dark:from-sky-500/20 dark:to-slate-900 lg:flex">
          <header className="flex items-center gap-3 text-lg font-semibold">
            <LogoMark className="h-10 w-10" /> Collabity
          </header>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Academic opportunity portal
            </h2>
            <p className="text-lg text-white/80">
              Connect students with internships and academic projects from faculty and industry partners.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p>✔️ Discover opportunities</p>
            <p>✔️ Track applications</p>
            <p>✔️ Build your profile</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 p-10 lg:w-1/2">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
              <LogoMark className="h-7 w-7" /> Collabity
            </Link>
            <Button asChild variant="ghost">
              <Link to="/">Return home</Link>
            </Button>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
