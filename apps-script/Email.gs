function sendRegistrationEmail(leaderName, recipientEmail, regId) {

  const template = HtmlService.createTemplateFromFile("RegistrationEmail");

  template.leader_name = leaderName;
  template.reg_id = regId;

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

Thank you for registering for Robotronics.

Registration ID

${regId}

Join Discord

https://discord.gg/HfzJZHJNxK

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
      "api-key": CONFIG.BREVO_API_KEY
    },

    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(
    "https://api.brevo.com/v3/smtp/email",
    options
  );

  if (response.getResponseCode() >= 300) {
    throw new Error(
      "Brevo Error\n\n" +
      response.getContentText()
    );
  }

  Logger.log("Email sent to " + recipientEmail);
}
