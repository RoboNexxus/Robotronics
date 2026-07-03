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

// Serve static files from the parent directory (Front-end folder)
const path = require("path");
app.use(express.static(path.join(__dirname, "..")));

const TEAM_TYPE = { 1: "Solo", 2: "Duo", 3: "Trio" };

app.post("/api/register", async (req, res) => {
  try {
    const {
      eventName, teamName, leaderName, school,
      email, phone, discordId, teamSize, member2, member3,
    } = req.body;

    // --- validation ---
    if (!DATABASES[eventName]) return res.status(400).json({ error: "Invalid event" });
    if (!teamName || !leaderName || !school) return res.status(400).json({ error: "Missing required fields" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return res.status(400).json({ error: "Invalid email" });
    if (!/^\d{10}$/.test(phone || "")) return res.status(400).json({ error: "Phone must be 10 digits" });
    const size = Number(teamSize);
    if (!size || size < 1 || size > MAX_TEAM_SIZE[eventName]) {
      return res.status(400).json({ error: `Team size must be between 1 and ${MAX_TEAM_SIZE[eventName]}` });
    }

    // Count existing registrations across ALL event databases, then assign the next number.
    // Note: two submissions arriving at the exact same instant could in theory get the
    // same count before either page is created (no lock). Fine for expected volume;
    // swap for a dedicated Notion "Counter" row if you need a hard guarantee.
    const total = await countTotalRegistrations();
    const regId = generateRegId(total);
    const data = { regId, eventName, teamName, leaderName, school, email, phone, discordId, teamSize: size, member2, member3 };

    // --- Notion ---
    const notionSynced = await createRegistration(DATABASES[eventName], data);

    // --- Email (Brevo) ---
    const emailSent = await sendConfirmationEmail({ to: email, leaderName, eventName, regId });

    // --- Discord webhook ---
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
    res.status(500).json({ 
      error: "Internal server error. Please check server logs.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve the registration page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "register.html"));
});

const PORT = process.env.PORT || 3001;

// Check for required environment variables
const requiredEnvVars = ['NOTION_TOKEN', 'BREVO_API_KEY', 'BREVO_SENDER_EMAIL', 'DISCORD_WEBHOOK_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn('\n⚠️  WARNING: Missing environment variables:', missingEnvVars.join(', '));
  console.warn('⚠️  Please set them in your .env file. The server will start but features will fail.\n');
}

app.listen(PORT, () => {
  console.log(`✅ Registration API running on port ${PORT}`);
  if (missingEnvVars.length === 0) {
    console.log('✅ All environment variables configured');
  }
});
