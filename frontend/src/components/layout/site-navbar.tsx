import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { WordMark } from "@/features/misc/logo";
import { useAuth } from "@/features/auth/auth-context";
import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const landingAnchors = [
  { id: "features", label: "Features" },
  { id: "opportunities", label: "Opportunities" },
  { id: "why", label: "Why Collabity" },
];

export function SiteNavbar() {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = useCallback(
    (sectionId: string) => {
      if (location.pathname !== "/") {
        navigate({ pathname: "/", hash: `#${sectionId}` });
        return;
      }

      if (typeof window !== "undefined") {
        const target = document.getElementById(sectionId);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [location.pathname, navigate],
  );

  const handleSignOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="transition-opacity hover:opacity-90" aria-label="Collabity home">
          <WordMark className="text-lg" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {landingAnchors.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAnchorClick(item.id)}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
          <Link to="/discover" className="transition-colors hover:text-foreground">
            Discover
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={cn("hidden md:inline-flex", location.pathname === "/dashboard" && "pointer-events-none opacity-60")}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
              <Avatar className="h-8 w-8">
                <img
                  src={userProfile?.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt={userProfile?.name || user.displayName || "User avatar"}
                />
              </Avatar>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth/login">Log in</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to="/auth/register">Join the beta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
