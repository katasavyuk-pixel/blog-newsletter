import { Resend } from "resend";

/** Sender. Use a dedicated subdomain (e.g. news.<domain>) verified in Resend (eu-west-1). */
export const FROM =
  process.env.RESEND_FROM ?? "Kata Ivanovych <news@news.kataivanovych.com>";

/**
 * Reply-to for emails that invite replies (welcome sequence). The sending
 * subdomain can't receive mail, so without this env replies would bounce —
 * set RESEND_REPLY_TO to a real, monitored mailbox.
 */
export const REPLY_TO = process.env.RESEND_REPLY_TO || undefined;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}
