const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const { Pool } = require('pg');
const app = express();
const PORT = 3005;

const productRoute = require('./routes/productRoutes');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const cartRoute = require("./routes/carts");
const orderRoute = require("./routes/orders");
const wilayasRoute = require("./routes/wilayas");






app.use(cors());
app.use(express.json());

app.use('/api/products', productRoute);
app.use('/api/', authRoute);
app.use('/api/users', userRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/wilayas', wilayasRoute);






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
