import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [cartItem, setCartItem] = useState({});

  // ✅ FETCH FOODS (PROXY VERCEL)
  const fetchFoodList = async () => {
    try {
      const res = await axios.get("/api/foods/list");
      setFoodList(res.data);
    } catch (err) {
      console.error("❌ Fetch foods failed", err);
    }
  };

  // ✅ LOAD CART
  const loadCartFromDB = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cartObj = {};
      (res.data.items || []).forEach((item) => {
        cartObj[item.productId._id] = item.quantity;
      });
      setCartItem(cartObj);
    } catch (err) {
      console.error("❌ Load cart failed", err.response?.data);
      setCartItem({});
    }
  };

  const addToCart = async (itemId) => {
    if (!token) return alert("Please login first");

    await axios.post(
      "/api/cart/add",
      { productId: itemId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadCartFromDB();
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;

    await axios.post(
      "/api/cart/remove",
      { productId: itemId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    loadCartFromDB();
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItem({});
    } catch (error) {
      console.error("Clear cart error", error.response?.data || error.message);
    }
  };

  const getTotalCartAmount = () => {
    if (!food_list.length) return 0;
    return Object.entries(cartItem).reduce((total, [id, qty]) => {
      const product = food_list.find((p) => p._id === id);
      return product ? total + product.price * qty : total;
    }, 0);
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadCartFromDB();
    } else {
      localStorage.removeItem("token");
      setCartItem({});
    }
  }, [token]);

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItem,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        token,
        setToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
