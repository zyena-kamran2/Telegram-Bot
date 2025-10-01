import app from "./api/index";
import { bot } from "./bot/index";
import { PORT, WEBHOOK_SECRET_PATH, WEBHOOK_URL } from "./config/env";

const webhookPath = `/webhook/${WEBHOOK_SECRET_PATH}`;
app.use(webhookPath, (req, res, next) => {
  bot.webhookCallback(webhookPath)(req, res, next);
});

export default app;
