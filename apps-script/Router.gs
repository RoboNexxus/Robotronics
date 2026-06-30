/**
 * @fileoverview Event routing and row validation utilities.
 *
 * Responsibilities:
 *   - Map a submitted event name to the correct Notion database ID.
 *   - Determine per-event schema capabilities (e.g. member_3 support).
 *   - Validate that a parsed form row contains all required fields before
 *     any Notion call is attempted.
 *
 * All functions are pure (no side effects) so they are trivially testable
 * and can be called from any other file without risk.
 */


/**
 * Returns the Notion database ID that corresponds to the given event name.
 *
 * Performs a strict lookup against the DATABASES registry defined in Config.gs.
 * Leading/trailing whitespace in the event name is normalised before lookup,
 * which guards against accidental spaces in the form response.
 *
 * @param  {string} eventName - The event string from the form submission (e.g. "Robo War Sr.").
 * @return {string} The Notion database ID for that event.
 * @throws {Error}  If eventName is falsy, not a string, or not found in DATABASES.
 *
 * @example
 * const dbId = getDatabaseId("Robo Race");
 * // → "5e0ede80-8c1b-4d92-84bc-29abfc3e7000"
 */
function getDatabaseId(eventName) {
  if (!eventName || typeof eventName !== "string") {
    throw new Error(
      "getDatabaseId: eventName must be a non-empty string. " +
      "Received: " + JSON.stringify(eventName)
    );
  }

  const normalised = eventName.trim();
  const databaseId = DATABASES[normalised];

  if (!databaseId) {
    const validEvents = Object.keys(DATABASES).join(", ");
    throw new Error(
      'getDatabaseId: Unknown event "' + normalised + '". ' +
      "Valid event names are: " + validEvents
    );
  }

  return databaseId;
}


/**
 * Returns true if the given event's Notion database contains the "member_3" property.
 *
 * Robo War (Sr. / Jr.) and Robo Soccer (Sr. / Jr.) include member_3.
 * Robo Race and Line Follower do NOT — their databases lack the column entirely.
 * Sending member_3 to those databases would cause a Notion API 400 error.
 *
 * @param  {string} eventName - The event string from the form submission.
 * @return {boolean} True if member_3 should be included in the Notion payload.
 *
 * @example
 * supportsThirdMember("Robo War Sr.");    // → true
 * supportsThirdMember("Line Follower");   // → false
 */
function supportsThirdMember(eventName) {
  if (!eventName || typeof eventName !== "string") return false;
  return EVENTS_WITH_MEMBER_3.indexOf(eventName.trim()) !== -1;
}


/**
 * Validates that a parsed row object contains all required fields with non-empty values.
 *
 * Called before any API interaction so that incomplete submissions are caught
 * early with a clear, actionable error message rather than a cryptic API failure.
 *
 * Required fields are those that every Notion database expects regardless of event type.
 * Optional fields (Discord ID, Member 2, Member 3) are NOT validated here — they may
 * be blank and are handled gracefully by the payload builder.
 *
 * @param  {Object.<string, string>} row - Key-value object keyed by HEADERS constants.
 * @return {void}
 * @throws {Error} If one or more required fields are missing or contain only whitespace.
 */
function validateRow(row) {
  /** @type {string[]} Fields that must be present and non-empty for every registration. */
  const REQUIRED_FIELDS = [
    HEADERS.EVENT,
    HEADERS.TEAM_LEADER,
    HEADERS.TEAM_NAME,
    HEADERS.SCHOOL,
    HEADERS.EMAIL,
    HEADERS.PHONE,
    HEADERS.TEAM_SIZE
  ];

  const missing = REQUIRED_FIELDS.filter(function(field) {
    const value = row[field];
    return value === undefined || value === null || value.toString().trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(
      "validateRow: The following required fields are missing or empty: " +
      missing.join(", ")
    );
  }
}
