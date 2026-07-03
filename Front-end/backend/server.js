require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { DATABASES, MAX_TEAM_SIZE } = require("./config/databases");
const { generateRegId } = require("./lib/regId");
const { createRegistration, countTotalRegistrations } = require("./lib/notion");
const { buildRegistrationEmbed, sendWebhook } = require("./lib/discord");
const { sendConfirmationEmail } = require("./lib/email");

const app = express();
app.use(cors());
app.use(express.json());

const TEAM_TYPE = { 1: "Solo", 2: "Duo", 3: "Trio" };

app.post("/api/register", async (req, res) => {
  try {
    const {
      eventName, teamName, leaderName, school,
      email, phone, discordId, teamSize, member2, member3,
    } = req.body;

    if (!DATABASES[eventName]) return res.status(400).json({ error: "Invalid event" });
    if (!teamName || !leaderName || !school) return res.status(400).json({ error: "Missing required fields" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return res.status(400).json({ error: "Invalid email" });
    if (!/^\d{10}$/.test(phone || "")) return res.status(400).json({ error: "Phone must be 10 digits" });
    const size = Number(teamSize);
    if (!size || size < 1 || size > MAX_TEAM_SIZE[eventName]) {
      return res.status(400).json({ error: `Team size must be between 1 and ${MAX_TEAM_SIZE[eventName]}` });
    }

    const total = await countTotalRegistrations();
    const regId = generateRegId(total);
    const data = { regId, eventName, teamName, leaderName, school, email, phone, discordId, teamSize: size, member2, member3 };

    const notionSynced = await createRegistration(DATABASES[eventName], data);

    const emailSent = await sendConfirmationEmail({ to: email, leaderName, eventName, regId });

    const embed = buildRegistrationEmbed({
      regId, eventName, teamName,
      teamType: TEAM_TYPE[size] || `${size} members`,
      leaderName, school, email, phone,
      discordUsername: discordId,
      notionSynced, emailSent,
    });
    await sendWebhook(embed);

    res.json({ success: true, regId, notionSynced, emailSent });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(["/", "/register", "/register.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "register.html"));
});

app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3001;

const requiredEnvVars = ['NOTION_TOKEN', 'BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'DISCORD_WEBHOOK_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn('WARNING: Missing environment variables:', missingEnvVars.join(', '));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
