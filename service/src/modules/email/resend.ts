import { Resend } from "resend";
import { env } from "../../lib/env.js";
import { logger } from "../../lib/logger.js";
import { ApiError } from "../../lib/error.js";

const resend = new Resend(env.RESEND_API_KEY);

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    html: input.html,
    ...(input.replyTo && { replyTo: input.replyTo }),
  });

  if (error) {
    logger.error({ error, to: input.to }, "Failed to send email via Resend");
    throw ApiError.internal("Failed to send email. Please try again.");
  }
}