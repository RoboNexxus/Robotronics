const ACCENT_COLOR = 0x5865f2;

interface EmbedInput {
  regId: string;
  eventName: string;
  teamName: string;
  teamType: string;
  leaderName: string;
  school: string;
  email: string;
  phone: string;
  discordUsername?: string;
  notionSynced: boolean;
  emailSent: boolean;
}

export function buildRegistrationEmbed(data: EmbedInput) {
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
          { name: "Registration ID",           value: regId,                              inline: true },
          { name: "Event",                     value: eventName,                          inline: true },
          { name: "Team Type",                 value: teamType,                           inline: true },
          { name: "Team Name",                 value: teamName,                           inline: true },
          { name: "Team Leader",               value: leaderName,                         inline: true },
          { name: "School",                    value: school,                             inline: true },
          { name: "Email",                     value: email,                              inline: true },
          { name: "Phone",                     value: phone,                              inline: true },
          { name: "Discord Username",          value: discordUsername ?? "N/A",           inline: true },
          { name: "Notion Sync Status",        value: notionSynced ? "Synced" : "Failed", inline: true },
          { name: "Confirmation Email Status", value: emailSent ? "Sent" : "Failed",      inline: true },
          { name: "Registration Time",         value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        ],
        footer: { text: "RoboNexus '26" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export async function sendWebhook(embedPayload: object): Promise<boolean> {
  try {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embedPayload),
    });
    return res.ok;
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error("Discord webhook failed:", e.message);
    return false;
  }
}
