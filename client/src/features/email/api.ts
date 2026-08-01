import { api } from "@/lib/axios";
import type { SendEmailInput, SendEmailResult } from "./types";

export async function sendLeadEmail(leadId: string, input: SendEmailInput): Promise<SendEmailResult> {
  const { data } = await api.post<SendEmailResult>(`/api/leads/${leadId}/email`, input);
  return data;
}
