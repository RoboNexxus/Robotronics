/**
 * @fileoverview Notion API integration layer.
 *
 * Responsibilities:
 *   - Build a well-formed Notion "Create Page" payload from a parsed form row.
 *   - Send authenticated HTTP requests to the Notion API via UrlFetchApp.
 *   - Surface clear, structured errors for every possible failure mode.
 *
 * Public surface (called by Code.gs):
 *   createNotionPage(databaseId, row)
 *
 * Internal helpers (not called externally):
 *   sendNotionRequest(endpoint, payload)
 *   buildPayload(databaseId, row)
 *   buildBaseProperties(row)
 *   makeTitleProperty(value)
 *   makeRichTextProperty(value)
 *   makeEmailProperty(value)
 *   makePhoneProperty(value)
 *   makeNumberProperty(value)
 */


// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Creates a new registration page in the specified Notion database.
 *
 * This is the single public function that Code.gs calls. All payload
 * construction and HTTP logic is encapsulated beneath this boundary.
 *
 * @param  {string}              databaseId - Notion database ID (from Router.gs).
 * @param  {Object.<string,string>} row     - Parsed form row keyed by HEADERS constants.
 * @return {Object} The full Notion API response object for the newly created page.
 * @throws {Error}  Propagates any error from buildPayload or sendNotionRequest.
 *
 * @example
 * const page = createNotionPage("723ea79c-...", row);
 * Logger.log(page.id); // Notion page ID
 */
function createNotionPage(databaseId, row) {
  const payload  = buildPayload(databaseId, row);
  const response = sendNotionRequest("/pages", payload);
  return response;
}


// ─────────────────────────────────────────────────────────────
// HTTP LAYER
// ─────────────────────────────────────────────────────────────

/**
 * Sends a POST request to the Notion API and returns the parsed JSON response.
 *
 * muteHttpExceptions is set to true so that we can inspect non-2xx responses
 * ourselves and surface a meaningful error rather than a generic Apps Script one.
 *
 * @param  {string} endpoint - API path, e.g. "/pages". Appended to NOTION_API_BASE.
 * @param  {Object} payload  - Request body as a plain JS object (will be JSON-stringified).
 * @return {Object} Parsed Notion API JSON response.
 * @throws {Error}  On any HTTP failure or if the Notion response body signals an error.
 */
function sendNotionRequest(endpoint, payload) {
  const url = CONFIG.NOTION_API_BASE + endpoint;

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method:          "post",
    contentType:     "application/json",
    muteHttpExceptions: true,
    headers: {
      "Authorization":  "Bearer " + CONFIG.NOTION_TOKEN,
      "Notion-Version": CONFIG.NOTION_VERSION
    },
    payload: JSON.stringify(payload)
  };

  Logger.log("[Notion] POST " + url);

  const response     = UrlFetchApp.fetch(url, options);
  const statusCode   = response.getResponseCode();
  const responseText = response.getContentText();

  Logger.log("[Notion] Response status: " + statusCode);

  // Surface HTTP-level failures with the raw body for debugging.
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error(
      "[Notion] HTTP " + statusCode + " from Notion API. " +
      "Endpoint: " + endpoint + ". " +
      "Body: " + responseText
    );
  }

  const parsed = JSON.parse(responseText);

  // Notion signals application-level errors via { "object": "error" } even
  // on certain 2xx responses (rare, but guard against it).
  if (parsed.object === "error") {
    throw new Error(
      "[Notion] API error — code: " + parsed.code + ", message: " + parsed.message
    );
  }

  return parsed;
}


// ─────────────────────────────────────────────────────────────
// PAYLOAD BUILDER
// ─────────────────────────────────────────────────────────────

/**
 * Assembles the complete Notion "Create Page" request body for a registration.
 *
 * member_3 is conditionally appended only for events that support it.
 * This keeps the function decoupled from hard-coded event logic — that
 * decision is delegated to supportsThirdMember() in Router.gs.
 *
 * @param  {string}              databaseId - Notion database ID.
 * @param  {Object.<string,string>} row     - Parsed form row.
 * @return {Object} Notion API "Create Page" payload ready to be JSON-stringified.
 */
function buildPayload(databaseId, row) {
  const properties = buildBaseProperties(row);

  // Conditionally include member_3 only for databases that have the property.
  if (supportsThirdMember(row[HEADERS.EVENT])) {
    properties["member_3"] = makeRichTextProperty(row[HEADERS.MEMBER_3] || "");
  }

  return {
    parent:     { database_id: databaseId },
    properties: properties
  };
}


/**
 * Builds the Notion properties object shared by ALL events.
 *
 * member_3 is intentionally excluded here — it is added conditionally
 * in buildPayload() so this function remains free of branching logic.
 *
 * Property names (e.g. "Team Name", "member_2") must match the Notion
 * database column names exactly, including capitalisation.
 *
 * @param  {Object.<string,string>} row - Parsed form row.
 * @return {Object} Notion properties object for all shared fields.
 */
function buildBaseProperties(row) {
  return {
    // "Name" is the mandatory Notion title property — maps to Team Leader.
    "Name":       makeTitleProperty(row[HEADERS.TEAM_LEADER]),

    "Team Name":  makeRichTextProperty(row[HEADERS.TEAM_NAME]),
    "School":     makeRichTextProperty(row[HEADERS.SCHOOL]),
    "Email":      makeEmailProperty(row[HEADERS.EMAIL]),
    "Phone":      makePhoneProperty(row[HEADERS.PHONE]),
    "Discord ID": makeRichTextProperty(row[HEADERS.DISCORD_ID] || ""),
    "Team Size":  makeNumberProperty(row[HEADERS.TEAM_SIZE]),
    "member_2":   makeRichTextProperty(row[HEADERS.MEMBER_2] || "")
  };
}


// ─────────────────────────────────────────────────────────────
// NOTION PROPERTY CONSTRUCTORS
// Each returns a single well-typed Notion property value object.
// ─────────────────────────────────────────────────────────────

/**
 * Creates a Notion `title` property value.
 * Every Notion database has exactly one title property (here: "Name").
 *
 * @param  {string} value - Raw string value.
 * @return {{ title: Array<{text: {content: string}}> }}
 */
function makeTitleProperty(value) {
  return {
    title: [
      { text: { content: (value || "").trim() } }
    ]
  };
}


/**
 * Creates a Notion `rich_text` property value.
 * Used for plain text fields (Team Name, School, Discord ID, member_2, member_3).
 *
 * @param  {string} value - Raw string value.
 * @return {{ rich_text: Array<{text: {content: string}}> }}
 */
function makeRichTextProperty(value) {
  return {
    rich_text: [
      { text: { content: (value || "").trim() } }
    ]
  };
}


/**
 * Creates a Notion `email` property value.
 *
 * @param  {string} value - Email address string.
 * @return {{ email: string }}
 */
function makeEmailProperty(value) {
  return {
    email: (value || "").trim()
  };
}


/**
 * Creates a Notion `phone_number` property value.
 *
 * @param  {string} value - Phone number string (any format Notion accepts).
 * @return {{ phone_number: string }}
 */
function makePhoneProperty(value) {
  return {
    phone_number: (value || "").trim()
  };
}


/**
 * Creates a Notion `number` property value.
 * Safely parses the input as an integer; defaults to 0 if parsing fails.
 *
 * @param  {string|number} value - Raw value from the form (Team Size).
 * @return {{ number: number }}
 */
function makeNumberProperty(value) {
  const parsed = parseInt(value, 10);
  return {
    number: isNaN(parsed) ? 0 : parsed
  };
}
