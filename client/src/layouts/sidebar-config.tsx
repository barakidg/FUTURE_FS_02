import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Plug, BarChart3, Building2, FileBarChart } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const gymAdminNavItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Leads", to: "/leads", icon: Users },
  { label: "API & Integrations", to: "/api-keys", icon: Plug },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
];

export const superAdminNavItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Manage Gyms", to: "/admin/organizations", icon: Building2 },
  { label: "Reports", to: "/admin/reports", icon: FileBarChart },
];

