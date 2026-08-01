/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Lead } from "@/features/leads/types";

export type LeadSection = "details" | "notes" | "email";
export type ProfileSection = "profile" | "security";

export type PanelMode =
  | { kind: "simple"; title: string; content: ReactNode }
  | { kind: "lead"; leadId: string; initialLead?: Lead; section: LeadSection }
  | { kind: "profile"; section: ProfileSection };

interface RightPanelState {
  isOpen: boolean;
  mode: PanelMode | null;

  open: (content: ReactNode, title?: string) => void;
  openLead: (leadOrId: Lead | string, section?: LeadSection) => void;
  openProfile: (section?: ProfileSection) => void;
  setLeadSection: (section: LeadSection) => void;
  setProfileSection: (section: ProfileSection) => void;
  close: () => void;
  clear: () => void;
  toggle: () => void;
}

const RightPanelContext = createContext<RightPanelState | undefined>(undefined);

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<PanelMode | null>(null);

  const open = useCallback((nextContent: ReactNode, nextTitle?: string) => {
    setMode({ kind: "simple", title: nextTitle ?? "Details", content: nextContent });
    setIsOpen(true);
  }, []);

  const openLead = useCallback((leadOrId: Lead | string, section: LeadSection = "details") => {
    if (typeof leadOrId === "string") {
      setMode({ kind: "lead", leadId: leadOrId, section });
    } else {
      setMode({ kind: "lead", leadId: leadOrId.id, initialLead: leadOrId, section });
    }
    setIsOpen(true);
  }, []);

  const openProfile = useCallback((section: ProfileSection = "profile") => {
    setMode({ kind: "profile", section });
    setIsOpen(true);
  }, []);

  const setLeadSection = useCallback((section: LeadSection) => {
    setMode((current) => (current?.kind === "lead" ? { ...current, section } : current));
  }, []);

  const setProfileSection = useCallback((section: ProfileSection) => {
    setMode((current) => (current?.kind === "profile" ? { ...current, section } : current));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setMode(null);
  }, []);

  return (
    <RightPanelContext.Provider
      value={{
        isOpen,
        mode,
        open,
        openLead,
        openProfile,
        setLeadSection,
        setProfileSection,
        close,
        clear,
        toggle: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </RightPanelContext.Provider>
  );
}

export function useRightPanel() {
  const context = useContext(RightPanelContext);
  if (!context) throw new Error("useRightPanel must be used within a RightPanelProvider");
  return context;
}
