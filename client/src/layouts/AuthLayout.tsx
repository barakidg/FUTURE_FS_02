import { Outlet } from "react-router-dom";
import { Logo } from "@/layouts/components/Logo";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <Logo />
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}