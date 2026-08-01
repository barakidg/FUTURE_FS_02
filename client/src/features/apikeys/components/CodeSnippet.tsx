import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/layouts/components/CopyButton";
import { env } from "@/lib/env";

type Language = "curl" | "javascript";
const PLACEHOLDER_KEY = "YOUR_API_KEY";

function buildSnippet(language: Language): string {
  const endpoint = `${env.VITE_API_URL}/api/public/leads`;

  if (language === "curl") {
    return `curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${PLACEHOLDER_KEY}" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "interest": "Personal training"
  }'`;
  }

  return `await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${PLACEHOLDER_KEY}",
  },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    interest: "Personal training",
  }),
});`;
}

export function CodeSnippet() {
  const [language, setLanguage] = useState<Language>("curl");
  const code = buildSnippet(language);

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-1 text-[11px] font-mono font-medium text-muted-foreground">
            {language === "curl" ? "terminal.sh" : "lead-submission.ts"}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger className="h-6.5 w-[100px] text-xs bg-background border-border text-foreground cursor-pointer focus:ring-1 focus:ring-indigo-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="text-xs">
              <SelectItem value="curl">cURL</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-muted-foreground hover:text-foreground">
            <CopyButton value={code} />
          </div>
        </div>
      </div>

      <div className="p-3.5 font-mono text-xs leading-snug text-foreground overflow-x-auto selection:bg-indigo-500/20">
        <pre className="tracking-tight">
          <code>
            {language === "curl" ? (
              <>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">curl</span>{" "}
                <span className="text-amber-600 dark:text-amber-300">-X POST</span>{" "}
                <span className="text-emerald-600 dark:text-emerald-400">{`${env.VITE_API_URL}/api/public/leads`}</span> {"\\\n"}
                {"  "}<span className="text-amber-600 dark:text-amber-300">-H</span>{" "}
                <span className="text-sky-600 dark:text-sky-300">"Content-Type: application/json"</span> {"\\\n"}
                {"  "}<span className="text-amber-600 dark:text-amber-300">-H</span>{" "}
                <span className="text-sky-600 dark:text-sky-300">"x-api-key: {PLACEHOLDER_KEY}"</span> {"\\\n"}
                {"  "}<span className="text-amber-600 dark:text-amber-300">-d</span>{" "}
                <span className="text-sky-600 dark:text-sky-300 font-medium">{`'{\n    "name": "Jane Doe",\n    "email": "jane@example.com",\n    "interest": "Personal training"\n  }'`}</span>
              </>
            ) : (
              <>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">await</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">fetch</span>(
                <span className="text-emerald-600 dark:text-emerald-400">"{`${env.VITE_API_URL}/api/public/leads`}"</span>, {"{\n"}
                {"  "}<span className="text-sky-600 dark:text-sky-300">method</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"POST"</span>,{"\n"}
                {"  "}<span className="text-sky-600 dark:text-sky-300">headers</span>: {"{\n"}
                {"    "}<span className="text-sky-600 dark:text-sky-300">"Content-Type"</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"application/json"</span>,{"\n"}
                {"    "}<span className="text-sky-600 dark:text-sky-300">"x-api-key"</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"{PLACEHOLDER_KEY}"</span>,{"\n"}
                {"  "}{"},\n"}
                {"  "}<span className="text-sky-600 dark:text-sky-300">body</span>:{" "}
                <span className="text-purple-600 dark:text-purple-400">JSON</span>.
                <span className="text-blue-600 dark:text-blue-400">stringify</span>({"{\n"}
                {"    "}<span className="text-sky-600 dark:text-sky-300">name</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"Jane Doe"</span>,{"\n"}
                {"    "}<span className="text-sky-600 dark:text-sky-300">email</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"jane@example.com"</span>,{"\n"}
                {"    "}<span className="text-sky-600 dark:text-sky-300">interest</span>:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">"Personal training"</span>,{"\n"}
                {"  "}{"}),\n"}
                {"}"});
              </>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}