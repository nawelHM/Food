import React, { useContext, useState } from "react";
import "./Placeorder.css";
import { StoreContext } from "./../../content/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const { cartItem, food_list, getTotalCartAmount, setCartItem, token , clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_API_URL; 
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    // Build items array
    const items = Object.entries(cartItem)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (items.length === 0) {
      setMessage("Cart is empty");
      setLoading(false);
      return;
    }

    // Build address string
    const address = `${street}, ${city}, ${state}, ${zip}, ${country}, Phone: ${phone}`;

    const amount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2;

    const orderData = { items, amount, address };

    console.log("ORDER DATA TO SEND:", orderData);

    // ✅ Créer la commande
    await axios.post(
      API_URL+"/api/orders/create",
      orderData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Vider le cart (backend + context)
    if (clearCart) {
      await clearCart(); // attend que le cart soit vide côté serveur et local
    } else {
      setCartItem({}); // fallback si clearCart n’existe pas
    }

    // ✅ message et redirection après nettoyage
    setMessage("Order placed successfully!");
    navigate("/orders");
  } catch (error) {
    console.error("Place Order Error:", error.response?.data || error.message);
    setMessage(error.response?.data?.message || "Failed to place order");
  } finally {
    setLoading(false);
  }
};


  return (
    <form className="place-order" onSubmit={handlePlaceOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="First name" required />
          <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Last name" required />
        </div>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" required />
        <input value={street} onChange={e => setStreet(e.target.value)} type="text" placeholder="Street" required />
        <div className="multi-fields">
          <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City" required />
          <input value={state} onChange={e => setState(e.target.value)} type="text" placeholder="State" required />
        </div>
        <div className="multi-fields">
          <input value={zip} onChange={e => setZip(e.target.value)} type="text" placeholder="Zip code" required />
          <input value={country} onChange={e => setCountry(e.target.value)} type="text" placeholder="Country" required />
        </div>
        <input value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="Phone" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{getTotalCartAmount()}$</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{getTotalCartAmount() === 0 ? 0 : 2}$</p>
          </div>
          <div className="cart-total-details">
            <b>Total</b>
            <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}$</b>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Placing order..." : "PROCEED TO PAYMENT"}
          </button>
          {message && <p>{message}</p>}
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
