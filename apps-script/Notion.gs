function createNotionPage(databaseId, row, regId) {
  const payload = buildPayload(databaseId, row, regId);
  const response = sendNotionRequest("/pages", payload);
  return response;
}

function sendNotionRequest(endpoint, payload) {
  const url = CONFIG.NOTION_API_BASE + endpoint;

  const options = {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: {
      "Authorization": "Bearer " + CONFIG.NOTION_TOKEN,
      "Notion-Version": CONFIG.NOTION_VERSION
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  const statusCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (statusCode < 200 || statusCode >= 300) {
    throw new Error(
      "[Notion] HTTP " + statusCode +
      " — Endpoint: " + endpoint +
      " — Body: " + responseText
    );
  }

  const parsed = JSON.parse(responseText);

  if (parsed.object === "error") {
    throw new Error(
      "[Notion] API error — code: " +
      parsed.code +
      ", message: " +
      parsed.message
    );
  }

  return parsed;
}

function buildPayload(databaseId, row, regId) {
  const properties = buildBaseProperties(row, regId);

  if (supportsThirdMember(row[HEADERS.EVENT])) {
    properties["member_3"] = makeRichTextProperty(row[HEADERS.MEMBER_3] || "");
  }

  return {
    parent: { database_id: databaseId },
    properties: properties
  };
}

function buildBaseProperties(row, regId) {
  return {
    "Name": makeTitleProperty(row[HEADERS.TEAM_LEADER]),
    "Team Name": makeRichTextProperty(row[HEADERS.TEAM_NAME]),
    "School": makeRichTextProperty(row[HEADERS.SCHOOL]),
    "Email": makeEmailProperty(row[HEADERS.EMAIL]),
    "Phone": makePhoneProperty(row[HEADERS.PHONE]),
    "Discord ID": makeRichTextProperty(row[HEADERS.DISCORD_ID] || ""),
    "Team Size": makeNumberProperty(row[HEADERS.TEAM_SIZE]),
    "member_2": makeRichTextProperty(row[HEADERS.MEMBER_2] || ""),
    "Reg ID": makeRichTextProperty(regId)
  };
}

function makeTitleProperty(value) {
  return {
    title: [{ text: { content: (value || "").trim() } }]
  };
}

function makeRichTextProperty(value) {
  return {
    rich_text: [{ text: { content: (value || "").trim() } }]
  };
}

function makeEmailProperty(value) {
  return {
    email: (value || "").trim()
  };
}

function makePhoneProperty(value) {
  return {
    phone_number: (value || "").trim()
  };
}

function makeNumberProperty(value) {
  const parsed = parseInt(value, 10);

  return {
    number: isNaN(parsed) ? 0 : parsed
  };
}
