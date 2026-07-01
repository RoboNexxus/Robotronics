const CONFIG = {
  NOTION_TOKEN: PropertiesService.getScriptProperties().getProperty("NOTION_API"),
  NOTION_API_BASE: "https://api.notion.com/v1",
  NOTION_VERSION: "2022-06-28",

  BREVO_API_KEY: PropertiesService.getScriptProperties().getProperty("BREVO_API_KEY"),
  BREVO_SENDER_NAME: "Robo Nexus",
  BREVO_SENDER_EMAIL: "robonexus.ais46@gmail.com",

  DISCORD_WEBHOOK_URL: PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL"),
};

const DATABASES = {
  "Robo War Sr.":    "723ea79c-8931-405e-9342-696f47b81e68",
  "Robo War Jr.":    "eaae9253-7b87-4a7b-b147-ad18cf8ae5b1",
  "Robo Soccer Sr.": "437ef7d5-38b5-4a15-8b46-d0ac0308f369",
  "Robo Soccer Jr.": "df101e06-82e7-4c06-a17d-2b5d417d8bfc",
  "Robo Race":       "5e0ede80-8c1b-4d92-84bc-29abfc3e7000",
  "Line Follower":   "fe308409-3690-41c5-b59f-77dc1f2fcdc0"
};

const EVENTS_WITH_MEMBER_3 = [
  "Robo War Sr.",
  "Robo War Jr.",
  "Robo Soccer Sr.",
  "Robo Soccer Jr."
];

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
