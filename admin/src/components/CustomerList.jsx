import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../urls";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    // add near other useState declarations
    const [expandedOrders, setExpandedOrders] = useState({});
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${serverUrl}/customers/getCustomers`, {
                withCredentials: true,
            });
            setCustomers(res.data.customers);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

// console.log("customers",customers)
    // Export to CSV
    const exportCSV = () => {
        const rows = [
            ["Name", "Email", "Phone", "Total Orders", "Joined On"],
            ...customers.map((c) => [
                c.name,
                c.email,
                c.phone,
                c.totalOrders,
                new Date(c.createdAt).toLocaleDateString("en-GB"),
            ]),
        ];

        let csvContent =
            "data:text/csv;charset=utf-8," +
            rows.map((e) => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "customers.csv";
        link.click();
    };

    // Filter customers
    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const fetchCustomerOrders = async (customerId) => {
        try {
            const res = await axios.get(`${serverUrl}/orders/byCustomer/${customerId}`);
            setCustomerOrders(res.data.orders);
            setShowOrders(true);
        } catch (err) {
            console.log(err);
        }
    };

    const getStatusBadge = (status) => {
        const base = "px-3 py-1 rounded-full text-xs font-semibold";

        switch (status) {
            case "pending":
                return `${base} bg-yellow-100 text-yellow-700`;
            case "processing":
                return `${base} bg-blue-100 text-blue-700`;
            case "out_for_delivery":
                return `${base} bg-purple-100 text-purple-700`;
            case "delivered":
                return `${base} bg-green-100 text-green-700`;
            case "cancelled":
                return `${base} bg-red-100 text-red-700`;
            default:
                return `${base} bg-gray-200 text-gray-700`;
        }
    };

    return (
        <div className="p-6">
            {/* TITLE + ACTION BUTTONS */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-[#2F3746]">Customers</h1>

                <button
                    onClick={exportCSV}
                    className="px-5 py-2 bg-[#b89bff] hover:bg-[#a880ff] 
                               text-white rounded-xl shadow-md transition-all"
                >
                    Export CSV
                </button>
            </div>

            {/* SEARCH FIELD */}
            <div className="mb-6">
                <input
                    className="border border-gray-300 px-4 py-2 rounded-xl 
                               w-full max-w-md shadow-sm focus:ring-2 focus:ring-[#b89bff] outline-0"
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F8F9FC] text-[#6C737F]">
                        <tr className="text-sm">
                            <th className="p-4 font-medium text-left">Name</th>
                            <th className="p-4 font-medium text-left">Email</th>
                            {/* <th className="p-4 font-medium text-left">Phone</th> */}
                            <th className="p-4 font-medium text-left">Orders</th>
                            <th className="p-4 font-medium text-left">Joined</th>
                            <th className="p-4 font-medium ">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {/* LOADING STATE */}
                        {loading && (
                            <tr>
                                <td colSpan="6">
                                    <div className="flex items-center justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* SHOW TABLE ROWS ONLY WHEN NOT LOADING */}
                        {!loading && currentCustomers.map((cust) => (
                            <tr
                                key={cust._id}
                                className="border-b border-gray-300 last:border-0 hover:bg-[#F7F7FB] transition"
                            >
                                <td className="p-4">{cust.name}</td>
                                <td className="p-4">{cust.email}</td>
                                {/* <td className="p-4">{cust.phone}</td> */}
                                <td className="p-4">{cust.totalOrders}</td>
                                <td className="p-4">
                                    {new Date(cust.createdAt).toLocaleDateString("en-GB")}
                                </td>

                                <td className="p-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setSelectedCustomer(cust)}
                                        className="px-3 py-1 text-sm bg-[#4988F1] hover:bg-[#3b74d0]
                            text-white rounded-lg shadow cursor-pointer font-Poppins"
                                    >
                                        Details
                                    </button>

                                    <button
                                        onClick={() => fetchCustomerOrders(cust._id)}
                                        className="px-3 py-1 text-sm bg-[#28C77F] hover:bg-[#22a96c]
                            text-white rounded-lg shadow cursor-pointer font-Poppins"
                                    >
                                        View Orders
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* NO DATA STATE */}
                        {!loading && currentCustomers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    No customers found
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6">
                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full shadow text-sm
                                ${currentPage === i + 1
                                    ? "bg-[#b89bff] text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* CUSTOMER DETAILS MODAL */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white w-[95%] max-w-[480px] p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-[#2F3746]">
                            Customer Details
                        </h2>

                        <p><b>Name:</b> {selectedCustomer.name}</p>
                        <p><b>Email:</b> {selectedCustomer.email}</p>
                        {/* <p><b>Phone:</b> {selectedCustomer.phone}</p> */}
                        <p><b>Total Orders:</b> {selectedCustomer.totalOrders}</p>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW ORDERS MODAL */}
            {showOrders && (
                <div className="fixed inset-0 bg-black/40  flex items-center justify-center overflow-auto p-4 z-[9999]">
                    <div className="bg-white w-[95%] max-w-[820px] rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                        {/* HEADER */}
                        <div className="flex justify-between items-start gap-4 border-b pb-3">
                            <h2 className="text-2xl font-semibold text-[#2F3746]">Customer Orders</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowOrders(false)}
                                    className="text-gray-500 hover:text-gray-700 text-xl p-2 rounded-md"
                                    aria-label="Close orders modal"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* NO ORDERS */}
                        {customerOrders.length === 0 && (
                            <p className="text-center text-gray-500 mt-6 text-lg">No orders found.</p>
                        )}

                        {/* ORDER LIST */}
                        <div className="mt-4 space-y-4">
                            {customerOrders.map((o) => (
                                <div
                                    key={o._id}
                                    className="rounded-2xl border border-gray-200 p-4 bg-[#FAFAFD] shadow-sm"
                                >
                                    {/* ORDER SUMMARY — responsive grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Order ID</p>
                                            <p
                                                className="font-semibold text-[#2F3746] truncate max-w-[260px]"
                                                title={o._id}
                                            >
                                                {o._id}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-xs">Status</p>
                                            <span className={getStatusBadge(o.status)}>
                                                {o.status.replace(/_/g, " ")}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-gray-500 text-xs">Total</p>
                                            <p className="font-semibold text-[#28C77F]">
                                                AED {o.totals?.grandTotal}
                                            </p>
                                        </div>

                                        <div className="text-right sm:text-left">
                                            <p className="text-gray-500 text-xs">Date</p>
                                            <p className="font-semibold">
                                                {new Date(o.createdAt).toLocaleDateString("en-GB")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="border-t border-gray-300 my-3" />

                                    {/* ITEMS: show only first item by default to save height */}
                                    <h3 className="text-sm font-semibold text-[#2F3746] mb-2">Items</h3>

                                    <div className="space-y-3">
                                        {(expandedOrders[o._id] ? o.items : o.items.slice(0, 1)).map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-300"
                                                >
                                                    {/* PRODUCT INFO */}
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm truncate">
                                                            {item.productId?.name || "Product"}
                                                        </p>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            <span className="block">Qty: {item.quantity}</span>
                                                            <span className="block">Price: AED {item.productId?.price}</span>
                                                            {item.addons?.length > 0 && (
                                                                <div className="mt-1">
                                                                    <span className="font-medium text-xs">Addons:</span>
                                                                    <div className="text-xs text-gray-600">
                                                                        {item.addons.map((a, i) => (
                                                                            <div key={i}>• {a.name} — AED {a.price}</div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* PRODUCT IMAGE */}
                                                    {item.productId?.image?.[0] && (
                                                        // support array entries that are strings or objects with .url
                                                        <img
                                                            src={
                                                                typeof item.productId.image[0] === "string"
                                                                    ? item.productId.image[0]
                                                                    : item.productId.image[0]?.url || ""
                                                            }
                                                            alt={item.productId?.name}
                                                            className="w-14 h-14 rounded-lg object-cover ml-4 border border-gray-200"
                                                        />
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Show expand/collapse if more than 1 item */}
                                    {o.items.length > 1 && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() =>
                                                    setExpandedOrders((prev) => ({
                                                        ...prev,
                                                        [o._id]: !prev[o._id],
                                                    }))
                                                }
                                                className="text-sm px-3 py-1 bg-[#b89bff] text-white rounded-lg hover:bg-[#a27aff]"
                                            >
                                                {expandedOrders[o._id] ? "Hide items" : `Show all (${o.items.length})`}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* FOOTER CLOSE BUTTON */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowOrders(false)}
                                className="px-5 py-2 bg-[#2F3746] text-white rounded-xl hover:bg-[#1d2530] transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default CustomerList;
