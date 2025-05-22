"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
class Order {
    static async lockCustomer(id_customer) {
        while (this.locks.get(id_customer)) {
            await new Promise(res => setTimeout(res, 100));
        }
        this.locks.set(id_customer, true);
    }
    static unlockCustomer(id_customer) {
        this.locks.delete(id_customer);
    }
    static generateOrderNumber(id_customer) {
        const dateStr = (0, dayjs_1.default)().format('DDMMYY');
        const key = `${id_customer}-${dateStr}`;
        let runningNumber = this.runningNumbers.get(key) ?? 0;
        runningNumber++;
        this.runningNumbers.set(key, runningNumber);
        return `ORDER-${id_customer}-${dateStr}-${runningNumber.toString().padStart(5, '0')}`;
    }
    static calculateTotal(items) {
        return items.reduce((sum, item) => sum + item.price * item.qty, 0);
    }
    static createOrderData(id_customer, name, email, address, payment_type, items) {
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
exports.Order = Order;
Order.locks = new Map();
Order.runningNumbers = new Map();
