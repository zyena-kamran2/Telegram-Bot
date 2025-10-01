import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const BOT_USERNAME = process.env.BOT_USERNAME!;
export const WEBHOOK_SECRET_PATH = process.env.WEBHOOK_SECRET_PATH!;
export const WEBHOOK_URL = process.env.WEBHOOK_URL!;
export const PORT = process.env.PORT || 5000;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN must be set in .env");
if (!WEBHOOK_SECRET_PATH) throw new Error("WEBHOOK_SECRET_PATH must be set in .env");
if (!WEBHOOK_URL) throw new Error("WEBHOOK_URL must be set in .env");
