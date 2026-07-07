function sendRegistrationEmail(leaderName, recipientEmail, regId, eventName) {

  const template = HtmlService.createTemplateFromFile("RegistrationEmail");

  template.leader_name = leaderName;
  template.reg_id = regId;
  template.event_name = eventName;

  const htmlBody = template.evaluate().getContent();

  const payload = {
    sender: {
      name: CONFIG.BREVO_SENDER_NAME,
      email: CONFIG.BREVO_SENDER_EMAIL
    },

    to: [
      {
        email: recipientEmail,
        name: leaderName
      }
    ],

    subject: "Registration Confirmed | Robotronics",

    htmlContent: htmlBody,

    textContent:
`Hello ${leaderName},

Thank you for registering for ${eventName}.

Registration ID

${regId}

Join Discord

https://discord.gg/PSnanAxagX

Verify yourself

~rn ${regId}~

Run this command after joining the Discord server to verify your registration.

— Team Robo Nexus`
  };

  const options = {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,

    headers: {
      "accept": "application/json",
      "api-key": CONFIG.BREVO_API_KEY
    },

    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(
    "https://api.brevo.com/v3/smtp/email",
    options
  );

  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code >= 200 && code < 300) {
    Logger.log("Email sent successfully to " + recipientEmail);
    return;
  }

  Logger.log("Brevo Error:");
  Logger.log(body);
}
