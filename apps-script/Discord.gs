function sendDiscordWebhook(data) {

  const now = Utilities.formatDate(
    new Date(),
    "Asia/Kolkata",
    "dd MMM yyyy • HH:mm:ss"
  );

  const description =
"```txt\n" +

"──────────────────────────────────────────────\n\n" +

`ID          ${data.regId}\n` +
`EVENT       ${data.event}\n` +
`TEAM        ${data.teamName}\n` +
`TYPE        ${data.teamType}\n\n` +

"──────────────────────────────────────────────\n\n" +

`LEADER      ${data.name}\n` +
`SCHOOL      ${data.school}\n\n` +

`EMAIL       ${data.email}\n` +
`PHONE       ${data.phone}\n` +
`DISCORD     ${data.discord || "N/A"}\n\n` +

"──────────────────────────────────────────────\n\n" +

"NOTION      Synced\n" +
"EMAIL       Sent\n\n" +

`${now}\n` +

"```";

  const payload = {
    username: "RoboNexus Operations",

    embeds: [{
      title: "NEW REGISTRATION",
      description: description,

      color: 0x5865F2,

      footer: {
        text: "RoboNexus '26"
      },

      timestamp: new Date().toISOString()
    }]
  };

  UrlFetchApp.fetch(CONFIG.DISCORD_WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });

}
