import app from "./app";
import { bot } from "./bot/index";
import { PORT, WEBHOOK_SECRET_PATH, WEBHOOK_URL } from "./config/env";

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  const webhookUrl = `${WEBHOOK_URL}/webhook/${WEBHOOK_SECRET_PATH}`;
  console.log("Setting webhook to:", webhookUrl);
  try {
    await bot.telegram.setWebhook(webhookUrl, { drop_pending_updates: true });
    console.log("Webhook set successfully");
  } catch (err) {
    console.error("Error setting webhook:", err);
  }
});
