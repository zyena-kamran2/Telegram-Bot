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

  // Find the telegram link by brokerUserId
  const telegramEntry = Array.from(telegramLinks.values()).find(
    (l) => l.brokerUserId === brokerUserId
  );

  if (!telegramEntry) {
    return res.status(404).json({ success: false, error: "Broker not linked with Telegram" });
  }

  try {
    await bot.telegram.sendMessage(
      telegramEntry.chatId, // ✅ use chatId saved during linking
      `📦 New Order\nID: ${orderId}\nDetails: ${details}`
    );

    orders.set(orderId, {
      orderId,
      brokerUserId,
      status: "pending",
      details,
    });

    res.json({ success: true, orderId, brokerUserId });
  } catch (err: any) {
    console.error("Error forwarding order:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// View active links
router.get("/links", (req, res) => {
  res.json(Array.from(telegramLinks.entries()));
});

export default router;
