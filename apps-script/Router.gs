function normalizeEventName(eventName) {
  if (!eventName || typeof eventName !== "string") {
    throw new Error(
      "normalizeEventName: eventName must be a non-empty string. " +
      "Received: " + JSON.stringify(eventName)
    );
  }

  return eventName
    .trim()
    // Remove everything after the first (
    .replace(/\s*\(.*$/, "")
    .trim();
}

function getDatabaseId(eventName) {
  const normalised = normalizeEventName(eventName);
  const databaseId = DATABASES[normalised];

  if (!databaseId) {
    const validEvents = Object.keys(DATABASES).join(", ");
    throw new Error(
      'getDatabaseId: Unknown event "' +
      eventName +
      '". Valid event names are: ' +
      validEvents
    );
  }

  return databaseId;
}

function supportsThirdMember(eventName) {
  const normalised = normalizeEventName(eventName);
  return EVENTS_WITH_MEMBER_3.includes(normalised);
}

function validateRow(row, e) {
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
    return (
      value === undefined ||
      value === null ||
      value.toString().trim() === ""
    );
  });

  if (missing.length > 0) {
    // Dump the raw column headers actually received from the form
    // response. If a required field is "missing" but the user did
    // answer it, the real header text almost always differs (extra
    // space, different wording per section, etc.) from what's in
    // Config.gs HEADERS — this log tells you exactly what it is.
    const rawKeys = (e && e.namedValues) ? Object.keys(e.namedValues) : [];

    throw new Error(
      "validateRow: The following required fields are missing or empty: " +
      missing.join(", ") +
      ". Raw form column headers received: [" + rawKeys.join(" | ") + "]"
    );
  }

  // Cross-field check: if team size says 2+, Member 2 should actually
  // be filled in (catches a separate class of "silently missing" bug).
  const teamSize = parseInt(row[HEADERS.TEAM_SIZE], 10);
  if (teamSize >= 2 && !(row[HEADERS.MEMBER_2] || "").trim()) {
    throw new Error(
      "validateRow: Team Size is " + row[HEADERS.TEAM_SIZE] +
      " but Member 2 Full Name is empty."
    );
  }
  if (teamSize >= 3 && supportsThirdMember(row[HEADERS.EVENT]) &&
      !(row[HEADERS.MEMBER_3] || "").trim()) {
    throw new Error(
      "validateRow: Team Size is " + row[HEADERS.TEAM_SIZE] +
      " but Member 3 Full Name is empty."
    );
  }
}
