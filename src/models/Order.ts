export interface Order {
  orderId: string;
  brokerUserId: number;
  status: "pending" | "accepted" | "rejected";
  details: string;
}
