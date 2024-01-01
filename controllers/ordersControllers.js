const pool = require('../db');

module.exports = {
  getOrdersByUserId: async (req, res) => {
    const userId = req.user.id;
  
    try {
      const getOrdersQuery = "SELECT * FROM orders WHERE user_id = $1";
      const orders = await pool.query(getOrdersQuery, [userId]);
  
      const orderIds = orders.rows.map(order => order.id);
  
      const getOrderItemsQuery = "SELECT * FROM order_items WHERE order_id = ANY($1)";
      const orderItems = await pool.query(getOrderItemsQuery, [orderIds]);
  
      const ordersWithItems = await Promise.all(
        orders.rows.map(async order => {
          const items = orderItems.rows
            .filter(item => item.order_id === order.id)
            .map(item => ({
              productId: item.product_id,
              quantity: item.quantity,
              subtotal: item.subtotal,
            }));
  
          return {
            id: order.id,
            total: order.total,
            deliveryStatus: order.delivery_status,
            items: items,
          };
        })
      );
  
      res.status(200).json(ordersWithItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get user orders and order items" });
    }
  },
  
  
  addUserOrders: async (req, res) => {
    const userId = req.user.id;
    const { total, delivery_status, items } = req.body;
  
    try {
      const addOrderQuery =
  "INSERT INTO orders (user_id, total, delivery_status, created_at, updated_at) VALUES ($1, $2, $3, Now(), Now()) RETURNING id";
const orderResult = await pool.query(addOrderQuery, [userId, total, delivery_status]);

const orderId = orderResult.rows[0].id;

  
      const addOrderItemsQuery =
        "INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)";
      await Promise.all(
        items.map(item =>
          pool.query(addOrderItemsQuery, [orderId, item.product_id, item.quantity, item.subtotal])
        )
      );
  
      res.status(200).json("Order and Order Items added successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to add order and order items" });
    }
  },
  
  
       
  }
