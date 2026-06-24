import { Resend } from "resend";

/** Sender. Use a dedicated subdomain (e.g. news.<domain>) verified in Resend (eu-west-1). */
export const FROM =
  process.env.RESEND_FROM ?? "Kata Pro <news@news.kataivanovych.com>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}
