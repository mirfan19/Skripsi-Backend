const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.post('/', orderItemController.createOrderItem);
router.get('/', orderItemController.getAllOrderItems);
router.get('/:OrderItemID', orderItemController.getOrderItemById);
router.put('/:OrderItemID', orderItemController.updateOrderItem);
router.delete('/:OrderItemID', orderItemController.deleteOrderItem);

module.exports = router;
