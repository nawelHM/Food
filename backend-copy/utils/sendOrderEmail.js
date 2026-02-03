import nodemailer from "nodemailer";

const sendOrderEmail = async (to, order, user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ⬅️ important pour dev local
    },
  });

  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;">${item.productId.name}</td>
          <td style="padding:8px;">${item.quantity}</td>
          <td style="padding:8px;">$${item.productId.price}</td>
          <td style="padding:8px;">$${item.productId.price * item.quantity}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family: Arial; max-width:600px">
      <h2>🍽️ Order Confirmation</h2>
      <p>Hello <b>${user.name || "Customer"}</b>,</p>
      <p>Your order has been placed successfully.</p>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Delivery Address:</b> ${order.address}</p>
      <table border="1" cellspacing="0" cellpadding="0" width="100%">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <h3>Total Paid: $${order.amount}</h3>
      <p>Thank you for ordering with us ❤️</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Food App 🍔" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🧾 Your Order Confirmation",
    html,
  });
};

export default sendOrderEmail;
