const { DATABASES, MAX_TEAM_SIZE } = require("../backend/config/databases");
const { generateRegId } = require("../backend/lib/regId");
const { createRegistration, countTotalRegistrations } = require("../backend/lib/notion");
const { buildRegistrationEmbed, sendWebhook } = require("../backend/lib/discord");
const { sendConfirmationEmail } = require("../backend/lib/email");

const TEAM_TYPE = { 1: "Solo", 2: "Duo", 3: "Trio" };

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.status(200).json({ success: true, regId, notionSynced, emailSent });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
