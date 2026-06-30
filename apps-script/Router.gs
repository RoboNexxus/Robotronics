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

function validateRow(row) {
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
    throw new Error(
      "validateRow: The following required fields are missing or empty: " +
      missing.join(", ")
    );
  }
}
