const jwt = require('jsonwebtoken');
const pool = require('../db');


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return res.status(403).json('Invalid token');

      // Assuming you have a 'users' table
      const userId = user.userId;
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json('User not found');
      }

      req.user = result.rows[0];
      next(); // Don't forget to call next() to proceed to the next middleware
    });
  } else {
    return res.status(401).json('You are not authenticated');
  }
};

module.exports = { verifyToken };

