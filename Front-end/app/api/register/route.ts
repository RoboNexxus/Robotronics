import { NextRequest, NextResponse } from "next/server";
import { DATABASES, MAX_TEAM_SIZE } from "@/config/databases";
import { generateRegId } from "@/lib/regId";
import { createRegistration, countTotalRegistrations } from "@/lib/notion";
import { buildRegistrationEmbed, sendWebhook } from "@/lib/discord";
import { sendConfirmationEmail } from "@/lib/email";

const TEAM_TYPE: Record<number, string> = { 1: "Solo", 2: "Duo", 3: "Trio" };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventName, teamName, leaderName, school,
      email, phone, discordId, teamSize, member2, member3,
    } = body as Record<string, string>;

    if (!DATABASES[eventName])
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });

    if (!teamName || !leaderName || !school)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? ""))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    if (!/^\d{10}$/.test(phone ?? ""))
      return NextResponse.json({ error: "Phone must be 10 digits" }, { status: 400 });

    const size = Number(teamSize);
    if (!size || size < 1 || size > MAX_TEAM_SIZE[eventName])
      return NextResponse.json(
        { error: `Team size must be between 1 and ${MAX_TEAM_SIZE[eventName]}` },
        { status: 400 }
      );

    const total = await countTotalRegistrations();
    const regId = generateRegId(total);
    const data = {
      regId, eventName, teamName, leaderName, school,
      email, phone, discordId, teamSize: size, member2, member3,
    };

    const notionSynced = await createRegistration(DATABASES[eventName], data);
    const emailSent    = await sendConfirmationEmail({ to: email, leaderName, eventName, regId });

    const embed = buildRegistrationEmbed({
      regId, eventName, teamName,
      teamType: TEAM_TYPE[size] ?? `${size} members`,
      leaderName, school, email, phone,
      discordUsername: discordId,
      notionSynced, emailSent,
    });
    await sendWebhook(embed);

    return NextResponse.json({ success: true, regId, notionSynced, emailSent });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed", message }, { status: 500 });
  }
}
