const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// Middleware to get user from token
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
router.get("/", getUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get("/:id", getUser, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post("/", getUser, async (req, res) => {
  try {
    const { shippingAddress, paymentIntentId } = req.body;
    const user = req.user;

    // Get cart items with populated product details
    const cartItems = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: item.product,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      user: user._id,
      items: cartItems,
      totalAmount,
      shippingAddress,
      paymentIntentId,
      paymentStatus: "completed",
      orderStatus: "processing",
    });

    await order.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (Admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
