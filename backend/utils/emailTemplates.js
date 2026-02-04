exports.baseTemplate = ({ title, content }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f0f0f;
      padding: 20px;
    }
    .container {
      max-width: 650px;
      background: #151515;
      margin: auto;
      border-radius: 10px;
      overflow: hidden;
      color: #eaeaea;
    }
    .header {
      background: linear-gradient(90deg, #8a6b2f, #d4af37);
      padding: 20px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
    .content {
      padding: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #2a2a2a;
      padding: 10px;
    }
    th {
      background: #1f1f1f;
      text-align: left;
    }
    .row {
      display: flex;
      gap: 16px;
      margin-top: 20px;
    }
    .box {
      flex: 1;
      background: #1b1b1b;
      padding: 14px;
      border-radius: 6px;
      font-size: 13px;
    }
    .label {
      color: #bfa14a;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .footer {
      padding: 15px;
      font-size: 12px;
      color: #999;
      text-align: center;
      border-top: 1px solid #2a2a2a;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      ${title}
    </div>

    <div class="content">
      ${content}
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Blush Flowers
    </div>
  </div>
</body>
</html>
`;

const formatPrice = (value) => Number(value || 0).toFixed(2);

exports.orderTable = (order) => `
<table>
  <thead>
    <tr>
      <th>Product</th>
      <th>Qty</th>
    </tr>
  </thead>
  <tbody>
    ${order.items.map(item => `
      <tr>
        <td>${item.productId}</td>
        <td>${item.quantity}</td>
      </tr>
    `).join("")}
  </tbody>
</table>

<table style="margin-top:12px">
  <tr>
    <td>Bag Total</td>
    <td>AED ${formatPrice(order.totals?.bagTotal)}</td>
  </tr>
  <tr>
    <td>Delivery</td>
    <td>AED ${formatPrice(order.totals?.deliveryCharge)}</td>
  </tr>
  <tr>
    <td>VAT</td>
    <td>AED ${formatPrice(order.totals?.vatAmount)}</td>
  </tr>
  <tr>
    <td><strong>Total</strong></td>
    <td><strong>AED ${formatPrice(order.totals?.grandTotal)}</strong></td>
  </tr>
</table>
`;


exports.orderPlacedContent = (order) => `
<p>You’ve received a new order.</p>

<p>
  <strong>Order #${order._id}</strong><br/>
  Payment Method: ${order.payment.method.toUpperCase()}<br/>
  Payment Status: ${order.payment.status}
</p>

${exports.orderTable(order)}

<p style="margin-top:14px">
  <strong>Delivery Date:</strong>
  ${new Date(order.shipping.deliveryDate).toDateString()}<br/>
  <strong>Delivery Slot:</strong> ${order.shipping.deliverySlot}<br/>
  <strong>Delivery Charge:</strong>
  AED ${formatPrice(order.shipping.deliveryCharge)}
</p>

<div class="row">
  <div class="box">
    <div class="label">Receiver Details</div>
    ${order.shipping.receiverName}<br/>
    ${order.shipping.receiverPhone}<br/>
    ${order.shipping.area}, ${order.shipping.emirate}<br/>
    ${order.shipping.building}, ${order.shipping.flat}
  </div>

  <div class="box">
    <div class="label">Order Info</div>
    Status: ${order.status}<br/>
    COD Amount: AED ${formatPrice(order.payment.amount)}<br/>
    VAT: AED ${formatPrice(order.payment.vat)}
  </div>
</div>

<p style="margin-top:20px">Congratulations on the sale 🎉</p>
`;

