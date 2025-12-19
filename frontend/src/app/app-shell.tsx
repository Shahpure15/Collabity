import { Outlet, Navigate } from "react-router-dom";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { useCollege } from "@/features/college/college-context";

export function AppShell() {
  const { hasCollege, isLoading } = useCollege();

  // Show loading state while checking college
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to missing college page if no college slug
  if (!hasCollege) {
    return <Navigate to="/missing-college" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <Outlet />
    </div>
  );
}
