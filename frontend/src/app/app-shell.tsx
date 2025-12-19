import { Outlet, Navigate, useLocation } from "react-router-dom";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { useCollege } from "@/features/college/college-context";

export function AppShell() {
  const { hasCollege, isLoading } = useCollege();
  const location = useLocation();

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

  // Only redirect to missing-college if accessing protected routes without college
  const protectedRoutes = ['/dashboard', '/discover', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
  
  if (!hasCollege && isProtectedRoute) {
    return <Navigate to="/missing-college" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <Outlet />
    </div>
  );
}
