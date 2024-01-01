// userRoutes.js
const express = require('express');
const authControllers = require('../controllers/authControllers');
const router = express.Router();

router.post('/register', authControllers.createUser);
router.post('/login', authControllers.loginUser);

module.exports = router;
