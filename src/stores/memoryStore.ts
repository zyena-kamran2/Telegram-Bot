import { InviteCode } from "../models/InviteCode.js";
import { Order } from "../models/Order.js";

export const brokerInviteCodes = new Map<string, InviteCode>();

export const telegramLinks = new Map<number, {
  brokerUserId: number;
  username: string | null;
  name: string;
  chatId: number;
  linkedAt: string;
}>();

export const orders = new Map<string, Order>();
