import { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const API_URL = import.meta.env.VITE_API_URL; 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          API_URL+"/api/orders/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (!orders.length) return <p className="empty">No orders found.</p>;

  return (
    <div className="orders-page">
      <h2 className="orders-title"> My Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <span className="order-id">
                Order #{order._id.slice(-6)}
              </span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleDateString()} •{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="order-address">📍 {order.address}</p>

            <div className="order-items">
              {order.items.map((item) =>
                item.productId ? (
                  <div className="order-item" key={item._id}>
                    <span>
                      {item.productId.name} × {item.quantity}
                    </span>
                    <span>
                      $
                      {item.productId.price * item.quantity}
                    </span>
                  </div>
                ) : null
              )}
            </div>

            <div className="order-footer">
              <span className="order-status">
                ⏳ {order.status}
              </span>
              <span className="order-total">
                Total: ${order.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
