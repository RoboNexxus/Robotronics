function onFormSubmit(e) {
  try {
    const row = getRowFromEvent(e);
    validateRow(row);

    const eventName = row[HEADERS.EVENT].trim();
    const databaseId = getDatabaseId(eventName);
    const regId = generateRegistrationId(e);

    const notionPage = createNotionPage(databaseId, row, regId);

    // Send confirmation email
    try {
      sendRegistrationEmail(
        row[HEADERS.TEAM_LEADER],
        row[HEADERS.EMAIL],
        regId,
        eventName
      );
    } catch (mailError) {
      Logger.log("EMAIL ERROR: " + mailError.message);
    }

  // Send Discord notification
  try {
    sendDiscordWebhook({
      event: eventName,
      regId: regId,
      name: row[HEADERS.TEAM_LEADER],
      teamName: row[HEADERS.TEAM_NAME],
      teamType: row[HEADERS.TEAM_SIZE],
      school: row[HEADERS.SCHOOL],
      email: row[HEADERS.EMAIL],
      phone: row[HEADERS.PHONE],
      discord: ""
    });
  } catch (discordError) {
    Logger.log("DISCORD ERROR: " + discordError.message);
  }

    Logger.log(
      "Registration complete. Team: " +
      row[HEADERS.TEAM_NAME] +
      " | Reg ID: " +
      regId +
      " | Notion page ID: " +
      notionPage.id
    );

  } catch (error) {
    Logger.log("FATAL ERROR: " + error.message);
    throw error;
  }
}

function generateRegistrationId(e) {
  const rowNumber = e.range.getRow();

  // Row 1 = header
  // Row 2 = RN-001
  const registrationNumber = rowNumber - 1;

  return "RN-" + registrationNumber.toString().padStart(3, "0");
}

function getRowFromEvent(e) {
  if (!e || !e.namedValues) {
    throw new Error("getRowFromEvent: e.namedValues missing.");
  }

  const row = {};
  const namedValues = e.namedValues;

  for (const header in namedValues) {
    row[header] = (namedValues[header][0] || "").toString();
  }

  return row;
}

function installTrigger() {
  const HANDLER = "onFormSubmit";

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === HANDLER) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger(HANDLER)
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();

  Logger.log("Trigger Installed");
}
