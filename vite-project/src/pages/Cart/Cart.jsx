import React, { useContext } from "react";
import "./cart.css";
import { StoreContext } from "../../content/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItem,
    removeFromCart,
    getTotalCartAmount,
    food_list, // ✅ depuis le backend
  } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-header">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {/* ✅ Cart items */}
        {food_list.map((item) => {
          const qty = cartItem[item._id];

          if (qty > 0) {
            return (
              <div className="cart-items-item" key={item._id}>
                <img
                  src={`http://localhost:4000${item.image}`}
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{qty}</p>
                <p>${item.price * qty}</p>
                <p
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                >
                  X
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* TOTAL */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>
              $
              {getTotalCartAmount() === 0
                ? 0
                : getTotalCartAmount() + 2}
            </b>
          </div>

          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
