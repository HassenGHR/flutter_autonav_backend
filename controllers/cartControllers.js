const pool = require("../db");

module.exports = {
    addCart: async (req, res) => {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;
      
        try {
          // Check if the user has an existing cart
          const cartQuery = "SELECT * FROM cart WHERE user_id = $1";
          const cartResult = await pool.query(cartQuery, [userId]);
          const cart = cartResult.rows;
      
          if (cart.length > 0) {
            // If the user has an existing cart
            const cartId = cart[0].cart_id;
      
            // Check if the product already exists in the cart_items
            const existingProductQuery =
              "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2";
            const existingProductResult = await pool.query(existingProductQuery, [
              cartId,
              product_id,
            ]);
            const existingProduct = existingProductResult.rows[0];
      
            if (existingProduct) {
              // If the product exists, update the quantity
              const updateCartQuery =
                "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3";
              await pool.query(updateCartQuery, [
                existingProduct.quantity + quantity,
                cartId,
                product_id,
              ]);
            } else {
              // If the product doesn't exist, add a new entry
              const addProductQuery =
                "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)";
              await pool.query(addProductQuery, [cartId, product_id, quantity]);
            }
          } else {
            // If the user doesn't have an existing cart, create a new one
            const createCartQuery =
  "INSERT INTO cart (user_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING cart_id";
const createCartResult = await pool.query(createCartQuery, [userId]);
const cartId = createCartResult.rows[0].cart_id;
          
      
            // Add the product to cart_items
            const addProductQuery =
              "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)";
            await pool.query(addProductQuery, [cartId, product_id, quantity]);
          }
      
          res.status(200).json("Product added to cart");
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to add product to cart" });
        }
      },
      
      getCart: async (req, res) => {
        const userId = req.user.id;
        try {
          // Query the current cart_id for the user
          const cartIdQuery = "SELECT cart_id FROM cart WHERE user_id = $1";
          const cartIdResult = await pool.query(cartIdQuery, [userId]);
          const cartId = cartIdResult.rows[0].cart_id;
      
          // Query cart items for the user from the cart_items table based on cart_id
          const cartItemsQuery =
            "SELECT * FROM cart_items WHERE cart_id = $1 ";
          const cartItemsResult = await pool.query(cartItemsQuery, [cartId]);
      
          // Extract relevant information from each cart item
          const formattedCart = cartItemsResult.rows;
      
          res.status(200).json(formattedCart);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      },
      
      deleteCartItem: async (req, res) => {
        const cartItemId = req.params.cartItem;
      
        try {
          // Delete the cart item from the cart_items table
          const deleteQuery = "DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *";
          const deletedCartItemResult = await pool.query(deleteQuery, [cartItemId]);
      
          if (deletedCartItemResult.rows.length === 0) {
            return res.status(404).json({ message: "Cart item not found" });
          }
      
          const deletedCartItem = deletedCartItemResult.rows[0];
          res.status(200).json({ message: "Cart item deleted", deletedCartItem });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      },
      
};
