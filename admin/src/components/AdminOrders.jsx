import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../urls";
import { IoSearch } from "react-icons/io5";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";
import CustomDropdown from "./CustomSelect";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [statusDraft, setStatusDraft] = useState({});
    const [stats, setStats] = useState({
        totalOrders: 0,
        pending: 0,
        delivered: 0,
        revenue: 0,
    });
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // updating status state map
    const [updatingMap, setUpdatingMap] = useState({});

    // helper: format date dd-mm-yyyy
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const d = new Date(dateStr);
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        } catch {
            return dateStr;
        }
    };

    // fetch orders
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/orders/admin/all`, {
                withCredentials: true,
            });
            console.log(res)
            const orderList = res.data.orders || [];
            setOrders(orderList);

            // init status draft
            const draft = {};
            orderList.forEach((order) => {
                draft[order._id] = order.status;
            });
            setStatusDraft(draft);
            setFiltered(orderList);

            // stats
            const pendingCount = orderList.filter((o) => o.status === "pending").length;
            const deliveredCount = orderList.filter((o) => o.status === "delivered").length;
            const totalRevenue = orderList.reduce(
                (sum, o) => sum + (o.totals?.grandTotal || 0),
                0
            );

            setStats({
                totalOrders: orderList.length,
                pending: pendingCount,
                delivered: deliveredCount,
                revenue: totalRevenue,
            });
        } catch (err) {
            console.error("fetchOrders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filterByDateRange = (arr) => {
        if (!fromDate && !toDate) return arr;
        const start = fromDate ? new Date(fromDate) : null;
        // include full day for toDate
        const end = toDate ? new Date(new Date(toDate).setHours(23, 59, 59, 999)) : null;

        return arr.filter((order) => {
            const orderDate = new Date(order.createdAt || order.shipping?.deliveryDate || null);
            if (!orderDate || isNaN(orderDate)) return false;
            if (start && orderDate < start) return false;
            if (end && orderDate > end) return false;
            return true;
        });
    };

    // enhanced search & filters
    useEffect(() => {
        let data = [...orders];

        const q = query.trim().toLowerCase();

        if (q !== "") {
            data = data.filter((o) => {
                // order id partial
                const idMatch = o._id?.toString().toLowerCase().includes(q);

                // shipping fields
                const nameMatch = o.shipping?.receiverName?.toLowerCase().includes(q);
                const phoneMatch = o.shipping?.receiverPhone?.toLowerCase().includes(q);
                const emirateMatch = o.shipping?.emirate?.toLowerCase().includes(q);
                const areaMatch = o.shipping?.area?.toLowerCase().includes(q);
                const countryMatch =
                    (o.shipping?.country || "United Arab Emirates").toLowerCase().includes(q);

                // status
                const statusMatch = o.status?.toLowerCase().includes(q);

                // created date (dd-mm-yyyy)
                const createdDateStr = formatDate(o.createdAt);
                const dateMatch = createdDateStr.toLowerCase().includes(q);

                // product names inside items
                const productMatch = (o.items || []).some((item) => {
                    const productName =
                        item.productId?.name ||
                        item.productName ||
                        (item.productId && item.productId.name) ||
                        "";
                    return productName.toLowerCase().includes(q);
                });

                // totals
                const totalMatch = String(o.totals?.grandTotal || "").toLowerCase().includes(q);

                return (
                    idMatch ||
                    nameMatch ||
                    phoneMatch ||
                    emirateMatch ||
                    areaMatch ||
                    countryMatch ||
                    statusMatch ||
                    dateMatch ||
                    productMatch ||
                    totalMatch
                );
            });
        }

        // status filter
        if (statusFilter !== "all") {
            data = data.filter((o) => o.status === statusFilter);
        }

        // date range filter (applied after search + status)
        data = filterByDateRange(data);

        setFiltered(data);
        setCurrentPage(1);
    }, [query, statusFilter, orders, fromDate, toDate]);

    const statusColors = {
        pending: "bg-yellow-200 text-yellow-800",
        processing: "bg-blue-200 text-blue-800",
        out_for_delivery: "bg-purple-200 text-purple-800",
        delivered: "bg-green-200 text-green-800",
        cancelled: "bg-red-200 text-red-800",
    };

    const statusIcons = {
        pending: Clock,
        processing: Package,
        out_for_delivery: Truck,
        delivered: CheckCircle,
    };

    const updateStatus = async (orderId, newStatus) => {
        if (!newStatus) return;
        setUpdatingMap((p) => ({ ...p, [orderId]: true }));
        try {
            await axios.put(
                `${serverUrl}/orders/admin/${orderId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            // refresh orders after update
            await fetchOrders();
        } catch (err) {
            console.error("updateStatus error:", err);
        } finally {
            setUpdatingMap((p) => ({ ...p, [orderId]: false }));
        }
    };

    // pagination slice
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    // console.log(currentOrders)

    const statusOptions = [
        { label: "All Status", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Out for delivery", value: "out_for_delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
    ];

    const resolveImage = (img) => {
        if (!img) return "";
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || "";
        return "";
    };

    const templateClasses = {
        icedSilver: {
            background: "linear-gradient(135deg, #f8fafc, #eef2f7)",
            border: "1px solid #d1d5db",
        },
        luxury: {
            background: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
            border: "1px solid #c3a6ff",
        },
    };

    return (
        <div className="p-6 font-Poppins">
            <h1 className="text-3xl font-semibold mb-6">Orders Dashboard</h1>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-Poppins">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 text-center">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 text-center">
                    <h3 className="text-gray-500 text-sm">Pending Orders</h3>
                    <p className="text-3xl text-yellow-600 font-bold mt-2">{stats.pending}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 text-center">
                    <h3 className="text-gray-500 text-sm">Delivered</h3>
                    <p className="text-3xl text-green-600 font-bold mt-2">{stats.delivered}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 text-center">
                    <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                    <p className="text-3xl text-[#2F3746] font-bold mt-2">
                        AED {Number(stats.revenue || 0).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300 mb-6 flex flex-col md:flex-row gap-4 md:items-end">
                <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-sm text-gray-600 mb-1">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer"
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-sm text-gray-600 mb-1">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer"
                    />
                </div>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                {/* Search */}
                <div className="relative w-full md:w-[50%]">
                    <IoSearch className="absolute left-4 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, name, phone, product, date, emirate, total..."
                        className="w-full border border-gray-300 pl-12 pr-4 py-2 rounded-lg outline-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Status Filter */}

                <CustomDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    placeholder="All Status"
                />


            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
                </div>
            ) : (
                <>
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No orders found</p>
                    ) : (
                        <div className="space-y-6">
                            {currentOrders.map((order) => {
                                const StatusIcon = statusIcons[order.status] || Clock;

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-200 flex flex-col md:flex-row md:items-start gap-4"
                                    >
                                        {/* Left: thumbnails */}
                                        <div className="shrink-0">
                                            <div className="flex gap-2 overflow-x-auto max-w-[220px]">
                                                {order.items.map((item, idx) => {
                                                    return (
                                                        <img
                                                            key={idx}
                                                            src={resolveImage(item.productId?.image?.[0])}
                                                            alt={item.productId?.name || item.productName || "item"}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Middle: summary */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="font-semibold text-lg flex items-center gap-2">
                                                        Order #{order._id}

                                                        {/* 🆕 Card badge */}
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium
          ${order.cardMessage?.option === "want_card"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : order.cardMessage?.option === "empty_card"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-gray-200 text-gray-700"
                                                                }
        `}
                                                        >
                                                            {order.cardMessage?.option === "want_card"
                                                                ? "Card Message"
                                                                : order.cardMessage?.option === "empty_card"
                                                                    ? "Empty Card"
                                                                    : "No Card"}
                                                        </span>
                                                    </h2>

                                                    <p className="text-sm text-gray-500">
                                                        Placed on: {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div
                                                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                                                >
                                                    <StatusIcon size={16} />
                                                    {order.status.replace(/_/g, " ")}
                                                </div>
                                            </div>


                                            <div className="mt-3 text-gray-700">
                                                <p>
                                                    <b>Receiver:</b> {order.shipping?.receiverName || "-"}
                                                </p>
                                                <p>
                                                    <b>Phone:</b> {order.shipping?.receiverPhone || "-"}
                                                </p>
                                                <p>
                                                    <b>Location:</b> {order.shipping?.area || "-"}, {order.shipping?.emirate || "-"}
                                                </p>
                                                <p>
                                                    <b>Delivery:</b>{" "}
                                                    {order.shipping?.deliveryDate ? formatDate(order.shipping.deliveryDate) : "-"} •{" "}
                                                    {order.shipping?.deliverySlot || "-"}
                                                </p>
                                            </div>

                                            <p className="mt-3 font-semibold text-lg">
                                                Total: AED {Number(order.totals?.grandTotal || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Right: actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            {/* View Details button opens modal only */}
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="px-4 py-2 bg-[#2F3746] text-white rounded-lg cursor-pointer"
                                            >
                                                View Details
                                            </button>

                                            {/* Status update controls kept here (outside modal click zone) */}
                                            <div className="flex gap-2 items-center">
                                                <select
                                                    className="border px-3 py-2 rounded-lg cursor-pointer outline-0"
                                                    value={statusDraft[order._id] || order.status}
                                                    onChange={(e) => {
                                                        setStatusDraft((prev) => ({
                                                            ...prev,
                                                            [order._id]: e.target.value,
                                                        }));
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="out_for_delivery">Out for delivery</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>

                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation(); // safe-guard
                                                        const newStatus = statusDraft[order._id] || order.status;
                                                        await updateStatus(order._id, newStatus);
                                                    }}
                                                    className="px-4 py-2 rounded-lg bg-[#6B7280] text-white disabled:opacity-50 cursor-pointer"
                                                    disabled={Boolean(updatingMap[order._id])}
                                                >
                                                    {updatingMap[order._id] ? "Updating..." : "Update"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {filtered.length > 0 && (
                        <div className="flex justify-center mt-8 gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "bg-white hover:bg-gray-100 cursor-pointer"}`}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg border ${currentPage === i + 1 ? "bg-[#2F3746] text-white" : "bg-white hover:bg-gray-100 cursor-pointer"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "bg-white hover:bg-gray-100 cursor-pointer"}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {showModal && selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white w-[95%] max-w-5xl p-6 rounded-xl overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start">
                            <h2 className="text-[22px] font-semibold mb-4">Order Details – <span className="text-xl font-light mb-4 text-gray-500">#{selectedOrder._id}</span></h2>
                            <button onClick={() => setShowModal(false)} className="cursor-pointer text-red-500 font-semibold text-lg"> Close</button>
                        </div>

                        {/* customer & address */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Customer & Shipping Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                                <p><b>Receiver Name:</b> {selectedOrder.shipping?.receiverName || "-"}</p>
                                <p><b>Receiver Phone:</b> {selectedOrder.shipping?.receiverPhone || "-"}</p>

                                <p><b>Country:</b> {(selectedOrder.shipping?.country) || "United Arab Emirates"}</p>
                                <p><b>Emirate:</b> {selectedOrder.shipping?.emirate || "-"}</p>

                                <p><b>Area:</b> {selectedOrder.shipping?.area || "-"}</p>
                                <p><b>Street:</b> {selectedOrder.shipping?.street || "-"}</p>

                                <p><b>Building:</b> {selectedOrder.shipping?.building || "-"}</p>
                                <p><b>Flat:</b> {selectedOrder.shipping?.flat || "-"}</p>

                                <p><b>Delivery Date:</b> {selectedOrder.shipping?.deliveryDate ? formatDate(selectedOrder.shipping.deliveryDate) : "-"}</p>
                                <p><b>Delivery Slot:</b> {selectedOrder.shipping?.deliverySlot || "-"}</p>

                                <p><b>Delivery Charge:</b> AED {Number(selectedOrder.shipping?.deliveryCharge || 0).toFixed(2)}</p>
                                <p><b>Order Created:</b> {formatDate(selectedOrder.createdAt)}</p>
                            </div>
                        </div>

                        {/* Card Message */}
                        <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-[#F8F9FC]">
                            <h3 className="text-xl font-semibold mb-2 font-Poppins">Card Message</h3>

                            {/* WANT CARD */}
                            {/* Card Message Preview */}
                            {selectedOrder.cardMessage?.option === "want_card" && (
                                <div className="w-full mt-6">

                                    <div
                                        className="relative rounded-[20px] shadow-lg transition-all duration-300"
                                        style={{
                                            width: "340px",
                                            height: "490px",
                                            padding: "20px",
                                            margin: "0 auto",
                                            ...(templateClasses[selectedOrder.cardMessage.template] || {}),
                                        }}
                                    >
                                        {/* Brand */}
                                        <p className="tracking-[4px] text-[#e00e7d] font-bold text-xl font-chopard opacity-70 text-center pb-4">
                                            BLUSH
                                        </p>

                                        {/* Luxury ribbon effect */}
                                        {selectedOrder.cardMessage.template === "luxury" && (
                                            <>
                                                <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#c3a6ff] rounded-tl-xl"></span>
                                                <span className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#c3a6ff] rounded-tr-xl"></span>
                                                <span className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#c3a6ff] rounded-bl-xl"></span>
                                                <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#c3a6ff] rounded-br-xl"></span>
                                            </>
                                        )}

                                        {/* Message */}
                                        {selectedOrder.cardMessage.messageHTML?.trim() === "" ? (
                                            <p className="text-gray-400 text-base mt-5">
                                                No message content
                                            </p>
                                        ) : (
                                            <div
                                                className="text-gray-800 leading-relaxed text-base sm:text-[18px] break-words whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedOrder.cardMessage.messageHTML,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* EMPTY CARD */}
                            {selectedOrder.cardMessage?.option === "empty_card" && (
                                <p className="text-sm italic text-gray-600">
                                    Customer requested an <b>empty card</b>.
                                </p>
                            )}

                            {/* NO CARD */}
                            {selectedOrder.cardMessage?.option === "no_card" && (
                                <p className="text-sm italic text-gray-600">
                                    Customer did <b>not</b> want a card.
                                </p>
                            )}

                            {/* SAFETY FALLBACK */}
                            {!selectedOrder.cardMessage && (
                                <p className="text-sm italic text-gray-500">
                                    No card preference provided.
                                </p>
                            )}
                        </div>


                        {/* items */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-2">Ordered Items</h3>

                            {selectedOrder.items.map((item, idx) => {
                                const img = resolveImage(item.productId?.image?.[0]) || "https://placehold.co/200";
                                const name = item.productId?.name || item.productName || "Item";
                                const price = Number(item.price || item.productId?.price || 0);
                                const qty = Number(item.quantity || 1);
                                const itemTotal = price * qty;
                                return (
                                    <div key={idx} className="flex items-center gap-4 mb-4 border-b border-gray-200 pb-3">
                                        <img src={img} alt={name} className="w-20 h-20 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{name}</p>
                                            <p>Qty: {qty}</p>
                                            <p>Price: AED {price.toFixed(2)} <span className="text-gray-500 text-xs">VAT Excl.</span></p>
                                            {/* <p className="font-medium">Item Total: AED {itemTotal.toFixed(2)}</p> */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* pricing */}
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Price Summary</h3>
                            <p><b>Bagtotal:</b> AED {Number(selectedOrder.totals?.bagTotal || 0).toFixed(2)}</p>
                            <p><b>Delivery Fee:</b> AED {Number(selectedOrder.totals?.deliveryCharge || selectedOrder.shipping?.deliveryCharge || 0).toFixed(2)}</p>
                            <p className="text-xl font-bold mt-2">Grand Total: AED {Number(selectedOrder.totals?.grandTotal || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
