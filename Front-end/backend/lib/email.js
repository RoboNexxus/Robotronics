const fs = require("fs");
const path = require("path");

const TEMPLATE_PATH = path.join(__dirname, "..", "templates", "RegistrationEmail.html");

function renderTemplate(vars) {
  const raw = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return raw.replace(/<\?=\s*([\w]+)\s*\?>/g, (_, key) => (vars[key] ?? ""));
}

async function sendConfirmationEmail({ to, leaderName, eventName, regId }) {
  const html = renderTemplate({
    leader_name: leaderName,
    event_name: eventName,
    reg_id: regId,
  });

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Robo Nexus", email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: to, name: leaderName }],
        subject: `Registration Confirmed — ${eventName}`,
        htmlContent: html,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Brevo email failed:", err.message);
    return false;
  }
}

module.exports = { sendConfirmationEmail };
