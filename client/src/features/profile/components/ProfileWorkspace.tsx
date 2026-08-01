import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionSwitcher } from "@/layouts/components/workspace/SectionSwitcher";
import type { ProfileSection } from "@/layouts/right-panel";
import { useSession } from "@/features/auth/hooks";

const PROFILE_SECTIONS = [
  { value: "profile" as const, label: "Profile" },
  { value: "security" as const, label: "Security" },
];

interface ProfileWorkspaceProps {
  section: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}

export function ProfileWorkspace({ section, onSectionChange }: ProfileWorkspaceProps) {
  const { data: user } = useSession();

  if (!user) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 space-y-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">{user.name}</h2>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Admin
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p>
        </div>

        <SectionSwitcher value={section} onValueChange={onSectionChange} sections={PROFILE_SECTIONS} />
      </header>

      <div className="min-h-0 flex-1 pt-4">
        {section === "profile" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Name</Label>
              <Input id="profile-name" defaultValue={user.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" defaultValue={user.email} readOnly className="bg-muted/40" />
            </div>
            <p className="text-xs text-muted-foreground">Profile updates will be available in a future release.</p>
          </div>
        )}

        {section === "security" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" disabled placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" disabled placeholder="••••••••" />
            </div>
            <p className="text-xs text-muted-foreground">Password changes will be available in a future release.</p>
          </div>
        )}
      </div>
    </div>
  );
}
