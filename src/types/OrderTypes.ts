export interface OrderItem {
  id_product: number;
  name: string;
  price: number;
  qty: number;
}

export interface OrderPayload {
  address: string;
  payment_type: string;
  items: OrderItem[];
}

export interface FullOrder extends OrderPayload {
  no_order: string;
  id_customer: number;
  name: string;
  email: string;
  total: number;
  status: string;
}
