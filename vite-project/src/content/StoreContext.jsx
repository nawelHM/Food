import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

// 1. AJOUTE L'URL DE TON BACKEND ICI
const url = "https://food-back-git-main-nawels-projects-e0718b0a.vercel.app";

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const [cartItem, setCartItem] = useState({});

  // ✅ FETCH FOODS (URL complète + withCredentials)
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/foods/list`, { withCredentials: true });
      setFoodList(res.data);
    } catch (err) {
      console.error("❌ Fetch foods failed", err);
    }
  };

  // ✅ LOAD CART (URL complète + withCredentials)
  const loadCartFromDB = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${url}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // INDISPENSABLE
      });

      const cartObj = {};
      (res.data.items || []).forEach((item) => {
        if (item.productId) {
           cartObj[item.productId._id] = item.quantity;
        }
      });
      setCartItem(cartObj);
    } catch (err) {
      console.error("❌ Load cart failed", err.response?.data);
      setCartItem({});
    }
  };

  const addToCart = async (itemId) => {
    if (!token) return alert("Please login first");
    try {
        await axios.post(
          `${url}/api/cart/add`,
          { productId: itemId },
          { 
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
          }
        );
        loadCartFromDB();
    } catch (err) {
        console.error("Add to cart error", err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;
    try {
        await axios.post(
          `${url}/api/cart/remove`,
          { productId: itemId },
          { 
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true 
          }
        );
        loadCartFromDB();
    } catch (err) {
        console.error("Remove from cart error", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${url}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setCartItem({});
    } catch (error) {
      console.error("Clear cart error", error.response?.data || error.message);
    }
  };

  const getTotalCartAmount = () => {
    if (!food_list || !food_list.length) return 0;
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
        url, // Exporté au cas où tu en as besoin ailleurs
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