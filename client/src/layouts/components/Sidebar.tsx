import { NavLink } from "react-router-dom";
import { LifeBuoy, LogOut, Star } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { useSession, useSignOut } from "@/features/auth/hooks";
import { isSuperAdmin } from "@/features/auth/types";
import { gymAdminNavItems, superAdminNavItems } from "../sidebar-config";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV_ICONS = {
  Dashboard: "text-blue-500",
  Leads: "text-emerald-500",
  "API & Integrations": "text-amber-500",
  Analytics: "text-purple-500",
  "Manage Gyms": "text-sky-500",
  Reports: "text-indigo-500",
} as Record<string, string>;

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: user } = useSession();
  const signOut = useSignOut();
  const isAdmin = isSuperAdmin(user ?? null);
  const navItems = isAdmin ? superAdminNavItems : gymAdminNavItems;

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1">
          <Logo labelClassName="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <NavLink to={to} end={to === "/"} onClick={handleNavClick}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={label}
                        className={cn(
                          "text-muted-foreground hover:text-foreground cursor-pointer",
                          isActive && "font-semibold text-foreground bg-accent/60 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-primary"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", NAV_ICONS[label])} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <SidebarMenu>
          {!isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Coming soon" render={<NavLink to="/upgrade" />} className="text-muted-foreground hover:text-foreground">
                  <Star className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Upgrade Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/help">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip="Help Center"
                      className={cn(
                        "text-muted-foreground hover:text-foreground cursor-pointer",
                        isActive && "font-semibold text-foreground bg-accent/60 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-primary"
                      )}
                    >
                      <LifeBuoy className="h-4 w-4 shrink-0 text-cyan-500" />
                      <span>Help Center</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut.mutate()} tooltip="Logout" className="text-muted-foreground hover:text-destructive cursor-pointer">
              <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}