function onFormSubmit(e) {
  try {
    const row        = getRowFromEvent(e);
    validateRow(row);

    const eventName  = row[HEADERS.EVENT].trim();
    const databaseId = getDatabaseId(eventName);
    const notionPage = createNotionPage(databaseId, row);

    Logger.log("Registration complete. Team: " + row[HEADERS.TEAM_NAME] + " | Notion page ID: " + notionPage.id);
  } catch (error) {
    Logger.log("FATAL ERROR: " + error.message);
    throw error;
  }
}

function getRowFromEvent(e) {
  if (!e || !e.namedValues) {
    throw new Error(
      "getRowFromEvent: e.namedValues is missing. " +
      "Ensure this runs from an installable Form Submit trigger. Run installTrigger() first."
    );
  }

  const row         = {};
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

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger(HANDLER)
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();

  Logger.log("Trigger installed for: " + HANDLER + " on spreadsheet: " + spreadsheet.getName());
}
