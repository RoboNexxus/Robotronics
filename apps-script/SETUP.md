# Robotronics 2026 — Apps Script Setup Guide

## Folder Structure

```
apps-script/
├── Config.gs   — NOTION_TOKEN, DATABASES, EVENTS_WITH_MEMBER_3, HEADERS
├── Router.gs   — getDatabaseId(), supportsThirdMember(), validateRow()
├── Notion.gs   — createNotionPage(), sendNotionRequest(), buildPayload(), property constructors
├── Code.gs     — onFormSubmit(), getRowFromEvent(), installTrigger(), Phase 2 stubs
└── SETUP.md    — this file
```

---

## Prerequisites

| What | Where |
|---|---|
| Google Form | Already created and linked to a Google Sheet |
| Google Sheet | Form responses tab must have the exact headers listed below |
| Notion Integration | Created at https://www.notion.so/my-integrations |
| Notion databases | Each database shared with your integration (Share → Invite) |

### Required Google Sheet Headers (exact spelling, case-sensitive)

```
Timestamp | Event | Team Name | Team Leader | School | Email | Phone | Discord ID | Team Size | Member 2 Full Name | Member 3 Full Name
```

---

## Step 1 — Open Apps Script

1. Open your **Google Sheet** (the one receiving form responses).
2. Click **Extensions → Apps Script**.
3. The script editor opens. You will see a default `Code.gs` file.

---

## Step 2 — Create the Four Script Files

In the Apps Script editor:

### 2a. Rename the default file
- Click the three dots next to `Code.gs` → **Rename** → type `Code` (Apps Script appends `.gs` automatically).
- Paste the contents of `Code.gs` into it.

### 2b. Add the remaining three files
For each of `Config`, `Router`, and `Notion`:

1. Click the **+** button next to "Files" in the left sidebar.
2. Choose **Script**.
3. Name the file (e.g. `Config`).
4. Delete the placeholder `function myFunction() {}`.
5. Paste the full contents of the corresponding `.gs` file.

Your file list should look like:
```
Code.gs
Config.gs
Notion.gs
Router.gs
```

> **Order does not matter.** All `.gs` files share a single global scope in Apps Script.

---

## Step 3 — Set Your Notion Token

1. Open `Config.gs` in the editor.
2. Replace `PUT_TOKEN_HERE` with your actual Notion integration token:

```javascript
const CONFIG = {
  NOTION_TOKEN: "secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ...
};
```

3. Save the file (`Cmd+S` / `Ctrl+S`).

### How to get a Notion token
1. Go to https://www.notion.so/my-integrations
2. Click **New Integration**.
3. Name it `Robotronics 2026`, select your workspace, submit.
4. Copy the **Internal Integration Token** (starts with `secret_`).

### Share each database with the integration
For every Notion database listed in `DATABASES`:
1. Open the database in Notion.
2. Click **Share** (top right).
3. Click **Invite** → search for `Robotronics 2026` → select it.
4. Set permission to **Can edit**.

---

## Step 4 — Install the Trigger

The trigger must be *installable* (not a simple trigger) because `UrlFetchApp`
(used to call the Notion API) requires explicit authorization.

1. In the Apps Script editor, select **`installTrigger`** in the function dropdown.
2. Click **Run**.
3. Approve the OAuth permissions dialog (Google will ask you to allow access to
   Sheets and external services).
4. Check the trigger was created:
   - Click the **Triggers** icon (alarm clock) in the left sidebar.
   - You should see: `onFormSubmit | From spreadsheet | On form submit`

> Running `installTrigger()` again is safe — it removes any duplicate triggers first.

---

## Step 5 — Test the Integration

### Method A — Submit a real form response
1. Open your Google Form.
2. Submit a test entry with a valid event name (e.g. `Robo Race`).
3. In the Apps Script editor, go to **Executions** (left sidebar).
4. Find the most recent execution of `onFormSubmit`.
5. Expand the log to see each step and confirm the Notion page ID appears.
6. Open the corresponding Notion database and verify the record is there.

### Method B — Simulate a submission in the editor
1. Paste this helper at the bottom of `Code.gs` temporarily:

```javascript
function testSubmit() {
  const fakeEvent = {
    namedValues: {
      "Timestamp":          ["6/30/2026 10:00:00"],
      "Event":              ["Robo Race"],
      "Team Name":          ["Voltage Warriors"],
      "Team Leader":        ["Atharv Mandlavdiya"],
      "School":             ["Example High School"],
      "Email":              ["atharv@example.com"],
      "Phone":              ["9876543210"],
      "Discord ID":         ["atharv#0001"],
      "Team Size":          ["2"],
      "Member 2 Full Name": ["Riya Shah"],
      "Member 3 Full Name": [""]
    }
  };
  onFormSubmit(fakeEvent);
}
```

2. Select `testSubmit` in the function dropdown and click **Run**.
3. Check the **Execution Log** at the bottom and the **Executions** tab for results.
4. Delete or comment out `testSubmit` after testing.

---

## Error Reference

| Error Message | Cause | Fix |
|---|---|---|
| `e.namedValues is missing` | Ran `onFormSubmit` directly instead of via trigger | Use `testSubmit()` or submit the form |
| `Unknown event "..."` | Event name in form doesn't match `DATABASES` key | Check for typos/trailing spaces in form dropdown |
| `Missing required fields: ...` | Form question left blank or header mismatch | Ensure form headers match `HEADERS` in `Config.gs` exactly |
| `HTTP 401 from Notion API` | Invalid or missing `NOTION_TOKEN` | Re-check and re-paste the token in `Config.gs` |
| `HTTP 404 from Notion API` | Integration not invited to that database | Share the Notion database with your integration |
| `HTTP 400 from Notion API` | Property name mismatch | Ensure Notion database property names match exactly |

---

## Phase 2 Checklist (future)

When you are ready to extend the system, each Phase 2 feature is pre-stubbed in `Code.gs`:

- [ ] **Registration IDs** — implement `generateRegistrationId()` and uncomment its call in `onFormSubmit`.
- [ ] **Confirmation Emails** — implement `sendConfirmationEmail()`, add `SENDER_EMAIL` to `CONFIG`.
- [ ] **Discord Notifications** — implement `sendDiscordNotification()`, add `DISCORD_WEBHOOK_URL` to `CONFIG`.
- [ ] **QR Codes** — implement `generateAndAttachQrCode()`.

No existing code needs to be modified — only the stubs and the `CONFIG` object.
