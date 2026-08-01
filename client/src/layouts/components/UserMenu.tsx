import { useNavigate } from "react-router-dom";
import { LifeBuoy, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, useSignOut } from "@/features/auth/hooks";
import { useRightPanel } from "../right-panel";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu() {
  const { data: user } = useSession();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { openProfile } = useRightPanel();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="gap-2 text-muted-foreground" onClick={() => openProfile()}>
            <User className="h-4 w-4 text-emerald-500" />
            View Profile
          </DropdownMenuItem>

          <DropdownMenuItem
              className="gap-2 text-muted-foreground"
              onClick={() => navigate("/help")}
            >
              <LifeBuoy className="h-4 w-4 text-cyan-500 !text-cyan-500" />
              Help Center
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 text-destructive"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}