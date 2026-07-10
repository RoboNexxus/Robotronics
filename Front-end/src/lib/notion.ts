import { Client } from "@notionhq/client";
import { DATABASES } from "@/config/databases";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function countDatabase(databaseId: string): Promise<number> {
  let total = 0;
  let cursor: string | undefined = undefined;

  do {
    const res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    total += res.results.length;
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return total;
}

export async function countTotalRegistrations(): Promise<number> {
  const counts = await Promise.all(Object.values(DATABASES).map(countDatabase));
  return counts.reduce((sum, n) => sum + n, 0);
}

export interface RegistrationData {
  regId: string;
  eventName: string;
  teamName: string;
  leaderName: string;
  school: string;
  email: string;
  phone: string;
  discordId?: string;
  teamSize: number;
  member2?: string;
  member3?: string;
}

export async function createRegistration(
  databaseId: string,
  data: RegistrationData
): Promise<boolean> {
  const {
    regId, eventName, teamName, leaderName, school,
    email, phone, discordId, teamSize, member2, member3,
  } = data;

  try {
    const properties: Record<string, any> = {
      "Name":       { title: [{ text: { content: leaderName } }] },
      "Team Name":  { rich_text: [{ text: { content: teamName } }] },
      "Reg ID":     { rich_text: [{ text: { content: regId } }] },
      "School":     { rich_text: [{ text: { content: school } }] },
      "Email":      { email },
      "Phone":      { phone_number: phone },
      "Discord ID": { rich_text: [{ text: { content: discordId ?? "N/A" } }] },
      "Team Size":  { number: Number(teamSize) },
      "member_2":   { rich_text: [{ text: { content: member2 ?? "" } }] },
    };

    if (eventName !== "Robo Race" && eventName !== "Line Follower") {
      properties["member_3"] = { rich_text: [{ text: { content: member3 ?? "" } }] };
    }

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    });
    return true;
  } catch (err: unknown) {
    const e = err as { body?: string; message?: string };
    console.error("Notion sync failed:", e.body ?? e.message);
    return false;
  }
}
