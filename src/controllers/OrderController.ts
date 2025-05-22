import { Request, Response } from 'express';
import path from 'path';
import { Order } from '../models/OrderModel';
import { saveJsonWithRetry } from '../utils/fileHelper';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const {
      id_customer,
      name,
      email,
      address,
      payment_type,
      items,
    } = req.body;

    if (!id_customer || !name || !email || !address || !payment_type || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      await Order.lockCustomer(id_customer);
      await new Promise(res => setTimeout(res, 3000));

      const orderData = Order.createOrderData(
        id_customer,
        name,
        email,
        address,
        payment_type,
        items
      );

      const folder = path.resolve(__dirname, '../../database/customerorder');
      const fileName = `${orderData.no_order}.json`;
      const filePath = path.join(folder, fileName);

      await saveJsonWithRetry(filePath, orderData);

      Order.unlockCustomer(id_customer);

      return res.status(201).json({
        message: 'Order berhasil dibuat',
        no_order: orderData.no_order,
      });
    } catch (error: any) {
      Order.unlockCustomer(id_customer);
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
}