import { format } from "date-fns";
import { Building2, Calendar, Mail, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "../hooks";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

export function OrganizationWorkspace({ organizationId }: { organizationId: string }) {
  const { data: organization, isLoading } = useOrganization(organizationId);

  if (isLoading || !organization) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const admin = organization.members[0]?.user;

  return (
    <div className="space-y-6">
      <OrganizationStatusBadge id={organization.id} status={organization.status} />

      <div className="space-y-4">
        <Field label="Gym name" value={<span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{organization.name}</span>} />
        <Field label="URL slug" value={organization.slug} />
        <Field
          label="Admin"
          value={admin ? <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{admin.name} · {<a href={`mailto:${admin.email}`} className="text-primary">{admin.email}</a>}</span> : null}
        />
        <Field label="Leads" value={<span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{organization._count.leads}</span>} />
        <Field
          label="Joined"
          value={<span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{format(new Date(organization.createdAt), "PPp")}</span>}
        />
      </div>
    </div>
  );
}