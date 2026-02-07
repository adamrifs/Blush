import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../url";
import floral from "../assets/floral.png";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import api from "../utils/axiosInstance";

const TrackOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`${serverUrl}/orders/${id}`, {
                withCredentials: true,
            });
            setOrder(res.data.order);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const steps = [
        { key: "pending", label: "Order Placed", icon: Clock },
        { key: "processing", label: "Preparing Order", icon: Package },
        { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
        { key: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const getStepStatus = (stepKey) => {
        const orderStatus = order?.status?.toLowerCase().trim();
        const stepIndex = steps.findIndex((s) => s.key === stepKey);
        const currentIndex = steps.findIndex((s) => s.key === orderStatus);

        // 🔥 FIX: if delivered, mark all steps as completed
        if (orderStatus === "delivered") {
            if (stepKey === "delivered") return "completed";
            if (stepIndex < currentIndex) return "completed";
            return "upcoming";
        }

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "upcoming";
    };



    // ---------------------------------------------------
    // 📌 ETA CALCULATION (Based on time slot)
    // ---------------------------------------------------
    const calculateETA = () => {
        const slot = order?.shipping?.deliverySlot;
        if (!slot) return null;

        // OLD orders (string)
        if (typeof slot === "string") {
            const parts = slot.split("–").map((s) => s.trim());
            return parts[1] || slot;
        }

        // NEW orders (object)
        if (slot.time) {
            const parts = slot.time.split("–").map((s) => s.trim());
            return parts[1] || slot.time;
        }

        return null;
    };


    const eta = calculateETA();

    if (loading) {
        return <p className="text-center mt-20 font-Poppins">Loading order...</p>;
    }

    if (!order) {
        return (
            <div>
                <Navbar />

                <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden">
                    {/* Floral Background */}
                    <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
                        <img src={floral} className="w-full object-cover" alt="floral-bg" />
                    </div>

                    <div className="relative z-10 flex items-center justify-center min-h-[70vh]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl
                                   shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                                   border border-gray-100
                                   text-center max-w-md w-[90%]"
                        >
                            <Package size={48} className="mx-auto text-[#b89bff]" />

                            <h2 className="text-2xl font-semibold mt-4">
                                Order Not Found
                            </h2>

                            <p className="text-gray-500 mt-3 leading-relaxed">
                                We couldn’t find an order with this tracking ID.
                                Please check the ID and try again.
                            </p>

                            <div className="mt-6">
                                <a
                                    href="/"
                                    className="inline-block px-6 py-3 rounded-full
                                           bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                                           text-white font-medium
                                           shadow-md hover:shadow-lg
                                           transition"
                                >
                                    Back to Home
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }


    return (
        <div>
            <Navbar />
            <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden">

                {/* Floral Background */}
                <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
                    <img src={floral} className="w-full object-cover" alt="floral-bg" />
                </div>

                <div className="relative z-10 w-[92%] sm:w-[80%] md:w-[55%] lg:w-[45%] mx-auto pt-10">

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-3xl md:text-4xl font-semibold"
                    >
                        Track Your Order
                    </motion.h1>

                    <p className="text-center text-gray-500 mt-2">
                        Order ID: <span className="text-[#b89bff] font-medium">{order?._id}</span>
                    </p>

                    {/* ETA BOX */}
                    {eta && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white rounded-2xl px-6 py-4 shadow-lg text-center"
                        >
                            <p className="text-sm tracking-wide">Estimated Delivery Time</p>
                            <p className="font-semibold text-xl mt-1">{eta}</p>
                        </motion.div>
                    )}

                    {/* Order Timeline */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold mb-6">Order Status</h2>

                        <div className="relative">

                            {/* Animated Vertical Line */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "100%" }}
                                transition={{ duration: 1.4, ease: "easeOut" }}
                                className="absolute left-[14px] top-0 w-[2px] bg-gray-200"
                            />

                            <div className="space-y-10 relative z-10">
                                {steps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    const status = getStepStatus(step.key);

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.25 }}
                                            className="flex items-start gap-6"
                                        >
                                            {/* Animated Step Icon */}
                                            <motion.div
                                                animate={{
                                                    scale: status === "current" ? [1, 1.1, 1] : 1,
                                                    boxShadow:
                                                        status === "current"
                                                            ? "0px 0px 12px rgba(184, 155, 255, 0.8)"
                                                            : "none",
                                                }}
                                                transition={{ repeat: status === "current" ? Infinity : 0, duration: 1.5 }}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center
                                            ${status === "completed"
                                                        ? "bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white"
                                                        : status === "current"
                                                            ? "border-2 border-[#b89bff] bg-white text-[#b89bff]"
                                                            : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                <StepIcon size={18} />
                                            </motion.div>

                                            {/* Label */}
                                            <div>
                                                <p className="font-semibold text-lg">{step.label}</p>

                                                {status === "completed" && (
                                                    <p className="text-sm text-gray-400">Completed</p>
                                                )}
                                                {status === "current" && (
                                                    <p className="text-sm text-[#b89bff] font-medium">
                                                        In Progress...
                                                    </p>
                                                )}
                                                {status === "upcoming" && (
                                                    <p className="text-sm text-gray-400">
                                                        Not yet started
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Show Delivered Details when order is delivered */}
                    {order.status === "delivered" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-8 bg-green-50 border border-green-300 p-6 rounded-2xl shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-600" size={26} />
                                <p className="text-lg font-semibold text-green-700">
                                    Delivered on{" "}
                                    {new Date(order.shipping.deliveryDate).toLocaleDateString("en-GB")}
                                </p>
                            </div>

                            <p className="text-gray-600 mt-2 text-sm">
                                Your package has been successfully delivered.
                            </p>

                            {order.shipping.receiverName && (
                                <p className="text-gray-600 mt-1 text-sm">
                                    <span className="font-medium">Received by:</span> {order.shipping.receiverName}
                                </p>
                            )}

                            {order.shipping.deliverySlot && (
                                <p className="text-gray-600 mt-1 text-sm">
                                    <span className="font-medium">Delivered During:</span> {typeof order.shipping.deliverySlot === "string"
                                        ? order.shipping.deliverySlot
                                        : `${order.shipping.deliverySlot.title} (${order.shipping.deliverySlot.time})`}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Delivery Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>

                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Receiver:</span> {order.shipping.receiverName}
                        </p>

                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Phone:</span> {order.shipping.receiverPhone}
                        </p>

                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Address:</span>{" "}
                            {order.shipping.flat}, {order.shipping.building}, {order.shipping.street},{" "}
                            {order.shipping.area}, {order.shipping.emirate}
                        </p>

                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold">Delivery Slot:</span>{" "}
                            {typeof order.shipping.deliverySlot === "string"
                                ? order.shipping.deliverySlot
                                : `${order.shipping.deliverySlot.title} (${order.shipping.deliverySlot.time})`}
                        </p>

                        <p className="text-gray-600">
                            <span className="font-semibold">Delivery Date:</span>{" "}
                            {new Date(order.shipping.deliveryDate).toLocaleDateString("en-GB")}
                        </p>
                    </motion.div>

                    <div className="h-20"></div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TrackOrder;
