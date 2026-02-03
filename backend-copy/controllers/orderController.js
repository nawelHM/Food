import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import sendOrderEmail from "../utils/sendOrderEmail.js";

/* ===========================
   Créer une commande utilisateur
=========================== */
export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must have productId and quantity",
        });
      }
    }

    // Création de la commande
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
    });

    // Populer les données produits
    const populatedOrder = await order.populate("items.productId");

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Envoi email (try/catch pour éviter crash serveur)
    try {
      await sendOrderEmail(user.email, populatedOrder, user);
    } catch (err) {
      console.error("Email sending failed:", err.message);
    }

    res.status(201).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

/* ===========================
   Récupérer commandes utilisateur
=========================== */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate(
      "items.productId"
    );
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   Récupérer toutes les commandes (Admin)
=========================== */
export const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // info utilisateur
      .populate("items.productId", "name price"); // info produit

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin get all orders ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   Changer le statut d’une commande (Admin)
=========================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status; // ex: "Pending", "Completed", "Cancelled"
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update Order Status ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
 