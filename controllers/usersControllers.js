const pool = require('../db');

module.exports = {
  getUser: async (req, res) => {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [req.user.id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, created_at, ...userData } = result.rows[0];
      res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await pool.query(query, [req.user.id]);
      res.status(200).json("User successfully deleted");
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },
};
