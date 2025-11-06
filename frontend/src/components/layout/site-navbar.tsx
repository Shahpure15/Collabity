import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { WordMark } from "@/features/misc/logo";
import { useAuth } from "@/features/auth/auth-context";
import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Home, Compass, Menu, X, LogOut, Search } from "lucide-react";
import { GlobalSearch } from "./global-search";

const landingAnchors = [
  { id: "features", label: "Features" },
  { id: "opportunities", label: "Opportunities" },
  { id: "why", label: "Why Collabity" },
];

export function SiteNavbar() {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  const isDashboard = location.pathname === "/dashboard";
  const isDiscover = location.pathname === "/discover";

  return (
    <>
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
            {user && (
              <button
                onClick={() => setSearchOpen(true)}
                className="transition-colors hover:text-foreground"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
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
                  className="hidden md:inline-flex"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
                <button
                  onClick={() => navigate(`/profile/${user.uid}`)}
                  className="rounded-full transition-opacity hover:opacity-80"
                  aria-label="View profile"
                >
                  <Avatar className="h-8 w-8">
                    <img
                      src={userProfile?.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                      alt={userProfile?.name || user.displayName || "User avatar"}
                    />
                  </Avatar>
                </button>
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

      {/* Mobile Bottom Dock - Only show when authenticated */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 md:hidden">
          <nav className="container mx-auto flex items-center justify-around px-4 py-3">
            <button
              onClick={() => navigate("/dashboard")}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isDashboard ? "text-primary" : "text-muted-foreground"
              )}
              aria-label="Dashboard"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="text-xs font-medium">Search</span>
            </button>

            <button
              onClick={() => navigate("/discover")}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isDiscover ? "text-primary" : "text-muted-foreground"
              )}
              aria-label="Discover"
            >
              <Compass className="h-5 w-5" />
              <span className="text-xs font-medium">Discover</span>
            </button>

            <button
              onClick={() => navigate(`/profile/${user.uid}`)}
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
              aria-label="Profile"
            >
              <Avatar className="h-5 w-5">
                <img
                  src={userProfile?.avatar || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                  alt="Profile"
                />
              </Avatar>
              <span className="text-xs font-medium">Profile</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="text-xs font-medium">Menu</span>
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 border-t border-white/20 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-1">
                  {landingAnchors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleAnchorClick(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-muted/50 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
