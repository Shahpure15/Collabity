import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Building2, Globe, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCollegeSlugOverride } from "@/lib/college-utils";
import { LogoMark } from "@/features/misc/logo";

export function MissingCollegeRoute() {
  const [manualSlug, setManualSlug] = useState("");
  const [showDevOverride, setShowDevOverride] = useState(false);
  const navigate = useNavigate();

  const handleSetCollege = () => {
    if (manualSlug.trim()) {
      setCollegeSlugOverride(manualSlug.trim().toLowerCase());
    }
  };

  const isLocalhost = window.location.hostname === "localhost" || 
                      window.location.hostname === "127.0.0.1";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-red-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-48 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl p-6">
        <Card className="border-destructive/50 bg-white/90 shadow-2xl backdrop-blur dark:bg-slate-950/90">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-display">College Access Required</CardTitle>
              <CardDescription className="text-base">
                Collabity is a college-specific platform. You must access it via your institution's subdomain.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* How it works */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Globe className="h-4 w-4" />
                How to access Collabity
              </h3>
              
              <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Use your college subdomain</p>
                    <p className="mt-1">
                      Access the platform at{" "}
                      <code className="rounded bg-background px-2 py-0.5 text-xs font-mono">
                        [your-college].collabity.tech
                      </code>
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs">
                    <span className="font-medium text-foreground">Example:</span>{" "}
                    If you're from MIT AOE, visit{" "}
                    <code className="rounded bg-background px-2 py-0.5 font-mono">
                      mitaoe.collabity.tech
                    </code>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="rounded-lg border border-border bg-background p-4 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Don't know your college subdomain?</span>
                <br />
                Contact your placement cell or reach out to us for onboarding information.
              </p>
            </div>

            {/* Return to home button */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </div>

            {/* Localhost development override */}
            {isLocalhost && (
              <div className="border-t border-dashed border-border pt-6">
                {!showDevOverride ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDevOverride(true)}
                    className="w-full text-xs text-muted-foreground"
                  >
                    Developer: Set manual college override
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-100">
                      <p className="font-semibold">⚠️ Development Mode</p>
                      <p className="mt-1">This override only works on localhost.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-foreground" htmlFor="college-slug">
                        College Slug
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="college-slug"
                          placeholder="e.g., mitaoe"
                          value={manualSlug}
                          onChange={(e) => setManualSlug(e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          onClick={handleSetCollege}
                          disabled={!manualSlug.trim()}
                          size="sm"
                        >
                          Set
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This will be stored in localStorage and persist on refresh.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Logo footer */}
            <div className="flex items-center justify-center gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
              <LogoMark className="h-5 w-5" />
              <span>Collabity</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
