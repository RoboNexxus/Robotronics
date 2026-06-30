/**
 * @fileoverview Global configuration for the Robotronics 2026 Registration System.
 *
 * ─────────────────────────────────────────────────────────────
 * INSTRUCTIONS FOR MAINTAINERS
 * ─────────────────────────────────────────────────────────────
 * The ONLY value you ever need to change is NOTION_TOKEN inside CONFIG.
 * Everything else (database IDs, header names, event lists) is intentionally
 * centralised here so the rest of the codebase never contains magic strings.
 * ─────────────────────────────────────────────────────────────
 *
 * PHASE 2 EXTENSION POINTS (add keys to CONFIG when ready):
 *   DISCORD_WEBHOOK_URL  — for Discord notifications
 *   SENDER_EMAIL         — for confirmation emails
 *   REG_ID_PREFIX        — for registration ID generation
 */

// ─────────────────────────────────────────────────────────────
// SYSTEM CONFIGURATION
// ─────────────────────────────────────────────────────────────

/**
 * Global system configuration object.
 * Edit NOTION_TOKEN before deploying.
 *
 * @const {Object}
 * @property {string} NOTION_TOKEN   - Your Notion Internal Integration token.
 * @property {string} NOTION_VERSION - Notion API version header (do not change).
 * @property {string} NOTION_API_BASE - Base URL for all Notion API calls.
 */
const CONFIG = {
  NOTION_TOKEN:    "PUT_TOKEN_HERE",
  NOTION_VERSION:  "2022-06-28",
  NOTION_API_BASE: "https://api.notion.com/v1"
};


// ─────────────────────────────────────────────────────────────
// NOTION DATABASE REGISTRY
// ─────────────────────────────────────────────────────────────

/**
 * Maps each event name (exactly as it appears in the Google Form dropdown)
 * to its corresponding Notion database ID.
 *
 * To add a new event in the future:
 *   1. Add the event to the Google Form dropdown.
 *   2. Create the Notion database.
 *   3. Add an entry here.
 *   4. If the database includes member_3, add the event name to EVENTS_WITH_MEMBER_3.
 *
 * @const {Object.<string, string>}
 */
const DATABASES = {
  "Robo War Sr.":    "723ea79c-8931-405e-9342-696f47b81e68",
  "Robo War Jr.":    "eaae9253-7b87-4a7b-b147-ad18cf8ae5b1",
  "Robo Soccer Sr.": "437ef7d5-38b5-4a15-8b46-d0ac0308f369",
  "Robo Soccer Jr.": "df101e06-82e7-4c06-a17d-2b5d417d8bfc",
  "Robo Race":       "5e0ede80-8c1b-4d92-84bc-29abfc3e7000",
  "Line Follower":   "fe308409-3690-41c5-b59f-77dc1f2fcdc0"
};

/**
 * Subset of events whose Notion databases contain the "member_3" property.
 * Robo Race and Line Follower databases do NOT have this column — they are
 * intentionally excluded and will silently omit member_3 from the payload.
 *
 * @const {string[]}
 */
const EVENTS_WITH_MEMBER_3 = [
  "Robo War Sr.",
  "Robo War Jr.",
  "Robo Soccer Sr.",
  "Robo Soccer Jr."
];


// ─────────────────────────────────────────────────────────────
// GOOGLE SHEET HEADER REGISTRY
// ─────────────────────────────────────────────────────────────

/**
 * Canonical header names as they appear in the Google Sheet (Form Responses sheet).
 * ALL field access throughout the codebase MUST go through these constants —
 * never use raw string literals or column indexes.
 *
 * If a header is renamed in the Google Form, update it here and nowhere else.
 *
 * @const {Object.<string, string>}
 */
const HEADERS = {
  TIMESTAMP:   "Timestamp",
  EVENT:       "Event",
  TEAM_NAME:   "Team Name",
  TEAM_LEADER: "Team Leader",
  SCHOOL:      "School",
  EMAIL:       "Email",
  PHONE:       "Phone",
  DISCORD_ID:  "Discord ID",
  TEAM_SIZE:   "Team Size",
  MEMBER_2:    "Member 2 Full Name",
  MEMBER_3:    "Member 3 Full Name"
};
