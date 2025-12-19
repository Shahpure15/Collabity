import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/app/app-shell";
import { AuthLayout } from "@/features/auth/routes/auth-layout";
import { LoginRoute } from "@/features/auth/routes/login-route";
import { RegisterRoute } from "@/features/auth/routes/register-route";
import { ResetPasswordRoute } from "@/features/auth/routes/reset-route";
import { EmailLinkRoute } from "@/features/auth/routes/email-link-route";
import { VerifyEmailRoute } from "@/features/auth/routes/verify-email-route";
import { LandingRoute } from "@/features/landing";
import { DashboardRoute } from "@/features/dashboard/routes/dashboard-route";
import { DiscoverRoute } from "@/features/discover/routes/discover-route";
import { ProfileRoute } from "@/features/profile/routes/profile-route";
import { MissingCollegeRoute } from "@/features/college/routes/missing-college-route";
import { NotFoundRoute } from "@/features/misc/routes/not-found-route";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LandingRoute />,
      },
      {
        path: "dashboard",
        element: <DashboardRoute />,
      },
      {
        path: "discover",
        element: <DiscoverRoute />,
      },
      {
        path: "profile/:userId",
        element: <ProfileRoute />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "register",
        element: <RegisterRoute />,
      },
      {
        path: "reset",
        element: <ResetPasswordRoute />,
      },
      {
        path: "email-link",
        element: <EmailLinkRoute />,
      },
    ],
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailRoute />,
  },
  {
    path: "/missing-college",
    element: <MissingCollegeRoute />,
  },
  {
    path: "*",
    element: <NotFoundRoute />,
  },
]);
