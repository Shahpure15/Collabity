import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoMark } from "@/features/misc/logo";

export function NotFoundRoute() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-48 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg p-6">
        <Card className="bg-white/90 shadow-2xl backdrop-blur dark:bg-slate-950/90">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <FileQuestion className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-6xl font-display font-bold">404</CardTitle>
              <CardDescription className="text-xl font-medium">
                Page Not Found
              </CardDescription>
              <CardDescription className="text-base">
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="gradient"
                className="flex-1 flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>

            {/* Helpful links */}
            <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
              <p className="font-medium text-foreground mb-2">You might be looking for:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <button 
                    onClick={() => navigate("/dashboard")}
                    className="hover:text-foreground hover:underline"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/discover")}
                    className="hover:text-foreground hover:underline"
                  >
                    Discover
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate("/auth/login")}
                    className="hover:text-foreground hover:underline"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>

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
