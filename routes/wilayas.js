const express = require('express');
const router = express.Router();
const wilayasController = require('../controllers/wilaysControllers');

// Define routes
router.post('/', wilayasController.insertWilayas);
router.get('/', wilayasController.getAllWilayas);

router.get('/:wilayaId', wilayasController.getWilayasByWilayaId);



module.exports = router;