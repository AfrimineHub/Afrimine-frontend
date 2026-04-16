export type OrderStatus =
  | "pending"
  | "paid"
  | "delivered"
  | "completed"
  | "disputed"
  | "frozen";

export interface Order {
  id: string;
  buyer: string;
  listing: string;
  amount: number;
  status: OrderStatus;
  date: string;
}