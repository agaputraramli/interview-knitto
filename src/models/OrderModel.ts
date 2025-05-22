import dayjs from 'dayjs';

interface OrderItem {
  id_product: number;
  name: string;
  price: number;
  qty: number;
}

interface OrderData {
  no_order: string;
  id_customer: number;
  name: string;
  email: string;
  address: string;
  payment_type: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export class Order {
  private static locks: Map<number, boolean> = new Map();
  private static runningNumbers: Map<string, number> = new Map();

  static async lockCustomer(id_customer: number): Promise<void> {
    while (this.locks.get(id_customer)) {
      await new Promise(res => setTimeout(res, 100));
    }
    this.locks.set(id_customer, true);
  }

  static unlockCustomer(id_customer: number): void {
    this.locks.delete(id_customer);
  }

  static generateOrderNumber(id_customer: number): string {
    const dateStr = dayjs().format('DDMMYY');
    const key = `${id_customer}-${dateStr}`;
    let runningNumber = this.runningNumbers.get(key) ?? 0;
    runningNumber++;
    this.runningNumbers.set(key, runningNumber);
    return `ORDER-${id_customer}-${dateStr}-${runningNumber.toString().padStart(5, '0')}`;
  }

  static calculateTotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  static createOrderData(
    id_customer: number,
    name: string,
    email: string,
    address: string,
    payment_type: string,
    items: OrderItem[]
  ): OrderData {
    const no_order = this.generateOrderNumber(id_customer);
    const total = this.calculateTotal(items);
    return {
      no_order,
      id_customer,
      name,
      email,
      address,
      payment_type,
      items,
      total,
      status: 'Order Diterima'
    };
  }
}