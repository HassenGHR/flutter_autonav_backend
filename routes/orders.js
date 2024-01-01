// userRoutes.js
const express = require('express');
const orderController = require('../controllers/ordersControllers');
const {verifyToken} = require("../middleware/verofyToken");
const router = express.Router();

router.get('/',verifyToken, orderController.getOrdersByUserId);
router.post('/', verifyToken, orderController.addUserOrders);



module.exports = router;