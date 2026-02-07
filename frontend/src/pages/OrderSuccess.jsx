import React from "react";
import { CheckCircle } from "lucide-react";
import floral from "../assets/floral.png"; // use your floral if needed
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderSuccess = () => {
    const { state } = useLocation();
    const order = state?.order;

    const formatDate = (dateString) => {
        if (!dateString) return "Tomorrow";

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // ----------------------- SAME CALCULATION AS PaymentStep -----------------------

    const bagTotalInclusive = Number(order?.totals?.bagTotal || 0);       // inclusive
    const deliveryExclusive = Number(order?.totals?.deliveryCharge || 0); // exclusive
    const vatAmount = Number(order?.totals?.vatAmount || 0);              // total VAT
    const grandTotal = Number(order?.totals?.grandTotal || 0);            // inclusive

    // 1) BAG EXCLUSIVE (reverse VAT)
    const bagTotalExclusive = Number((bagTotalInclusive / 1.05).toFixed(2));

    // 2) BAG VAT
    const bagVAT = Number((bagTotalExclusive * 0.05).toFixed(2));

    // 3) BAG TOTAL INCLUSIVE (same as saved)
    const bagInclusive = Number((bagTotalExclusive + bagVAT).toFixed(2));

    // 4) DELIVERY VAT (5%)
    const deliveryVAT = Number((deliveryExclusive * 0.05).toFixed(2));

    // 5) DELIVERY INCLUSIVE
    const deliveryInclusive = Number((deliveryExclusive + deliveryVAT).toFixed(2));

    // 6) TOTAL BEFORE VAT (exclusive)
    const totalBeforeVAT = Number((bagTotalExclusive + deliveryExclusive).toFixed(2));

    // 7) TOTAL VAT (same as payment page)
    const totalVAT = Number((totalBeforeVAT * 0.05).toFixed(2));

    // 8) GRAND TOTAL (inclusive)
    const finalGrandTotal = Number((bagInclusive + deliveryInclusive).toFixed(2));


    return (
        <div>

            <Navbar />
            <div className="min-h-screen w-full bg-white font-Poppins flex flex-col items-center relative overflow-hidden">

                {/* Floral Background Top */}
                <div className="absolute top-0 left-0 w-full opacity-[0.08] pointer-events-none">
                    <img src={floral} className="w-full object-cover" />
                </div>

                {/* Content */}
                <div className="mt-10 w-[92%] sm:w-[80%] md:w-[55%] lg:w-[45%] z-[10]">

                    {/* Success Badge */}
                    <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] shadow-xl">
                        <CheckCircle className="text-white" size={48} />
                    </div>

                    {/* Heading */}
                    <h1 className="text-center text-3xl md:text-4xl font-semibold mt-6">
                        Order Confirmed!
                    </h1>

                    <p className="text-center text-gray-500 mt-2">
                        Thank you for your order. Your beautiful gift is on its way.
                    </p>

                    {/* Order Card */}
                    <div className="mt-10 bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7">

                        {/* Order ID */}
                        <div className="flex justify-between mb-6">
                            <p className="text-gray-400 font-medium">Order ID</p>
                            <p className="font-semibold text-[#b89bff]">{order?._id || "BL-459238"}</p>
                        </div>

                        <hr className="border-gray-200 my-4" />

                        {/* Delivery Info */}
                        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

                        <div className="space-y-2">
                            <p className="text-gray-500">
                                <span className="font-medium text-black">Date: </span>
                                {formatDate(order?.shipping?.deliveryDate)}
                            </p>


                            <p className="text-gray-500">
                                <span className="font-medium text-black">Time Slot: </span>
                                {order?.shipping?.deliverySlot
                                    ? `${order.shipping.deliverySlot.title} (${order.shipping.deliverySlot.time})`
                                    : "10 AM – 01 PM"}
                            </p>

                            <p className="text-gray-500">
                                <span className="font-medium text-black">Receiver: </span>
                                {order?.shipping?.receiverName || "Receiver Name"}
                            </p>
                        </div>

                        <hr className="border-gray-200 my-4" />

                        {/* Price Info */}
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3">

                            {/* Bag Total (inclusive) */}
                            <div className="flex justify-between">
                                <p className="text-gray-500">Bag Total (incl. VAT)</p>
                                <p className="font-medium">AED {bagInclusive.toFixed(2)}</p>
                            </div>

                            {/* Delivery Exclusive */}
                            {/* <div className="flex justify-between">
                                <p className="text-gray-500">Delivery (exclusive)</p>
                                <p className="font-medium">AED {deliveryExclusive.toFixed(2)}</p>
                            </div> */}

                            {/* Delivery VAT */}
                            {/* <div className="flex justify-between">
                                <p className="text-gray-500">Delivery VAT (5%)</p>
                                <p className="font-medium">AED {deliveryVAT.toFixed(2)}</p>
                            </div> */}

                            {/* Delivery Total inclusive */}
                            <div className="flex justify-between">
                                <p className="text-gray-500">Delivery (incl. VAT)</p>
                                <p className="font-medium">AED {deliveryInclusive.toFixed(2)}</p>
                            </div>

                            <hr className="border-gray-200 my-4" />

                            {/* Total Before VAT */}
                            <div className="flex justify-between">
                                <p className="text-gray-500 font-medium">Total Before VAT</p>
                                <p className="font-medium">AED {totalBeforeVAT.toFixed(2)}</p>
                            </div>

                            {/* VAT */}
                            <div className="flex justify-between">
                                <p className="text-gray-500">VAT (5%)</p>
                                <p className="font-medium">AED {totalVAT.toFixed(2)}</p>
                            </div>

                            <hr className="border-gray-200 my-4" />

                            {/* Grand Total */}
                            <div className="flex justify-between text-xl font-semibold">
                                <p>Total</p>
                                <p>AED {finalGrandTotal.toFixed(2)}</p>
                            </div>

                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <Link
                            to="/"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="w-full py-4 rounded-full text-center border border-[#bca8ff] text-[#b89bff] font-semibold shadow-sm hover:bg-[#f8f2ff] transition"
                        >
                            Back to Home
                        </Link>

                        <Link
                            to={`/track-order/${order?._id}`}
                            className="w-full py-4 rounded-full text-center text-white font-medium bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] shadow-md hover:shadow-lg transition"
                        >
                            Track Your Order
                        </Link>
                    </div>

                    <p className="text-center text-gray-400 text-sm mt-8 mb-10">
                        A confirmation email has been sent to you.
                    </p>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
