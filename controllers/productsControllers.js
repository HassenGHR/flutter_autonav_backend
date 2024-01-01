const pool = require('../db');
const productController = {
  getAllProducts: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      const products = result.rows;
      res.status(200).json(products);
    } catch (error) {
      console.error('Failed to get products:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


  getProduct: async (req, res) => {
    const productId = req.params.id;

    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = result.rows[0];
      res.status(200).json(product);
    } catch (error) {
      console.error('Failed to get product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createProduct: async (req, res) => {
    const { name, category, image_urls, old_price, price, description, title } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO products (name, category, image_urls, old_price, price, description, title) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name, category, image_urls, old_price, price, description, title]
      );

      const createdProduct = result.rows[0];
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error('Failed to create product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  searchProducts: async (req, res) => {
    const searchKey = req.params.key;

    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE to_tsvector(name) @@ to_tsquery($1)',
        [searchKey]
      );

      const matchingProducts = result.rows;
      res.status(200).json(matchingProducts);
    } catch (error) {
      console.error('Failed to search products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = productController;
