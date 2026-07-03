const ACCENT_COLOR = 0x5865f2;

function buildRegistrationEmbed(data) {
  const {
    regId, eventName, teamName, teamType, leaderName,
    school, email, phone, discordUsername,
    notionSynced, emailSent,
  } = data;

  return {
    embeds: [
      {
        title: "New Event Registration",
        color: ACCENT_COLOR,
        fields: [
          { name: "Registration ID", value: regId, inline: true },
          { name: "Event", value: eventName, inline: true },
          { name: "Team Type", value: teamType, inline: true },

          { name: "Team Name", value: teamName, inline: true },
          { name: "Team Leader", value: leaderName, inline: true },
          { name: "School", value: school, inline: true },

          { name: "Email", value: email, inline: true },
          { name: "Phone", value: phone, inline: true },
          { name: "Discord Username", value: discordUsername || "N/A", inline: true },

          { name: "Notion Sync Status", value: notionSynced ? "Synced" : "Failed", inline: true },
          { name: "Confirmation Email Status", value: emailSent ? "Sent" : "Failed", inline: true },
          { name: "Registration Time", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        ],
        footer: { text: "RoboNexus '26" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

async function sendWebhook(embedPayload) {
  try {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embedPayload),
    });
    return res.ok;
  } catch (err) {
    console.error("Discord webhook failed:", err.message);
    return false;
  }
}

module.exports = { buildRegistrationEmbed, sendWebhook };
