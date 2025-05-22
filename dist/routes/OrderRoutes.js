"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const router = (0, express_1.Router)();
const controller = new OrderController_1.OrderController();
router.post('/order', controller.createOrder.bind(controller));
exports.default = router;
