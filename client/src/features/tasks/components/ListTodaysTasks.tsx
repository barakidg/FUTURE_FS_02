import { format, parseISO } from "date-fns";
import { AlertCircle, Check, CheckCircle2, Clock, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRightPanel } from "@/layouts/right-panel";
import { useTasks, useUpdateTaskStatus } from "../hooks";
import type { Task } from "../types";

export function ListTodaysTasks() {
  const { data: tasks, isLoading } = useTasks("today");
  const updateStatus = useUpdateTaskStatus();
  const { openLead } = useRightPanel();

  function handleStatusUpdate(e: React.MouseEvent, task: Task, status: "DONE" | "CANCELLED") {
    e.stopPropagation();
    updateStatus.mutate({ noteId: task.id, taskStatus: status });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/40" />)}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">All caught up for today!</p>
        <p className="text-xs text-muted-foreground">No tasks or follow-ups currently scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => openLead(task.leadId, "notes")}
          className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-transparent bg-background/50 p-3.5 hover:border-white/10 hover:bg-muted/80 "
        >
          <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
            task.isOverdue ? "bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20" : "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20")}>
            {task.isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          </span>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium leading-none text-foreground">{task.content}</p>
              {task.scheduledFor && (
                <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{format(parseISO(task.scheduledFor), "p")}</span>
                  {task.isOverdue && <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider">Overdue</Badge>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 pt-0.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="font-medium text-zinc-400">{task.lead.name}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
              title="Mark completed" onClick={(e) => handleStatusUpdate(e, task, "DONE")} disabled={updateStatus.isPending}>
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              title="Cancel task" onClick={(e) => handleStatusUpdate(e, task, "CANCELLED")} disabled={updateStatus.isPending}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}