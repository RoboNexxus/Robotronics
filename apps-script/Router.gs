function normalizeEventName(eventName) {
  if (!eventName || typeof eventName !== "string") {
    throw new Error(
      "normalizeEventName: eventName must be a non-empty string. " +
      "Received: " + JSON.stringify(eventName)
    );
  }

  return eventName
    .trim()
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
    const rawKeys = (e && e.namedValues) ? Object.keys(e.namedValues) : [];
    throw new Error(
      "validateRow: Missing required fields: " +
      missing.join(", ") +
      ". Raw headers: [" +
      rawKeys.join(" | ") +
      "]"
    );
  }

  // -----------------------------
  // Normalize Team Size
  // -----------------------------
  const rawTeamSize = row[HEADERS.TEAM_SIZE].toString().trim();

  let teamSize = 0;
  if (rawTeamSize.startsWith("1")) {
    teamSize = 1;
  } else if (rawTeamSize.startsWith("2")) {
    teamSize = 2;
  } else if (rawTeamSize.startsWith("3")) {
    teamSize = 3;
  } else {
    throw new Error(
      'validateRow: Invalid Team Size "' +
      rawTeamSize +
      '".'
    );
  }

  // -----------------------------
  // Event validation
  // -----------------------------
  const event = normalizeEventName(row[HEADERS.EVENT]);
  const maxMembers = supportsThirdMember(event) ? 3 : 2;

  if (teamSize > maxMembers) {
    throw new Error(
      '"' +
      event +
      '" allows a maximum of ' +
      maxMembers +
      " team members."
    );
  }

  // -----------------------------
  // Member validation
  // -----------------------------
  const member2 = (row[HEADERS.MEMBER_2] || "").trim();
  const member3 = (row[HEADERS.MEMBER_3] || "").trim();

  if (teamSize >= 2 && member2 === "") {
    throw new Error(
      "Member 2 Full Name is required for a " +
      teamSize +
      "-member team."
    );
  }

  if (teamSize === 3 && member3 === "") {
    throw new Error(
      "Member 3 Full Name is required for a 3-member team."
    );
  }

  // Prevent extra member names when not allowed
  if (teamSize === 1 && (member2 || member3)) {
    throw new Error(
      "Do not enter additional member names for a 1-member team."
    );
  }
  if (teamSize === 2 && member3) {
    throw new Error(
      "Member 3 should be left empty for a 2-member team."
    );
  }
}
