import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadWorkspace } from "@/features/leads/components/LeadWorkspace";
import { ProfileWorkspace } from "@/features/profile/components/ProfileWorkspace";
import { useRightPanel } from "../right-panel";

const ANIMATION_DURATION = 300;

export function RightPanel() {
  const {
    isOpen,
    mode,
    close,
    clear,
    setLeadSection,
    setProfileSection,
  } = useRightPanel();

  const shouldRender = isOpen || mode !== null;
  const isWorkspace = mode?.kind === "lead" || mode?.kind === "profile";

  useEffect(() => {
    if (isOpen) return;

    const timeout = window.setTimeout(() => {
      clear();
    }, ANIMATION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [isOpen, clear]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        onClick={close}
        className={`
          fixed inset-0 z-40
          bg-black/20 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      <aside
        className={`
          fixed right-0 z-50
          top-0 flex h-dvh w-[85vw] max-w-[480px] flex-col
          border-l bg-background shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex h-10 shrink-0 align-center justify-end border-b px-4">
          <Button variant="ghost" size="icon" onClick={close} aria-label="Close panel">
            <X className="h-4 w-4 flex-end text-lg" />
          </Button>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-hidden ${isWorkspace ? "flex flex-col px-4 pb-4" : "overflow-y-auto p-4"}`}
        >
          {mode?.kind === "simple" && mode.content}

          {mode?.kind === "lead" && (
            <LeadWorkspace
              leadId={mode.leadId}
              initialLead={mode.initialLead}
              section={mode.section}
              onSectionChange={setLeadSection}
            />
          )}

          {mode?.kind === "profile" && (
            <ProfileWorkspace section={mode.section} onSectionChange={setProfileSection} />
          )}
        </div>
      </aside>
    </>
  );
}
