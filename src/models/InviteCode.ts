export interface InviteCode {
  brokerUserId: number;
  expiresAt: Date;
  used: boolean;
  expectedUsername?: string | null;
  usedAt?: Date;
  linkedTelegramUserId?: number;
}
