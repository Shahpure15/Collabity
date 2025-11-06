import { Outlet } from "react-router-dom";

import { SiteNavbar } from "@/components/layout/site-navbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />
      <Outlet />
    </div>
  );
}
