import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Clock, Truck, CheckCircle, ChevronDown, ChevronUp, Search, FileDown } from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { jsPDF } from "jspdf";
import { serverUrl } from "../../../url";
import floral from "../../assets/floral.png";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";
import api from '../../utils/axiosInstance';
import CustomDropdown from '../CustomDropdown';

const MyOrders = () => {
    const nav = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const limit = 4;
    const totalPages = Math.ceil(filteredOrders.length / limit);

    const statusStyles = {
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

    // Fetch orders
    const fetchOrders = async () => {
        try {
            const res = await api.get(`${serverUrl}/orders/user/${userId}`, {
                withCredentials: true,
            });
            setOrders(res.data.orders || []);
            setFilteredOrders(res.data.orders || []);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // console.log(orders)

    useEffect(() => {
        if (userId) fetchOrders();
    }, [userId]);

    // Search + Filter
    useEffect(() => {
        let data = [...orders];

        if (query.trim() !== "") {
            data = data.filter((o) =>
                o._id.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            data = data.filter((o) => o.status === statusFilter);
        }

        setFilteredOrders(data);
        setPage(1);
    }, [query, statusFilter, orders]);

    const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

    // console.log('orders>>', paginatedOrders)
    // Expand/Collapse items
    const toggleExpand = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    const resolveImage = (img) => {
        if (!img) return "";
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || "";
        return "";
    };

    const formatDeliverySlot = (slot) => {
        if (!slot) return "-";
        if (typeof slot === "string") return slot; // old orders
        return `${slot.title} (${slot.time})`;     // new orders
    };


    const statusOptions = [
        { label: "All Status", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Out for Delivery", value: "out_for_delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
    ];


    // Invoice PDF
    const downloadInvoice = (order) => {
        const doc = new jsPDF("p", "pt", "a4");

        // -------------------------
        //  Blush Gradient Header
        // -------------------------
        const gradient = doc.context2d.createLinearGradient(0, 0, 600, 0);
        gradient.addColorStop(0, "#b89bff");
        gradient.addColorStop(1, "#d6b8ff");
        doc.context2d.fillStyle = gradient;
        doc.context2d.fillRect(0, 0, 600, 90);

        // -------------------------
        //  Logo in Header
        // -------------------------
        doc.addImage(logo, "PNG", 30, 20, 140, 45);

        // Title inside gradient header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("INVOICE", 500, 50, { align: "right" });

        // -------------------------
        // ORDER DETAILS SECTION
        // -------------------------
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);

        doc.text(`Order ID: ${order._id}`, 30, 130);
        doc.text(
            `Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`,
            30,
            150
        );

        // -------------------------
        // SHIPPING DETAILS
        // -------------------------
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Delivery Details", 30, 185);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(
            `${order.shipping.receiverName}  
${order.shipping.flat}, ${order.shipping.building}  
${order.shipping.street}, ${order.shipping.area}, ${order.shipping.emirate}  
Phone: ${order.shipping.receiverPhone}`,
            30,
            205
        );

        // -------------------------
        // ITEMS TABLE
        // -------------------------
        const tableRows = order.items.map((item, i) => [
            i + 1,
            item.productId.name,
            item.quantity,
            `AED ${item.productId.price}`,
            `AED ${item.productId.price * item.quantity}`,
        ]);

        autoTable(doc, {
            startY: 270,
            head: [["#", "Item", "Qty", "Price", "Total"]],
            body: tableRows,
            theme: "grid",
            headStyles: {
                fillColor: [184, 155, 255],
                textColor: 255,
                fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [246, 242, 255] },
            styles: { cellPadding: 6 },
        });

        const finalY = doc.lastAutoTable.finalY + 30;

        // -------------------------
        // TOTALS BOX (Blush theme)
        // -------------------------
        doc.setFillColor(249, 248, 244);
        doc.roundedRect(30, finalY, 540, 120, 10, 10, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor("#b89bff");
        doc.text("Payment Summary", 50, finalY + 25);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);

        doc.text(`Subtotal: AED ${order.totals.bagTotal}`, 50, finalY + 55);
        doc.text(`VAT (5%): AED ${order.totals.vatAmount}`, 50, finalY + 75);
        doc.text(`Delivery Charge: AED ${order.shipping.deliveryCharge}`, 50, finalY + 95);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor("#b89bff");
        doc.text(
            `Grand Total: AED ${order.totals.grandTotal}`,
            350,
            finalY + 95
        );

        // -------------------------
        // FOOTER — THANK YOU
        // -------------------------
        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(120, 120, 120);
        doc.text(
            "Thank you for shopping with Blush. We are honored to make your moments special.",
            300,
            finalY + 170,
            { align: "center" }
        );

        doc.save(`Invoice-${order._id}.pdf`);
    };


    // -----------------------
    //  EMPTY ORDER PAGE
    // -----------------------
    if (!loading && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9f8f4] px-6">
                <div className="mainContainer w-full max-w-lg h-[60vh] flex flex-col items-center justify-center bg-[#f9f8f4] rounded-lg border border-[#e9e9e9] text-center p-6 shadow-md">

                    <div className="text-gray-400 mb-6">
                        <ShoppingCart size={64} strokeWidth={1.2} />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-Poppins text-gray-800 mb-6">
                        You don't have any previous orders with <span className="font-semibold font-chopard">Blush</span>
                    </h2>

                    <button
                        className="px-6 py-3 rounded-[12px] font-Poppins cursor-pointer bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white transition-all duration-300 ease-in-out"
                        onClick={() => nav('/product-listing')}>
                        Place your first order now
                    </button>
                </div>
            </div>
        );
    }

    // -----------------------
    // FULL ORDERS PAGE
    // -----------------------

    return (
        <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden">

            {/* Floral BG */}
            <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
                <img src={floral} className="w-full object-cover" />
            </div>

            <div className="relative z-10 w-[92%] sm:w-[80%] md:w-[60%] mx-auto pt-24">

                {/* Title */}
                <h1 className="text-center text-3xl md:text-4xl font-semibold">
                    My Orders
                </h1>

                {/* Search & Filters */}
                <div className="mt-8 flex flex-col md:flex-row items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative w-full md:w-[60%]">
                        <Search className="absolute left-4 top-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur outline-0"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-[40%] flex justify-center md:justify-end">
                        <CustomDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            placeholder="All Status"
                        />
                    </div>

                </div>

                {/* ORDERS LIST */}
                <div className="mt-10 space-y-6">
                    {paginatedOrders.map((order) => {
                        const StatusIcon = statusIcons[order.status] || Clock;

                        return (
                            <div
                                key={order._id}
                                className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4 flex-wrap">
                                    <h2 className="text-lg font-semibold">Order #{order._id}</h2>

                                    <div
                                        className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusStyles[order.status]}`}
                                    >
                                        <StatusIcon size={16} />
                                        {order.status.replace(/_/g, " ")}
                                    </div>
                                </div>

                                {/* Product thumbnails */}
                                <div
                                    className="flex gap-4 overflow-x-auto cursor-pointer"
                                    onClick={() => toggleExpand(order._id)}
                                >
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <img
                                            key={idx}
                                            src={resolveImage(item.productId.image[0])}
                                            className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                                        />
                                    ))}

                                    {order.items.length > 3 && (
                                        <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                                            +{order.items.length - 3}
                                        </div>
                                    )}

                                    {expandedOrder === order._id ? (
                                        <ChevronUp className="text-gray-500" />
                                    ) : (
                                        <ChevronDown className="text-gray-500" />
                                    )}
                                </div>

                                {/* Expanded Item List */}
                                {expandedOrder === order._id && (
                                    <div className="mt-4 bg-white/70 p-4 rounded-xl border">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between py-2 border-b last:border-none"
                                            >
                                                <p>{item.productId.name} <span className='text-gray-400'> x </span> {item.quantity}</p>
                                                <p>AED {item.productId.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Delivery Info */}
                                <div className="mt-4 text-gray-700">
                                    <p>
                                        <span className="font-medium">Delivery:</span>{" "}
                                        {new Date(order.shipping.deliveryDate)
                                            .toLocaleDateString("en-GB")
                                            .replace(/\//g, "-")} • {formatDeliverySlot(order.shipping.deliverySlot)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.shipping.area}, {order.shipping.emirate}
                                    </p>
                                </div>

                                {/* Total */}
                                <div className="mt-4 font-semibold text-[17px]">
                                    Total: AED {order.totals.grandTotal}
                                </div>

                                {/* Buttons */}
                                <div className="mt-5 flex gap-4">
                                    <Link
                                        to={`/track-order/${order._id}`}
                                        className="flex-1 py-3 rounded-full text-center text-white font-medium bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] shadow-md hover:shadow-lg transition"
                                    >
                                        Track Order
                                    </Link>

                                    <button
                                        onClick={() => downloadInvoice(order)}
                                        className="flex items-center justify-center gap-2 flex-1 py-3 rounded-full border border-[#bca8ff] text-[#b89bff] font-medium hover:bg-[#f8f2ff]"
                                    >
                                        <FileDown size={18} />
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {filteredOrders.length > limit && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 rounded-full border border-gray-300 bg-white/70 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <p className="font-medium">{page} / {totalPages}</p>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 rounded-full border border-gray-300 bg-white/70 disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}

                <div className="h-20"></div>
            </div>
        </div>
    );
};

export default MyOrders;
