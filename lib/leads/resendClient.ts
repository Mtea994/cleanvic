import { Resend } from "resend";
import type { ResendClientLike } from "./submitLead";

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (cachedClient) return cachedClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  cachedClient = new Resend(key);
  return cachedClient;
}

export const resendLeadClient: ResendClientLike = {
  async send({ from, to, subject, text }) {
    const { error } = await getClient().emails.send({ from, to, subject, text });
    return { error: error ? { message: error.message } : null };
  },
};
