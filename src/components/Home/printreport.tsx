type OrderItem = {
  sku: string;
  name: string;
  qty: number;
  price: number;
};

type RowDataType = {
  orderId?: string;
  customerName?: string;
  address?: string;
  phone?: string;
  deliveryMethod?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
};

export const generatePrintHTML = (rowData: any): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Order Receipt</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 20px;
          background: #f7f7f7;
          color: #333;
        }
        .receipt {
          max-width: 1024px;
          margin: auto;
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #ea122d;
        }
        .order-info {
          text-align: right;
          font-size: 14px;
        }
        .section {
          margin-top: 30px;
        }
        .section h2 {
          font-size: 16px;
          color: #555;
          margin-bottom: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .details {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .details div {
          width: 48%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 14px;
        }
        th, td {
          text-align: left;
          padding: 10px;
          border: 1px solid #e1e1e1;
        }
        th {
          background-color: #ea122d;
          color: #fff;
        }
        .totals {
          margin-top: 20px;
          float: right;
          width: 40%;
        }
        .totals td {
          padding: 8px;
        }
        .totals td.label {
          text-align: right;
          font-weight: bold;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
        @media print {
          .print-btn { display: none; }
          body {
            background: #fff;
            padding: 0;
          }
          .receipt {
            box-shadow: none;
            margin: 0;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">SML</div>
          <div class="order-info">
            <strong>Order #</strong> ${rowData.orderId || "N/A"}<br>
            <strong>Date:</strong> ${new Date().toLocaleDateString()}
          </div>
        </div>

        <div class="section">
          <h2>Billing & Shipping</h2>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${rowData.customerOnInvoice || "John Doe"}<br>
              ${rowData.address || "123 Main St"}<br>
              customerType: ${rowData.customerType || "(000) 000-0000"}
            </div>
            <div>
              <strong>Shipped To:</strong><br>
              ${rowData.customerOnInvoice || "John Doe"}<br>
              ${rowData.address || "123 Main St"}<br>
              invoice Date : ${rowData.invoiceDate || "12-04-20222"}
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${
                rowData.items?.map(
                  (item: { sku: any; name: any; qty: number; price: number; }) => `
                    <tr>
                      <td>${item.sku}</td>
                      <td>${item.name}</td>
                      <td>${item.qty}</td>
                      <td>$${item.price.toFixed(2)}</td>
                      <td>$${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  `
                ).join("") || ""
              }
            </tbody>
          </table>
        </div>

        <table class="totals">
          <tr><td class="label">Subtotal:</td><td>$${rowData.subtotal?.toFixed(2) || "0.00"}</td></tr>
          <tr><td class="label">Shipping:</td><td>$${rowData.shipping?.toFixed(2) || "0.00"}</td></tr>
          <tr><td class="label">Tax:</td><td>$${rowData.tax?.toFixed(2) || "0.00"}</td></tr>
          <tr><td class="label"><strong>Total:</strong></td><td><strong>$${rowData.total?.toFixed(2) || "0.00"}</strong></td></tr>
        </table>

        <div style="clear: both;"></div>
        <div class="footer">
          Thank you for shopping with SmartStore!<br>
          For support, contact support@smartstore.com
        </div>
      </div>
    </body>
    </html>
  `;
};
