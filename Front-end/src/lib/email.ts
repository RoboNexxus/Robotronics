import fs from "fs";
import path from "path";

const TEMPLATE_PATH = path.join(process.cwd(), "templates", "RegistrationEmail.html");

function renderTemplate(vars: Record<string, string>): string {
  const raw = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return raw.replace(/<\?=\s*([\w]+)\s*\?>/g, (_, key: string) => vars[key] ?? "");
}

interface EmailOptions {
  to: string;
  leaderName: string;
  eventName: string;
  regId: string;
}

export async function sendConfirmationEmail({
  to, leaderName, eventName, regId,
}: EmailOptions): Promise<boolean> {
  const html = renderTemplate({ leader_name: leaderName, event_name: eventName, reg_id: regId });

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name: "Robo Nexus", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: to, name: leaderName }],
        subject: `Registration Confirmed — ${eventName}`,
        htmlContent: html,
      }),
    });
    return res.ok;
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error("Brevo email failed:", e.message);
    return false;
  }
}
