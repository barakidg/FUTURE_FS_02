import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "./hooks";
import { isSuperAdmin } from "./types";
import { PageLoader } from "@/layouts/components/PageLoader";

export function RequireAuth() {
  const { data: user, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function RequireSuperAdmin() {
  const { data: user } = useSession();

  return isSuperAdmin(user ?? null)
    ? <Outlet />
    : <Navigate to="/" replace />;
}

export function RequireGymAdmin() {
  const { data: user } = useSession();

  return !isSuperAdmin(user ?? null)
    ? <Outlet />
    : <Navigate to="/" replace />;
}