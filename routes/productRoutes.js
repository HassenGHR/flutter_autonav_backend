const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsControllers');

// Define routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.get('/search/:key', productController.searchProducts);
router.post('/', productController.createProduct);

module.exports = router;
