import Cart from "../models/cart.js";

/* 🟢 GET CART */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➕ ADD TO CART */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ➖ REMOVE FROM CART */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items
      .map((item) =>
        item.productId.toString() === productId
          ? { ...item._doc, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ❌ CLEAR CART */
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.userId });
    res.json({ items: [] }); // important
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


