# Telegram Broker Bot

A Node.js + Telegraf + Express application to connect brokers with your system using Telegram.
The bot allows brokers to link their Telegram accounts, receive forwarded orders, and interact with them (`accept`, `reject`, `info`, etc.).

---

## Features

* Generate invite codes for brokers.
* Brokers can link Telegram to their system account using `/start <CODE>` or `/accepttoken <CODE>`.
* Broker’s `telegramUserId` and `chatId` are saved for messaging.
* Admin/system can forward orders via REST API.
* Brokers can interact with orders via bot commands.

---

## Tech Stack

* **Node.js + TypeScript**
* **Express** for REST API
* **Telegraf** for Telegram bot
* **Ngrok** for exposing webhook (development)
* **In-memory stores** (can later be replaced with DB)

---

## Project Structure

```
src/
 ├── api/
 │   └── forwardOrderRoutes.ts   # API routes for forwarding orders
 ├── bot/
 │   └── commands.ts             # Telegram bot commands
 ├── stores/
 │   └── memoryStore.ts          # In-memory storage for invites & links
 ├── utils/
 │   └── inviteHelpers.ts        # Invite handling + broker linking
 ├── models/                     # TypeScript interfaces
 ├── app.ts                      # Express app
 └── server.ts                   # Entry point
```

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd telegram-broker-bot
npm install
```

### 2. Environment Variables (`.env`)

```env
BOT_TOKEN=your_telegram_bot_token
PORT=5000
WEBHOOK_SECRET_PATH=mysecret123
WEBHOOK_URL=https://<ngrok-id>.ngrok-free.app/webhook/mysecret123
```

> Get `BOT_TOKEN` from [BotFather](https://t.me/botfather).

### 3. Run locally

```bash
npm run dev
```

### 4. Start ngrok

```bash
ngrok http 5000
```

Update `.env` → `WEBHOOK_URL` with the new ngrok URL.

### 5. Webhook

On startup, server will automatically set:

```
https://<ngrok-id>.ngrok-free.app/webhook/mysecret123
```

---

## Invite & Linking

### 1. Generate invite code (admin)

Once server is running (npm run dev):

```
curl -X POST http://localhost:5000/generate-invite \
  -H "Content-Type: application/json" \
  -d '{"brokerUserId":101, "expectedUsername":"broker_username"}'
```

Example response:

```json
{
    "code": "A2VNR5LR",
    "inviteLink": "https://t.me/RFDemoBot?start=A2VNR5LR",
    "expiresInDays": 3
}
```
This code is valid for 3 days.

### 2. Broker links Telegram

Broker opens bot via link in Telegram or runs either directly on Telegram:

```
/start <CODE>
```

or

```
/accepttoken <CODE>
```

If valid → system saves:

* `brokerUserId`
* `telegramUserId`
* `chatId`
* `username`
* `name`

Broker will see:

```
✅ Linked successfully! Broker user <ID> is now connected.
```

---

## 📬 Forwarding Orders via API

### Endpoint

`POST /forward-order`

### Request

```json
{
  "orderId": "ORD1001",
  "brokerUserId": 101,
  "details": "Buy 50 shares of XYZ"
}
```

### Response

```json
{
  "success": true,
  "orderId": "ORD1001",
  "brokerUserId": 101
}
```

### Telegram Message to Broker

```
📦 New Order
ID: ORD1001
Details: Buy 50 shares of XYZ
```

---

## Bot Commands

* `/start <CODE>` → Link with invite code
* `/accepttoken <CODE>` → Same as above
* `/help` → List commands
* `/status` → Show system status
* `/orderinfo <ORDER_ID>` → Get order info
* `/orderaccept <ORDER_ID>` → Accept an order
* `/orderreject <ORDER_ID>` → Reject an order

---

## Testing Flow

1. **Admin** generates invite code for broker.
2. **Broker** opens bot in Telegram → runs `/accepttoken <CODE>`.
3. System saves `chatId` + `brokerUserId`.
4. Use Postman/cURL to call API:

   ```bash
   curl -X POST http://localhost:5000/forward-order \
     -H "Content-Type: application/json" \
     -d '{"orderId":"ORD1001","brokerUserId":101,"details":"Buy 50 shares of XYZ"}'
   ```
5. Broker receives Telegram message.
6. Broker can reply `/orderaccept ORD1001` or `/orderreject ORD1001`.