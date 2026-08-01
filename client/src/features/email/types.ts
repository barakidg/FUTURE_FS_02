export interface SendEmailInput {
  subject: string;
  message: string;
}

export interface SendEmailResult {
  sent: boolean;
}
