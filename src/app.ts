import { bot } from "./bot/index";
import { WEBHOOK_SECRET_PATH } from "./config/env";
import express from "express";
import adminRoutes from "./api/adminRoutes";

const app = express();
app.use(express.json());

const webhookPath = `/webhook/${WEBHOOK_SECRET_PATH}`;
console.log("Webhook registered at:", webhookPath);

// Mount as a POST route — no next()
app.post(webhookPath, bot.webhookCallback(webhookPath));

// Debug log
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Simple healthcheck
app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/", adminRoutes);

export default app;
