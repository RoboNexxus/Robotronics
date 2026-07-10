"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Logo3D = dynamic(() => import("./Logo3D"), { ssr: false });

const EVENTS = [
  { value: "Robo War Sr.", label: "Robo War Sr. (Grades IX–XII, 1–3 members)", max: 3 },
  { value: "Robo War Jr.", label: "Robo War Jr. (Grades VI–VIII, 1–3 members)", max: 3 },
  { value: "Robo Soccer Sr.", label: "Robo Soccer Sr. (Grades IX–XII, 1–3 members)", max: 3 },
  { value: "Robo Soccer Jr.", label: "Robo Soccer Jr. (Grades VI–VIII, 1–3 members)", max: 3 },
  { value: "Line Follower", label: "Line Follower (Grades IV–VI, 1–2 members)", max: 2 },
  { value: "Robo Race", label: "Robo Race (Grades VI–VIII, 1–2 members)", max: 2 },
] as const;

const inputCls = "w-full bg-transparent border border-white/20 rounded-md px-3.5 py-3.5 text-white font-pixel text-base focus:outline-none focus:border-cyan-400 placeholder:text-white/30";
const labelCls = "block font-bold mt-6 mb-2 text-white";

export default function RegisterPage() {
  const [form, setForm] = useState({
    eventName: "",
    teamName: "",
    leaderName: "",
    school: "",
    email: "",
    phone: "",
    discordId: "",
    teamSize: "",
    member2: "",
    member3: "",
  });
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const maxSize = EVENTS.find((e) => e.value === form.eventName)?.max ?? 3;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      
      if (field === "eventName") {
        const newMax = EVENTS.find((e) => e.value === value)?.max ?? 3;
        if (Number(prev.teamSize) > newMax) {
          updated.teamSize = "";
          updated.member2 = "";
          updated.member3 = "";
        }
      }
      
      if (field === "teamSize") {
        if (Number(value) < 3) updated.member3 = "";
        if (Number(value) < 2) updated.member2 = "";
      }

      if (field === "phone") {
        updated.phone = value.replace(/\D/g, "").slice(0, 10);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({ error: `Server error: ${res.status}` }));

      if (!res.ok) throw new Error(data.error || "Registration failed");

      setMsg({ text: `Registered! Your ID: ${data.regId}. Check your email.`, ok: true });
      setForm({
        eventName: "",
        teamName: "",
        leaderName: "",
        school: "",
        email: "",
        phone: "",
        discordId: "",
        teamSize: "",
        member2: "",
        member3: "",
      });
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : "Failed to connect", ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid-bg min-h-screen text-white font-pixel">
      <div className="max-w-[900px] mx-auto px-5 py-[60px]">
        <Logo3D />
        <h1 className="text-cyan-400 text-5xl mb-10 tracking-wide">Register</h1>

        <form onSubmit={handleSubmit} noValidate>
          <label className={labelCls}>Select Event *</label>
          <select className={inputCls} value={form.eventName} onChange={(e) => handleChange("eventName", e.target.value)} required>
            <option value="">Choose event</option>
            {EVENTS.map((ev) => (
              <option key={ev.value} value={ev.value}>{ev.label}</option>
            ))}
          </select>

          <div className="flex gap-5 mt-1">
            <div className="flex-1">
              <label className={labelCls}>Team Name *</label>
              <input className={inputCls} placeholder="Robo Nexus" value={form.teamName} onChange={(e) => handleChange("teamName", e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Leader Name *</label>
              <input className={inputCls} placeholder="Robo Nexus" value={form.leaderName} onChange={(e) => handleChange("leaderName", e.target.value)} required />
            </div>
          </div>

          <div className="flex gap-5 mt-1">
            <div className="flex-1">
              <label className={labelCls}>School *</label>
              <input className={inputCls} placeholder="Team Name If Registering Individual" value={form.school} onChange={(e) => handleChange("school", e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Email *</label>
              <input className={inputCls} type="email" placeholder="robonexus.ais46@gmail.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
            </div>
          </div>

          <div className="flex gap-5 mt-1">
            <div className="flex-1">
              <label className={labelCls}>Phone *</label>
              <input className={inputCls} type="tel" maxLength={10} pattern="\d{10}" placeholder="2222222222" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Discord ID</label>
              <input className={inputCls} placeholder="robonexus#7777" value={form.discordId} onChange={(e) => handleChange("discordId", e.target.value)} />
            </div>
          </div>

          <label className={labelCls}>Team Size *</label>
          <select className={inputCls} value={form.teamSize} onChange={(e) => handleChange("teamSize", e.target.value)} required>
            <option value="">Choose size</option>
            {[1, 2, 3].map((n) => (
              <option key={n} value={String(n)} disabled={n > maxSize}>{n} {n === 1 ? "member" : "members"}</option>
            ))}
          </select>

          {Number(form.teamSize) >= 2 && (
            <div className="flex gap-5 mt-1">
              <div className="flex-1">
                <label className={labelCls}>Member 2 Full Name</label>
                <input className={inputCls} placeholder="Robo_Nexus#2" value={form.member2} onChange={(e) => handleChange("member2", e.target.value)} />
              </div>
              {Number(form.teamSize) >= 3 && (
                <div className="flex-1">
                  <label className={labelCls}>Member 3 Full Name</label>
                  <input className={inputCls} placeholder="Robo_Nexus#3" value={form.member3} onChange={(e) => handleChange("member3", e.target.value)} />
                </div>
              )}
            </div>
          )}

          {msg && <p className={`mt-4 text-base ${msg.ok ? "text-cyan-400" : "text-red-400"}`}>{msg.text}</p>}

          <div className="flex justify-end mt-7">
            <button type="submit" disabled={loading} className="bg-cyan-400 text-black font-bold text-base px-10 py-4 rounded-md disabled:opacity-60 hover:bg-cyan-300 transition-colors">
              {loading ? "Submitting…" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
