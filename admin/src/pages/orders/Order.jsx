import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Order.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(
        "❌ Fetch admin orders error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;

  return (
    <div className="admin-orders">
      <h2>📦 Placed Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{order.userId?.name}</strong>
                    <br />
                    <small>{order.userId?.email}</small>
                  </td>

                  <td className="items-cell">
                    {order.items.map((item) => (
                      <div key={item._id}>
                        {item.productId?.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td>${order.amount}</td>

                  <td className="address-cell">{order.address}</td>

                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
