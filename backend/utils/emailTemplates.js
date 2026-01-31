exports.baseTemplate = ({ title, content }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f6f7fb;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: auto;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }
    .header {
      background: #6f52ff;
      padding: 20px;
      color: #fff;
      text-align: center;
    }
    .content {
      padding: 24px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th, td {
      border: 1px solid #eee;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #f3f3f3;
    }
    .footer {
      padding: 15px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h2>${title}</h2>
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

exports.orderTable = (order) => `
<table>
  <thead>
    <tr>
      <th>Product</th>
      <th>Qty</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    ${order.items.map(item => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>AED ${item.price}</td>
      </tr>
    `).join("")}
  </tbody>
</table>

<p><strong>Total:</strong> AED ${order.totals.grandTotal}</p>
`;
