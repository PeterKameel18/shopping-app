const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

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

// Get cart
router.get("/", getUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post("/add", getUser, async (req, res) => {
  console.log("Add to cart called");
  console.log("Request body:", req.body);
  console.log("User:", req.user);
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = req.user;
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put("/update/:productId", getUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = req.user;
    const cartItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete("/remove/:productId", getUser, async (req, res) => {
  try {
    const user = req.user;
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete("/clear", getUser, async (req, res) => {
  try {
    const user = req.user;
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
