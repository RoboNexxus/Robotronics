const { Client } = require("@notionhq/client");
const { DATABASES } = require("../config/databases");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function countDatabase(databaseId) {
  let total = 0;
  let cursor = undefined;
  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    total += res.results.length;
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return total;
}

async function countTotalRegistrations() {
  const counts = await Promise.all(Object.values(DATABASES).map(countDatabase));
  return counts.reduce((sum, n) => sum + n, 0);
}

async function createRegistration(databaseId, data) {
  const {
    regId, eventName, teamName, leaderName, school,
    email, phone, discordId, teamSize, member2, member3
  } = data;

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Name":          { title: [{ text: { content: leaderName } }] },
        "Team Name":     { rich_text: [{ text: { content: teamName } }] },
        "Reg ID":        { rich_text: [{ text: { content: regId } }] },
        "School":        { rich_text: [{ text: { content: school } }] },
        "Email":         { email },
        "Phone":         { phone_number: phone },
        "Discord ID":    { rich_text: [{ text: { content: discordId || "N/A" } }] },
        "Team Size":     { number: Number(teamSize) },
        "member_2":      { rich_text: [{ text: { content: member2 || "" } }] },
        "member_3":      { rich_text: [{ text: { content: member3 || "" } }] },
      },
    });
    return true;
  } catch (err) {
    console.error("Notion sync failed:", err.body || err.message);
    return false;
  }
}

module.exports = { createRegistration, countTotalRegistrations };
