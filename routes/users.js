// userRoutes.js
const express = require('express');
const userController = require('../controllers/usersControllers');
const {verifyToken} = require("../middleware/verofyToken");
const router = express.Router();

router.get('/',verifyToken, userController.getUser);
router.delete('/', verifyToken,userController.deleteUser);

module.exports = router;