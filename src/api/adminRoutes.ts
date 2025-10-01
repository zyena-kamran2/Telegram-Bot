import { Router } from "express";
import { generateInviteForBroker } from "../utils/inviteHelpers";
import { telegramLinks, orders } from "../stores/memoryStore";
import { bot } from "../bot/index";

const router = Router();

// Admin: generate invite
router.post("/generate-invite", (req, res) => {
  const { brokerUserId, expectedUsername } = req.body;
  if (!brokerUserId) return res.status(400).json({ error: "brokerUserId required" });
  const code = generateInviteForBroker(brokerUserId, expectedUsername || null);
  const inviteLink = `https://t.me/${process.env.BOT_USERNAME}?start=${code}`;
  res.json({ code, inviteLink, expiresInDays: 3 });
});

// Admin: forward an order to a broker
router.post("/forward-order", async (req, res) => {
  const { orderId, brokerUserId, details } = req.body;
  if (!orderId || !brokerUserId || !details) return res.status(400).json({ error: "Missing fields" });

  const linkEntry = Array.from(telegramLinks.values()).find(l => l.brokerUserId === brokerUserId);
  if (!linkEntry) return res.status(404).json({ error: "Broker not linked" });

  const order = { orderId, brokerUserId, status: "pending" as const, details };
  orders.set(orderId, order);

  await bot.telegram.sendMessage(linkEntry.brokerUserId, `📥 New Order ${orderId}\nDetails: ${details}\nUse /orderaccept ${orderId} or /orderreject ${orderId}`);
  res.json({ success: true, order });
});

// View active links
router.get("/links", (req, res) => {
  res.json(Array.from(telegramLinks.entries()));
});

export default router;
