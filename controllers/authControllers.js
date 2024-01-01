// userController.js
const pool = require('../db');
const jwt = require('jsonwebtoken');

const CryptoJS = require('crypto-js');

module.exports = {
  createUser: async (req, res) => {
    const { name, email, password, location } = req.body;

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.JWT_SECRET).toString();
      const query = 'INSERT INTO users(name, email, password, location) VALUES($1, $2, $3, $4)';
      const values = [name, email, encryptedPassword, location];

      await pool.query(query, values);

      res.status(201).json({ message: 'User successfully created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  loginUser: async (req, res) => {
    const { email, password: userPassword } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const storedPassword = CryptoJS.AES.decrypt(result.rows[0].password, process.env.JWT_SECRET).toString(CryptoJS.enc.Utf8);

        if (userPassword !== storedPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '21d' });

        const { password, created_at, ...others } =  result.rows[0];

        res.status(200).json({ ...others, token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},


};
