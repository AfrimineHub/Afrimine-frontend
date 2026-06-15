export type OrderStatus =
  | "pending"
  | "paid"
  | "delivered"
  | "completed"
  | "disputed"
  | "frozen";

export interface Order {
  id: string;
  counterparty: string;
  listing: string;
  amount: number;
  currency?: string | null;
  status: OrderStatus;
  date: string;
}