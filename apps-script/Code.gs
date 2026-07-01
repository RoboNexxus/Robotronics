function onFormSubmit(e) {
  try {
    const row = getRowFromEvent(e);
    validateRow(row, e);

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
        eventName,
        row[HEADERS.TEAM_NAME],
        row[HEADERS.MEMBER_2],
        row[HEADERS.MEMBER_3]
      );
    } catch (emailError) {
      Logger.log("EMAIL ERROR: " + emailError.message);
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
        discord: row[HEADERS.DISCORD_ID]
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

function getRowFromEvent(e) {
  if (!e || !e.namedValues) {
    throw new Error("getRowFromEvent: e.namedValues missing.");
  }

  const row = {};
  const namedValues = e.namedValues;

  // Build row object from namedValues (keys are trimmed to avoid stray spaces)
  for (const header in namedValues) {
    const cleanHeader = header.trim();
    const value = (namedValues[header][0] || "").toString().trim();
    // Do not overwrite a populated value with an empty one
    if (row[cleanHeader] === undefined || row[cleanHeader] === "") {
      row[cleanHeader] = value;
    }
  }

  // Merge duplicate form fields for Team Size and Member 2
  if (row.hasOwnProperty(HEADERS.TEAM_SIZE + ".1")) {
    // If the primary field is empty, use the secondary
    row[HEADERS.TEAM_SIZE] = row[HEADERS.TEAM_SIZE] || row[HEADERS.TEAM_SIZE + ".1"];
    delete row[HEADERS.TEAM_SIZE + ".1"];
  }
  if (row.hasOwnProperty(HEADERS.MEMBER_2 + ".1")) {
    row[HEADERS.MEMBER_2] = row[HEADERS.MEMBER_2] || row[HEADERS.MEMBER_2 + ".1"];
    delete row[HEADERS.MEMBER_2 + ".1"];
  }

  return row;
}

function generateRegistrationId(e) {
  const rowNumber = e.range.getRow();
  // Row 1 = header, so registration number = rowNumber - 1
  const registrationNumber = rowNumber - 1;
  return "RN-" + registrationNumber.toString().padStart(3, "0");
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
