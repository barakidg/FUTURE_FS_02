import { Plus, RefreshCw, Rocket } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GenerateKeyDialog } from "@/features/apikeys/components/GenerateKeyDialog";
import { CodeSnippet } from "@/features/apikeys/components/CodeSnippet";
import { useApiKey } from "@/features/apikeys/hooks";

const SETUP_STEPS = [
  { title: "Generate Key", description: "Create a secure secret key to authorize your requests." },
  { title: "Authenticate", description: <>Pass the key in the <code className="rounded bg-muted px-1 py-0.5 text-xs">x-api-key</code> header.</> },
  { title: "Send Request", description: <>Push lead data to our <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/public/leads</code> endpoint.</> },
];

export default function ApiKeysPage() {
  const { data: apiKey, isLoading } = useApiKey();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">APIs &amp; Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Connect your existing marketing stack, custom dashboards, and lead forms directly to the GymLeadHub engine.
          </p>
        </div>
        <GenerateKeyDialog
          mode="create"
          trigger={
            !apiKey ? (
              <Button>
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            ) : undefined
          }
        />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-medium">Active API Keys</span>
          {apiKey && <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">1 Key Active</Badge>}
        </div>

        {isLoading && <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>}

        {!isLoading && !apiKey && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No API key yet. Generate one to start capturing leads from your website.
          </div>
        )}

        {apiKey && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Label</th>
                  <th className="px-4 py-2 font-medium">Key</th>
                  <th className="px-4 py-2 font-medium">Created</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 font-medium">{apiKey.name ?? "Website capture key"}</td>
                  <td className="px-4 py-3"><code className="text-muted-foreground">{apiKey.prefix}_{apiKey.start}••••••••••••</code></td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(apiKey.createdAt), "PP")}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <GenerateKeyDialog
                      mode="rotate"
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Regenerate key">
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-center gap-2">
          <Rocket className="h-4 w-4 text-amber-500" />
          <span className="font-medium">Quick Setup</span>
        </div>
        <ol className="space-y-4">
          {SETUP_STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</span>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <CodeSnippet />
    </div>
  );
}