import { Telegraf } from "telegraf";
import { orders } from "../stores/memoryStore";
import { linkTelegramToBroker } from "../utils/inviteHelpers";

export function registerBotCommands(bot: Telegraf) {
  bot.start(async (ctx) => {
    const text = ctx.message?.text || "";
    let payload: string | null = null;
    const parts = text.split(" ");
    if (parts.length > 1) {
      payload = parts.slice(1).join(" ");
    }
    if (payload) {
      return linkTelegramToBroker(ctx, payload);
    }
    return ctx.reply("👋 Welcome! Please send the invite code you received from admin.");
  });

  bot.command("accepttoken", async (ctx) => {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) return ctx.reply("⚠️ Usage: /accepttoken <CODE>");
    return linkTelegramToBroker(ctx, parts[1] as string);
  });

  bot.command("help", async (ctx) => {
    return ctx.reply("🤖 Commands:\n/start \n/accepttoken <CODE>\n/status\n/orderinfo <ORDER_ID>\n/orderaccept <ORDER_ID>\n/orderreject <ORDER_ID>");
  });

  bot.command("status", async (ctx) => {
    return ctx.reply("📊 Status: All systems operational.");
  });

  bot.command("orderinfo", async (ctx) => {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) return ctx.reply("⚠️ Usage: /orderinfo <ORDER_ID>");
    const order = orders.get(parts[1] as string);
    if (!order) return ctx.reply("❌ Order not found.");
    return ctx.reply(`ℹ️ Order ${order.orderId}:\nStatus: ${order.status}\nDetails: ${order.details}`);
  });

  bot.command("orderaccept", async (ctx) => {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) return ctx.reply("⚠️ Usage: /orderaccept <ORDER_ID>");
    const order = orders.get(parts[1] as string);
    if (!order) return ctx.reply("❌ Order not found.");
    order.status = "accepted";
    orders.set(order.orderId, order);
    return ctx.reply(`✅ Order ${order.orderId} accepted.`);
  });

  bot.command("orderreject", async (ctx) => {
    const parts = ctx.message.text.split(" ");
    if (parts.length < 2) return ctx.reply("⚠️ Usage: /orderreject <ORDER_ID>");
    const order = orders.get(parts[1] as string);
    if (!order) return ctx.reply("❌ Order not found.");
    order.status = "rejected";
    orders.set(order.orderId, order);
    return ctx.reply(`❌ Order ${order.orderId} rejected.`);
  });
}
