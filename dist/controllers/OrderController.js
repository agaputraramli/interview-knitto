"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const path_1 = __importDefault(require("path"));
const OrderModel_1 = require("../models/OrderModel");
const fileHelper_1 = require("../utils/fileHelper");
class OrderController {
    async createOrder(req, res) {
        const { id_customer, name, email, address, payment_type, items, } = req.body;
        if (!id_customer || !name || !email || !address || !payment_type || !items) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        try {
            await OrderModel_1.Order.lockCustomer(id_customer);
            await new Promise(res => setTimeout(res, 3000));
            const orderData = OrderModel_1.Order.createOrderData(id_customer, name, email, address, payment_type, items);
            const folder = path_1.default.resolve(__dirname, '../../database/customerorder');
            const fileName = `${orderData.no_order}.json`;
            const filePath = path_1.default.join(folder, fileName);
            await (0, fileHelper_1.saveJsonWithRetry)(filePath, orderData);
            OrderModel_1.Order.unlockCustomer(id_customer);
            return res.status(201).json({
                message: 'Order berhasil dibuat',
                no_order: orderData.no_order,
            });
        }
        catch (error) {
            OrderModel_1.Order.unlockCustomer(id_customer);
            return res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    }
}
exports.OrderController = OrderController;
