import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../urls";

const Overview = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // GET ORDERS
      const ordersRes = await axios.get(`${serverUrl}/orders/admin/all`, {
        withCredentials: true
      });
      setOrders(ordersRes.data.orders || []);

      // GET CUSTOMERS
      const customersRes = await axios.get(`${serverUrl}/customers/getCustomers`, {
        withCredentials: true
      });
      setCustomers(customersRes.data.customers || []);

      // GET PRODUCTS
      const productsRes = await axios.get(`${serverUrl}/product/getProduct`, {
        withCredentials: true
      });
      setProducts(productsRes.data.products || []);

      setLoading(false);
    } catch (error) {
      console.log("Dashboard Fetch Error:", error);
      setLoading(false);
    }
  };

  console.log(orders)
  // ------------------ Calculations ------------------

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const pendingOrders = orders.filter((o) => o.status?.toLowerCase() === "pending").length;

  const lowStock = products.filter((p) => p.stock <= 5).length;

  const today = new Date().toISOString().split("T")[0];

  const todaysRevenue = orders
    .filter(o => o.createdAt?.split("T")[0] === today)
    .reduce((sum, o) => sum + (o.payment?.amount || 0), 0);


  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
    </div>;
  }

  return (
    <div className="p-6 overflow-y-auto font-Poppins">

      {/* Header */}
      <p className="text-center text-gray-500 mb-10">Blush Admin Panel Overview</p>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">

        <Card label="Total Orders" value={totalOrders} />
        <Card label="Total Customers" value={totalCustomers} />
        <Card label="Total Products" value={totalProducts} />
        <Card label="Pending Orders" value={pendingOrders} />
        <Card label="Low Stock Products" value={lowStock} valueColor="text-red-500" />
        <Card label="Today's Revenue" value={`AED ${todaysRevenue}`} />

      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200">
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.shipping?.receiverName || "Unknown"}</td>
                  <td className="py-2">AED {order.payment?.amount || order.totals?.grandTotal || 0}</td>

                  <td
                    className={`py-2 ${order.status?.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                      }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* LOW STOCK */}
      <div className="bg-white shadow-md p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">Low Stock Alerts</h3>

        {lowStock === 0 ? (
          <p className="text-gray-500">All products are sufficiently stocked.</p>
        ) : (
          <ul className="list-disc ml-6">
            {products
              .filter((p) => p.stock <= 5)
              .map((item) => (
                <li key={item._id} className="text-red-600">
                  {item.name} — Stock: {item.stock}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Reusable Card Component
const Card = ({ label, value, valueColor }) => (
  <div className="bg-white shadow-md p-6 rounded-xl">
    <p className="text-gray-500">{label}</p>
    <h3 className={`text-3xl font-semibold ${valueColor}`}>{value}</h3>
  </div>
);

export default Overview;
