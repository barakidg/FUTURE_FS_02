import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/error.js";
import { sendEmail } from "./resend.js";
import { renderFollowUpEmail } from "./templates/template.js";
import { addNote } from "../notes/service.js";
import type { emailInput } from "./schema.js";

export interface EmailSender {
  name: string;
  email: string;
}

export async function sendLeadEmail(
  organizationId: string,
  organizationName: string,
  leadId: string,
  sender: EmailSender,
  input: emailInput,
) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId },
    select: { id: true, name: true, email: true },
  });

  if (!lead) {
    throw ApiError.notFound("Lead not found.");
  }
  if (!lead.email) {
    throw ApiError.conflict("This lead has no email address on file.");
  }

  const { subject, html } = renderFollowUpEmail(input.subject, {
    gymName: organizationName,
    leadName: lead.name,
    senderName: sender.name,
    message: input.message,
  });

  await sendEmail({ to: lead.email, subject, html, replyTo: sender.email });

  return addNote(organizationId, leadId, {
    content: `Sent email to ${lead.email}: "${input.subject}"`,
  });
}