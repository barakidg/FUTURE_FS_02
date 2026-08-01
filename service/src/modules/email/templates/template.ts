export interface FollowUpEmailData {
  gymName: string;
  leadName: string;
  senderName: string;
  message: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
}

export function renderFollowUpEmail(subject: string, data: FollowUpEmailData): RenderedEmail {
  return {
    subject,
    html: `
      <div style="font-family: sans-serif; font-size: 15px; color: #1f2a44; line-height: 1.6;">
        <p>Hi ${escapeHtml(data.leadName)},</p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
        <p>— ${escapeHtml(data.senderName)}<br/>${escapeHtml(data.gymName)}</p>
      </div>
    `.trim(),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}