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

function supportsThirdMember(eventName) {
  if (!eventName || typeof eventName !== "string") return false;
  return EVENTS_WITH_MEMBER_3.indexOf(eventName.trim()) !== -1;
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
    return value === undefined || value === null || value.toString().trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(
      "validateRow: The following required fields are missing or empty: " +
      missing.join(", ")
    );
  }
}
