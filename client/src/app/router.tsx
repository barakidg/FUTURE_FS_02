/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { RequireAuth, RequireGymAdmin, RequireSuperAdmin } from "@/features/auth/protectedRoute";
import { useSession } from "@/features/auth/hooks";
import { isSuperAdmin } from "@/features/auth/types";
import { PageLoader } from "@/layouts/components/PageLoader";
import { NotFoundPage } from "@/pages/NotFoundPage";

const SignInPage = lazy(() => import("@/pages/auth/SignInPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const GymDashboardPage = lazy(() => import("@/pages/gym/GymDashboard"));
const LeadsPage = lazy(() => import("@/pages/gym/Leads"));
const ApiKeysPage = lazy(() => import("@/pages/gym/ApiKeys"));
const GymAnalyticsPage = lazy(() => import("@/pages/gym/Analytics"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboard"));
const OrganizationsPage = lazy(() => import("@/pages/admin/Organizations"));
const ReportsPage = lazy(() => import("@/pages/admin/Reports"));
const HelpCenterPage = lazy(() => import("@/pages/HelpCenter"));
const UpgradePage = lazy(() => import("@/pages/gym/Upgrade"));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

function DashboardIndex() {
  const { data: user } = useSession();
  return isSuperAdmin(user ?? null) ? withSuspense(<AdminDashboardPage />) : withSuspense(<GymDashboardPage />);
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: withSuspense(<SignInPage />) },
      { path: "/register", element: withSuspense(<RegisterPage />) },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardIndex /> },
          { path: "help", element: withSuspense(<HelpCenterPage />) },
          {
            element: <RequireGymAdmin />,
            children: [
              { path: "leads", element: withSuspense(<LeadsPage />) },
              { path: "api-keys", element: withSuspense(<ApiKeysPage />) },
              { path: "analytics", element: withSuspense(<GymAnalyticsPage />) },
              { path: "upgrade", element: withSuspense(<UpgradePage />) },
            ],
          },
          {
            element: <RequireSuperAdmin />,
            children: [
              { path: "admin/organizations", element: withSuspense(<OrganizationsPage />) },
              { path: "admin/reports", element: withSuspense(<ReportsPage />) },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);