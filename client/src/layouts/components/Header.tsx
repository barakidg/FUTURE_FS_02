import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { useRightPanel } from "../right-panel";
import { HeaderSearchFilter } from "./HeaderSearchFilter";
import { isSuperAdmin } from "@/features/auth/types";
import { useSession } from "@/features/auth/hooks";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { openProfile } = useRightPanel();
  const { data: user } = useSession();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b px-4 bg-background/95 backdrop-blur-xs">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle left panel">
        <PanelLeft className="h-4 w-4" />
      </Button>

      {isSuperAdmin(user ?? null) ? (
        ""
      ) : (
        <HeaderSearchFilter />
      )}

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openProfile()}
          aria-label="Open profile"
          className="hidden lg:inline-flex"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}