/**
 * @fileoverview Main entry point for the Robotronics 2026 Registration System.
 *
 * This file is intentionally thin — it orchestrates calls to Router.gs and Notion.gs
 * rather than containing any business logic itself. All parsing, validation, routing,
 * and API interaction live in their respective modules.
 *
 * ─────────────────────────────────────────────────────────────
 * EXECUTION FLOW (Phase 1)
 * ─────────────────────────────────────────────────────────────
 *
 *   Google Form submit
 *       └─► onFormSubmit(e)
 *               ├─ getRowFromEvent(e)       → parse namedValues into {header: value}
 *               ├─ validateRow(row)         → check required fields [Router.gs]
 *               ├─ getDatabaseId(event)     → resolve Notion database [Router.gs]
 *               └─ createNotionPage(id, row)→ POST to Notion API    [Notion.gs]
 *
 * ─────────────────────────────────────────────────────────────
 * PHASE 2 EXTENSION POINTS (stubs included below)
 * ─────────────────────────────────────────────────────────────
 *   - generateRegistrationId(row)    → unique ID per team
 *   - sendConfirmationEmail(row, id) → email to team leader
 *   - sendDiscordNotification(row)   → webhook to Discord channel
 *   - generateAndAttachQrCode(id)    → QR code generation + storage
 * ─────────────────────────────────────────────────────────────
 */


// ─────────────────────────────────────────────────────────────
// TRIGGER HANDLER
// ─────────────────────────────────────────────────────────────

/**
 * Installable trigger handler — fires automatically when a Google Form linked
 * to this spreadsheet receives a new submission.
 *
 * IMPORTANT: This must be installed as an *installable* trigger, not a simple
 * trigger. Run installTrigger() once from the Apps Script editor to set it up.
 * Simple triggers (auto-detected by function name) cannot call external services
 * like UrlFetchApp and will silently fail.
 *
 * @param {GoogleAppsScript.Events.SheetsOnFormSubmit} e - Apps Script form submit event.
 *   Key properties used:
 *     e.namedValues  {Object.<string, string[]>} — column headers mapped to value arrays.
 */
function onFormSubmit(e) {
  try {
    Logger.log("──────────────────────────────────────");
    Logger.log("[onFormSubmit] New submission received.");

    // ── Step 1: Parse the event into a flat header-keyed object ──────────
    const row = getRowFromEvent(e);
    Logger.log("[onFormSubmit] Row parsed. Event = \"" + row[HEADERS.EVENT] + "\", Leader = \"" + row[HEADERS.TEAM_LEADER] + "\"");

    // ── Step 2: Validate all required fields before touching any API ──────
    validateRow(row);
    Logger.log("[onFormSubmit] Row validation passed.");

    // ── Step 3: Resolve the correct Notion database for this event ────────
    const eventName  = row[HEADERS.EVENT].trim();
    const databaseId = getDatabaseId(eventName);
    Logger.log("[onFormSubmit] Resolved database ID: " + databaseId);

    // ── Step 4: Create the Notion registration page ───────────────────────
    const notionPage = createNotionPage(databaseId, row);
    Logger.log("[onFormSubmit] Notion page created successfully. Page ID: " + notionPage.id);

    // ── PHASE 2 STUBS ─────────────────────────────────────────────────────
    // Uncomment each block as the corresponding phase is implemented.
    //
    // const registrationId = generateRegistrationId(row);
    // Logger.log("[onFormSubmit] Registration ID: " + registrationId);
    //
    // sendConfirmationEmail(row, registrationId);
    // Logger.log("[onFormSubmit] Confirmation email sent.");
    //
    // sendDiscordNotification(row, registrationId);
    // Logger.log("[onFormSubmit] Discord notification sent.");
    //
    // generateAndAttachQrCode(registrationId);
    // Logger.log("[onFormSubmit] QR code generated.");
    // ─────────────────────────────────────────────────────────────────────

    Logger.log("[onFormSubmit] Registration complete for team \"" + row[HEADERS.TEAM_NAME] + "\".");
    Logger.log("──────────────────────────────────────");

  } catch (error) {
    Logger.log("[onFormSubmit] FATAL ERROR: " + error.message);
    Logger.log("──────────────────────────────────────");
    // Re-throw so Apps Script marks this execution as failed, making it
    // visible in the Executions dashboard for manual review.
    throw error;
  }
}


// ─────────────────────────────────────────────────────────────
// ROW PARSER
// ─────────────────────────────────────────────────────────────

/**
 * Converts the Apps Script form submit event's namedValues into a flat
 * key → value object, keyed by the exact Google Sheet header strings.
 *
 * Why namedValues instead of e.values?
 *   e.values is a positional array — its meaning depends on column order.
 *   If the sheet ever gains a new column or columns are rearranged, e.values
 *   silently breaks. e.namedValues is always keyed by header name and is
 *   therefore order-independent and far more resilient.
 *
 * namedValues maps each header to a string[] (always length 1 for form data).
 * We unwrap index [0] here so all downstream code works with plain strings.
 *
 * @param  {GoogleAppsScript.Events.SheetsOnFormSubmit} e - The form submit event.
 * @return {Object.<string, string>} Flat object: { "Team Name": "Voltage Warriors", ... }
 * @throws {Error} If e.namedValues is absent, indicating a wrong trigger type.
 */
function getRowFromEvent(e) {
  if (!e || !e.namedValues) {
    throw new Error(
      "[getRowFromEvent] e.namedValues is missing. " +
      "This function must be called from an installable Form Submit trigger. " +
      "Run installTrigger() to set it up, then resubmit the form."
    );
  }

  const row         = {};
  const namedValues = e.namedValues;

  for (const header in namedValues) {
    // namedValues[header] is always a single-element array for form submissions.
    row[header] = (namedValues[header][0] || "").toString();
  }

  return row;
}


// ─────────────────────────────────────────────────────────────
// TRIGGER INSTALLER
// ─────────────────────────────────────────────────────────────

/**
 * Creates the installable "On Form Submit" trigger that powers this system.
 *
 * Run this function ONCE manually via:
 *   Apps Script Editor → select "installTrigger" in the dropdown → click Run
 *
 * It is safe to run multiple times: any existing onFormSubmit triggers are
 * deleted first to prevent duplicate executions on a single submission.
 *
 * After running, confirm the trigger exists at:
 *   Apps Script Editor → Triggers (alarm clock icon, left sidebar)
 *
 * @return {void}
 */
function installTrigger() {
  const HANDLER = "onFormSubmit";

  // Remove any pre-existing triggers for this handler to avoid duplicates.
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === HANDLER) {
      ScriptApp.deleteTrigger(trigger);
      Logger.log("[installTrigger] Removed stale trigger for: " + HANDLER);
    }
  });

  // Install a fresh spreadsheet-bound form submit trigger.
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger(HANDLER)
    .forSpreadsheet(spreadsheet)
    .onFormSubmit()
    .create();

  Logger.log(
    "[installTrigger] Trigger installed. Handler: \"" + HANDLER + "\" " +
    "→ Spreadsheet: \"" + spreadsheet.getName() + "\""
  );
}


// ─────────────────────────────────────────────────────────────
// PHASE 2 STUBS
// These functions intentionally throw so that uncommenting a call
// in onFormSubmit() above immediately surfaces "not yet implemented"
// rather than silently doing nothing.
// ─────────────────────────────────────────────────────────────

/**
 * [PHASE 2 STUB] Generates a unique registration ID for a team.
 *
 * @param  {Object.<string,string>} row - Parsed form row.
 * @return {string} A unique registration ID string.
 * @throws {Error}  Always — not yet implemented.
 */
function generateRegistrationId(row) { // eslint-disable-line no-unused-vars
  throw new Error("[generateRegistrationId] Not yet implemented (Phase 2).");
}

/**
 * [PHASE 2 STUB] Sends a confirmation email to the team leader.
 *
 * @param  {Object.<string,string>} row - Parsed form row.
 * @param  {string} registrationId      - Generated registration ID.
 * @return {void}
 * @throws {Error}  Always — not yet implemented.
 */
function sendConfirmationEmail(row, registrationId) { // eslint-disable-line no-unused-vars
  throw new Error("[sendConfirmationEmail] Not yet implemented (Phase 2).");
}

/**
 * [PHASE 2 STUB] Posts a notification to the Discord webhook.
 *
 * @param  {Object.<string,string>} row - Parsed form row.
 * @param  {string} registrationId      - Generated registration ID.
 * @return {void}
 * @throws {Error}  Always — not yet implemented.
 */
function sendDiscordNotification(row, registrationId) { // eslint-disable-line no-unused-vars
  throw new Error("[sendDiscordNotification] Not yet implemented (Phase 2).");
}

/**
 * [PHASE 2 STUB] Generates a QR code for the given registration ID.
 *
 * @param  {string} registrationId - Generated registration ID.
 * @return {void}
 * @throws {Error}  Always — not yet implemented.
 */
function generateAndAttachQrCode(registrationId) { // eslint-disable-line no-unused-vars
  throw new Error("[generateAndAttachQrCode] Not yet implemented (Phase 2).");
}
