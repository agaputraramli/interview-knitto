import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const controller = new OrderController();

router.post('/order', controller.createOrder.bind(controller));

export default router;