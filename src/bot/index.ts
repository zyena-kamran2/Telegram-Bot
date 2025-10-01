import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "../config/env";
import { registerBotCommands } from "./commands";

export const bot = new Telegraf(BOT_TOKEN);

registerBotCommands(bot);
