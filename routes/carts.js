// userRoutes.js
const express = require('express');
const cartController = require('../controllers/cartControllers');
const {verifyToken} = require("../middleware/verofyToken");
const router = express.Router();

router.post('/',verifyToken, cartController.addCart);
router.delete('/:cartItem',verifyToken, cartController.deleteCartItem);
router.get('/find/',verifyToken, cartController.getCart);


module.exports = router;