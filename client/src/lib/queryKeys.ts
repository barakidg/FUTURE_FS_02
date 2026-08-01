export const queryKeys = {
  session: ["session"] as const,
  organizations: {
    list: (filters: unknown) => ["organizations", "list", filters] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
  },
  leads: {
    list: (filters: unknown) => ["leads", "list", filters] as const,
    detail: (id: string) => ["leads", "detail", id] as const,
  },
  notes: {
    list: (leadId: string) => ["notes", "list", leadId] as const,
  },
  tasks: {
    list: (scope: string) => ["tasks", "list", scope] as const,
  },
  apiKey: ["apiKey"] as const,
  analytics: {
    platform: (period: string) => ["analytics", "platform", period] as const,
    gym: (period: string) => ["analytics", "gym", period] as const,
    gymTimeseries: (period: string) => ["analytics", "gym-timeseries", period] as const,
  },
} as const;