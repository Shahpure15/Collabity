import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "@/features/auth/routes/auth-layout";
import { LoginRoute } from "@/features/auth/routes/login-route";
import { RegisterRoute } from "@/features/auth/routes/register-route";
import { ResetPasswordRoute } from "@/features/auth/routes/reset-route";
import { LandingRoute } from "@/features/landing";

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <LandingRoute />,
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
    ],
  },
]);
