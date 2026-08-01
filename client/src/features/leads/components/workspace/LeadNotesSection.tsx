import { useMemo, useRef, useEffect, useState } from "react";
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";
import { CalendarClock, Loader2, Send, X, Clock,Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateNote, useNotes } from "@/features/notes/hooks";
import type { Note } from "@/features/notes/types";
import { useUpdateTaskStatus } from "@/features/tasks/hooks";

function formatDayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

function groupNotesByDay(notes: Note[]) {
  const groups = new Map<string, Note[]>();

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  for (const note of sortedNotes) {
    const key = format(parseISO(note.createdAt), "yyyy-MM-dd");
    const existing = groups.get(key) ?? [];
    existing.push(note);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    label: formatDayLabel(parseISO(`${key}T12:00:00`)),
    items,
  }));
}

function NoteTimelineItem({ note }: { note: Note }) {
  const updateTaskStatus = useUpdateTaskStatus();
  const isActionable = note.scheduledFor && note.taskStatus === "PENDING";

  return (
    <div className="group relative rounded-lg p-3 transition-colors hover:bg-muted/40">
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>
      
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-muted-foreground/80">
          {format(parseISO(note.createdAt), "p")}
        </span>
        <span>•</span>
        <span>{formatDistanceToNow(parseISO(note.createdAt), { addSuffix: true })}</span>

        {note.scheduledFor && note.taskStatus === "PENDING" && (
          <Badge
            variant="secondary"
            className={cn(
              "ml-auto text-[11px] font-normal gap-1 transition-colors",
              note.isOverdue
                ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <Clock className="h-3 w-3" />
            <span>Scheduled {format(parseISO(note.scheduledFor), "MMM d, p")}</span>
            {note.isOverdue && <span className="font-semibold">• Overdue</span>}
          </Badge>
        )}
      </div>

      {isActionable && (
        <div className="mt-2 flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" className="h-7 gap-1 text-xs"
            onClick={() => updateTaskStatus.mutate({ noteId: note.id, taskStatus: "DONE" })}
            disabled={updateTaskStatus.isPending}>
            <Check className="h-3 w-3" /> Mark done
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => updateTaskStatus.mutate({ noteId: note.id, taskStatus: "CANCELLED" })}
           disabled={updateTaskStatus.isPending}>
            <X className="h-3 w-3" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export function LeadNotesSection({ leadId }: { leadId: string }) {
  const { data: notes, isLoading } = useNotes(leadId);
  const createNote = useCreateNote(leadId);

  const [content, setContent] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const groupedNotes = useMemo(() => groupNotesByDay(notes ?? []), [notes]);

  useEffect(() => {
    if (!isLoading && notes?.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes?.length, isLoading]);

  function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed) return;

    createNote.mutate(
      {
        content: trimmed,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setScheduledFor("");
          setScheduleOpen(false);
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);
        },
      }
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Activity & Notes
        </h2>
        {notes && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {notes.length}
          </span>
        )}
      </div>

      <ScrollArea className="min-h-0 flex-1 px-4 py-3">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && groupedNotes.length === 0 && (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 text-muted-foreground mb-3">
              <CalendarClock className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">No notes recorded</p>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              Add logs, updates, or schedule follow-up actions below.
            </p>
          </div>
        )}

        {!isLoading &&
          groupedNotes.map((group) => (
            <section key={group.key} className="relative mb-6 last:mb-2">
              <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-1.5 backdrop-blur support-[backdrop-filter]:bg-background/60">
                <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide uppercase">
                  {group.label}
                </span>
              </div>
              <div className="mt-1 space-y-1 border-l-2 border-border/40 pl-2">
                {group.items.map((note) => (
                  <NoteTimelineItem key={note.id} note={note} />
                ))}
              </div>
            </section>
          ))}
        <div ref={bottomRef} />
      </ScrollArea>

      <div className="p-1 shrink-0 border-t bg-muted/20">
        <div className="rounded-lg border bg-background p-2.5 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <Textarea
            placeholder="Write a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[30px] border-0 pt-1 text-sm shadow-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" ) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {scheduledFor && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
                <CalendarClock className="h-3 w-3" />
                <span>Scheduled: {format(new Date(scheduledFor), "MMM d, p")}</span>
                <button
                  type="button"
                  onClick={() => setScheduledFor("")}
                  className="ml-1 rounded-full p-0.5 hover:bg-background/50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <PopoverTrigger className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                scheduledFor ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                <CalendarClock className="h-3.5 w-3.5" />
                <span>{scheduledFor ? "Reschedule" : "Schedule"}</span>
              </PopoverTrigger>

              <PopoverContent align="start" className="w-72 p-3">
                <PopoverHeader className="pb-2">
                  <PopoverTitle className="text-xs font-semibold">Schedule follow-up task</PopoverTitle>
                </PopoverHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="scheduled-for" className="text-xs">Date & Time</Label>
                    <Input
                      id="scheduled-for"
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                      className="h-8 text-xs dark:[color-scheme:dark]"
                    />
                  </div>
                  {scheduledFor && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-full text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setScheduledFor("");
                        setScheduleOpen(false);
                      }}
                    >
                      Remove schedule
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim() || createNote.isPending}
              className="h-7 px-3 text-xs gap-1.5 rounded-md"
            >
              {createNote.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              <span>Add Note</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}