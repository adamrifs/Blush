import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../urls";

const Overview = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch orders FIRST
      const ordersRes = await axios.get(
        `${serverUrl}/orders/admin/all`,
        { withCredentials: true }
      );

      const fetchedOrders = ordersRes.data.orders || [];
      setOrders(fetchedOrders);
      setRecentOrders(fetchedOrders.slice(0, 5));

      // 2️⃣ Fetch customers
      const customersRes = await axios.get(
        `${serverUrl}/customers/getCustomers`,
        { withCredentials: true }
      );
      setCustomers(customersRes.data.customers || []);

      // 3️⃣ Fetch products
      const productsRes = await axios.get(
        `${serverUrl}/product/getProduct`,
        { withCredentials: true }
      );
      setProducts(productsRes.data.products || []);

      setLoading(false);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && orders.length > 0) {
      axios.patch(
        `${serverUrl}/orders/admin/mark-read`,
        {},
        { withCredentials: true }
      );
    }
  }, [loading]);

  // console.log(orders)
  // ------------------ Calculations ------------------

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  const pendingOrders = orders.filter((o) => o.status?.toLowerCase() === "pending").length;

  const lowStock = products.filter((p) => p.stock <= 5).length;

  const today = new Date().toISOString().split("T")[0];

  const todaysRevenue = orders
    .filter(o =>
      o.createdAt?.split("T")[0] === today &&
      o.payment?.status === "paid"
    )
    .reduce((sum, o) => sum + (o.payment?.amount || 0), 0);



  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
    </div>;
  }


  // 🔹 Check if order is new (within last 10 minutes)
  const isNewOrder = (createdAt) => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = (now - orderTime) / 1000 / 60;
    return diffMinutes < 10;
  };

  // 🔹 Time ago formatter
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;

    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const pendingPaymentOrders = orders.filter(
    o => o.payment?.method !== "cod" && o.payment?.status === "pending"
  ).length;

  // const processingOrders = orders.filter(
  //   o => o.payment?.status === "paid" || o.payment?.method === "cod"
  // ).length;

  const isPaidOrder = (order) =>
    order.payment?.status === "paid" ||
    (order.payment?.method === "cod" && order.status === "delivered");

  // Weekly revenue
  const weeklyRevenue = orders
    .filter(isPaidOrder)
    .filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    })
    .reduce(
      (sum, o) => sum + (o.payment?.amount || o.totals?.grandTotal || 0),
      0
    );

  // monthly revenue
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyRevenue = orders
    .filter(isPaidOrder)
    .filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce(
      (sum, o) => sum + (o.payment?.amount || o.totals?.grandTotal || 0),
      0
    );


  return (
    <div className="p-6 overflow-y-auto font-Poppins">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <p className="text-center text-gray-500 mb-10">Blush Admin Panel Overview</p>

        <button
          onClick={fetchAllData}
          className="px-4 py-2 rounded-lg bg-[#2F3746] text-white hover:bg-black transition cursor-pointer"
        >
          Refresh
        </button>
      </div>


      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">

        <Card label="Total Orders" value={totalOrders} />
        <Card label="Total Customers" value={totalCustomers} />
        <Card label="Total Products" value={totalProducts} />
        <Card label="Pending Payment" value={pendingPaymentOrders} valueColor="text-orange-600" />
        {/* <Card label="Processing Orders" value={processingOrders} valueColor="text-blue-600"/> */}
        <Card label="Pending Orders" value={pendingOrders} />
        <Card label="Low Stock Products" value={lowStock} valueColor="text-red-500" />
        <Card label="Today's Revenue" value={`AED ${todaysRevenue}`} />
        <Card
          label="Weekly Revenue"
          value={`AED ${weeklyRevenue.toFixed(2)}`}
          valueColor="text-indigo-600"
        />

        <Card
          label="Monthly Revenue"
          value={`AED ${monthlyRevenue.toFixed(2)}`}
          valueColor="text-emerald-600"
        />


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
                <th className="py-2">Time</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-200"
                >
                  <td className="py-2 flex items-center gap-2">
                    <span>{order._id}</span>
                    {!order.isReadByAdmin && (
                      <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {order.shipping?.receiverName || "Unknown"}
                  </td>
                  <td className="py-2">
                    AED {order.payment?.amount || order.totals?.grandTotal || 0}
                  </td>

                  <td
                    className={`py-2 ${order.status?.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                      }`}
                  >
                    {order.payment?.method !== "cod" && order.payment?.status === "pending"
                      ? <span className="text-orange-600 font-semibold">Pending Payment</span>
                      : <span className="text-green-600">{order.status}</span>
                    }
                  </td>

                  <td className="py-2 text-sm text-gray-500">
                    {timeAgo(order.createdAt)}
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
