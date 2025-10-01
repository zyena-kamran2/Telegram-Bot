import { brokerInviteCodes, telegramLinks } from "../stores/memoryStore";
import { InviteCode } from "../models/InviteCode";

export function generateInviteForBroker(brokerUserId: number, expectedUsername: string | null = null, ttlDays = 3): string {
  const token = Math.random().toString(36).slice(2, 10).toUpperCase();
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 3600 * 1000);
  brokerInviteCodes.set(token, {
    brokerUserId,
    expiresAt,
    used: false,
    expectedUsername
  });
  return token;
}

export function validateInviteCode(code: string): { ok: boolean; reason?: string; record?: InviteCode } {
  const rec = brokerInviteCodes.get(code);
  if (!rec) return { ok: false, reason: "not_found" };
  if (rec.used) return { ok: false, reason: "already_used" };
  if (rec.expiresAt < new Date()) return { ok: false, reason: "expired" };
  return { ok: true, record: rec };
}

export function markInviteUsed(code: string, telegramUserId: number) {
  const rec = brokerInviteCodes.get(code);
  if (!rec) return;
  rec.used = true;
  rec.usedAt = new Date();
  rec.linkedTelegramUserId = telegramUserId;
  brokerInviteCodes.set(code, rec);
}

export async function linkTelegramToBroker(ctx: any, code: string) {
  const from = ctx.from || {};
  const telegramUserId: number = from.id;
  const username: string | null = from.username || null;
  const name = `${from.first_name || ""} ${from.last_name || ""}`.trim();

  const v = validateInviteCode(code);
  if (!v.ok) {
    const reason = v.reason;
    if (reason === "not_found") return ctx.reply("❌ Code not recognized.");
    if (reason === "already_used") return ctx.reply("❌ Code already used.");
    if (reason === "expired") return ctx.reply("❌ Code expired.");
    return ctx.reply("❌ Invalid code.");
  }

  const rec = v.record!;
  if (rec.expectedUsername && rec.expectedUsername !== username) {
    return ctx.reply(`⚠️ Username mismatch. Expected @${rec.expectedUsername}, your username is ${username ? "@" + username : "not set"}`);
  }

  markInviteUsed(code, telegramUserId);
  telegramLinks.set(telegramUserId, {
    brokerUserId: rec.brokerUserId,
    username,
    name,
    linkedAt: new Date().toISOString()
  });

  return ctx.reply(`✅ Linked successfully! Broker user ${rec.brokerUserId} is now connected.`);
}
