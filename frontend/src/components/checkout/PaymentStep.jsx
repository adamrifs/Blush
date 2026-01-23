// /mnt/data/PaymentStep.jsx
import React, { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import card from '../../assets/card.png'
import tabby from '../../assets/tabby.png'
import tamara from '../../assets/tamara.png'
import applePay from '../../assets/applepay.png'
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../../url";
import { useToast } from "../../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance.js";

const PaymentStep = ({
    deliverySlot,
    deliveryDate,
    deliveryEmirate,
    receiverName,
    receiverPhone,
    area,
    street,
    building,
    flat,
    cardMessageData
}) => {
    const { cart, setCart, sessionId, fetchCartCount } = useContext(ProductContext);
    const { showToast } = useToast()
    const navigate = useNavigate()

    if (!cart || cart.length === 0) {
        return (
            <div className="w-full text-center py-10">
                <h2 className="font-Poppins text-2xl font-medium">Order Summary</h2>
                <p className="text-gray-500 mt-4">Your cart is empty.</p>
            </div>
        );
    }
    console.log('cart', cart)
    const deliveryCharge = deliverySlot?.price || 0;


    // ----------------- VAT CALCULATION FIXED -------------------

    // 1) BAG TOTAL EXCLUSIVE (basePrice + addons)
    const bagTotalExclusive = cart.reduce((total, item) => {
        const base = (item.basePrice || 0) * item.quantity;

        const addons = (item.addons || []).reduce(
            (sum, addon) => sum + (addon.price || 0),
            0
        ) * item.quantity;

        return total + base + addons;
    }, 0);

    // 2) BAG VAT (5%)
    const bagVAT = Number((bagTotalExclusive * 0.05).toFixed(2));

    // 3) BAG TOTAL INCLUSIVE (what you SHOW)
    const bagTotalInclusive = Number((bagTotalExclusive + bagVAT).toFixed(2));

    // 4) DELIVERY EXCLUSIVE (slot raw price)
    const deliveryExclusive = Number(deliverySlot?.price || 0);

    // 5) DELIVERY VAT (5%)
    const deliveryVAT = Number((deliveryExclusive * 0.05).toFixed(2));

    // 6) DELIVERY INCLUSIVE (what you SHOW)
    const deliveryInclusive = Number((deliveryExclusive + deliveryVAT).toFixed(2));

    // 7) TOTAL BEFORE VAT (only exclusive values)
    const totalBeforeVAT = Number(
        (bagTotalExclusive + deliveryExclusive).toFixed(2)
    );

    // 8) VAT (bag + delivery)
    const vat = Number((totalBeforeVAT * 0.05).toFixed(2));

    // 9) GRAND TOTAL (final amount user pays)
    const grandTotal = Number((bagTotalInclusive + deliveryInclusive).toFixed(2));

    // ------ DISPLAY FORMATS ------
    const bagTotalInclusiveDisplay = bagTotalInclusive.toFixed(2);
    const deliveryInclusiveDisplay = deliveryInclusive.toFixed(2);
    const totalBeforeVATDisplay = totalBeforeVAT.toFixed(2);
    const vatDisplay = vat.toFixed(2);
    const grandTotalDisplay = grandTotal.toFixed(2);
    const deliveryExclusiveDisplay = deliveryExclusive.toFixed(2);



    const [method, setMethod] = useState("card");
    const [agree, setAgree] = useState(false);

    const radioBase =
        "w-5 h-5 rounded-full border border-[#bca8ff] cursor-pointer flex items-center justify-center";
    const radioSelected =
        "bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)]";


    const handlePayment = async () => {
        if (!agree) {
            showToast("Please agree to Terms & Conditions", "warning");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            showToast("Please login to continue", "warning");
            return;
        }

        try {
            // ===================== TABBY =====================
            if (method === "tabby") {
                showToast("Comming Soon...", "info")
                // const res = await api.post(`${serverUrl}/payment/tabby`, {
                //     cart,
                //     totals: {
                //         grandTotal: Number(grandTotalDisplay),
                //     },
                //     shipping: {
                //         receiverName,
                //         receiverPhone,
                //         emirate: deliveryEmirate,
                //         area,
                //         street,
                //     },
                //     user: {
                //         email: user.email,
                //         phone: user.phone,
                //         name: user.name || receiverName,
                //     },
                // });

                // window.location.href = res.data.url;
                // return;
            }

            // ===================== STRIPE (CARD / APPLE PAY) =====================
            if (method === "card" || method === "applepay") {
                const res = await api.post(
                    `${serverUrl}/payment/create-stripe-session`,
                    {
                        cart,
                        totals: {
                            bagTotal: Number(bagTotalInclusiveDisplay),
                            deliveryCharge: Number(deliveryExclusiveDisplay),
                            vatAmount: Number(vatDisplay),
                            grandTotal: Number(grandTotalDisplay),
                        },
                        shipping: {
                            receiverName,
                            receiverPhone,
                            emirate: deliveryEmirate,
                            area,
                            street,
                            building,
                            flat,
                            deliveryDate,
                            deliverySlot: deliverySlot?.title,
                        },
                        cardMessage: cardMessageData,
                        userId: user._id,
                    },
                    { withCredentials: true }
                );

                window.location.href = res.data.url;
                return;
            }

        } catch (error) {
            console.error(error);
            showToast("Payment initiation failed. Please try again.", "error");
        }
    };



    // ___________________________ create order _________________________________
    // const createOrder = async () => {
    //     try {
    //         const user = JSON.parse(localStorage.getItem("user"));
    //         const userId = user?._id;
    //         if (!agree) {
    //             showToast("Please agree to Terms & Conditions", "warning");
    //             return;
    //         }
    //         if (!userId) {
    //             showToast("Please login to continue", "warning");
    //             return;
    //         }

    //         // Build order payload exactly as backend schema expects
    //         const payload = {
    //             userId: userId,

    //             // CART ITEMS
    //             items: cart.map((item) => ({

    //                 productId: item.productId._id,
    //                 quantity: item.quantity,
    //                 addons: item.addons || []
    //             })),

    //             // SHIPPING DETAILS
    //             shipping: {
    //                 receiverName: receiverName,
    //                 receiverPhone: receiverPhone,
    //                 country: "United Arab Emirates",
    //                 emirate: deliveryEmirate,
    //                 area: area,
    //                 street: street,
    //                 building: building,
    //                 flat: flat,
    //                 deliveryDate: deliveryDate,
    //                 deliverySlot: deliverySlot?.selectedTime || deliverySlot?.title,
    //                 deliveryCharge: deliveryCharge
    //             },

    //             // PAYMENT DETAILS
    //             payment: {
    //                 method: method,
    //                 status: "paid",
    //                 transactionId: "TEST123",
    //                 orderId: "TEST_ORDER_ID",
    //                 amount: Number(grandTotalDisplay),
    //                 vat: Number(vatDisplay)
    //             },

    //             // TOTALS
    //             totals: {
    //                 bagTotal: Number(bagTotalInclusiveDisplay),
    //                 deliveryCharge: Number(deliveryExclusiveDisplay),
    //                 vatAmount: Number(vatDisplay),
    //                 grandTotal: Number(grandTotalDisplay)
    //             },
    //             cardMessage: cardMessageData

    //         };

    //         // CREATE ORDER API CALL
    //         const res = await api.post(`${serverUrl}/orders/create`, payload, {
    //             withCredentials: true,
    //             showLoader: true,
    //         });

    //         const createdOrder = res.data.order;

    //         await api.delete(`${serverUrl}/cart/clearCart`, {
    //             data: { sessionId },
    //             withCredentials: true,
    //         });

    //         setCart([]);
    //         fetchCartCount();
    //         navigate("/order-success", { state: { order: createdOrder } });
    //         window.scrollTo(0, 0)

    //     } catch (error) {
    //         console.log(error);
    //         showToast("Failed to create order", "error");
    //     }
    // };

    return (
        <div className="w-full px-4 font-Poppins">

            {/* Title */}
            <h2 className="text-2xl text-center font-medium mb-10">
                Order Summary.
            </h2>

            {/* Cart Items */}
            {cart.map((item) => {
                const product = item.productId; // FIX

                return (
                    <div key={item._id} className="flex justify-between mb-10">

                        {/* Image */}
                        <img
                            src={product?.image?.[0]?.url || product?.image?.[0]}
                            alt={product?.name}
                            className="w-[120px] h-[120px] rounded-xl object-cover bg-gray-100"
                        />

                        {/* Details */}
                        <div className="flex-1 px-5">
                            <h3 className="font-semibold text-[18px]">{product?.name}</h3>

                            <p className="text-gray-400 mt-1">
                                {product?.description?.slice(0, 45)}...
                            </p>

                            <p className="text-[#b89bff] mt-2 font-semibold text-[16px]">
                                AED {(item.basePrice * 1.05).toFixed(2)}
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center">
                            <p className="text-[18px] font-medium">{item.quantity}</p>
                        </div>

                    </div>
                );
            })}


            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-6" />

            {/* Summary */}
            <div className="space-y-4">

                {/* Bag Total */}
                <div className="flex justify-between">
                    <p className="text-gray-400 font-medium">Bag Total</p>
                    <p className="font-medium">AED {bagTotalInclusiveDisplay}</p>
                </div>

                {/* Discount */}
                <div className="flex justify-between">
                    <p className="font-medium text-[#b89bff]">Discount</p>
                    <p className="text-[#b89bff]">( AED 0.00 )</p>
                </div>

                {/* Delivery */}
                <div className="mt-4">
                    <p className="font-medium">
                        Delivery | {deliverySlot?.title} {deliveryEmirate && `| ${deliveryEmirate}`}
                    </p>

                    <p className="text-gray-500 text-sm">
                        {deliverySlot?.selectedTime || deliverySlot?.title}
                    </p>


                    <div className="flex justify-between mt-1">
                        <p></p>
                        <p className="font-medium">AED {deliveryInclusiveDisplay}</p>
                    </div>
                </div>

                {/* Total Before VAT */}
                <div className="flex justify-between mt-3">
                    <p className="font-medium text-gray-400">Total Before VAT</p>
                    <p className="font-medium">AED {totalBeforeVATDisplay}</p>
                </div>

                {/* VAT */}
                <div className="flex justify-between mt-3">
                    <p className="font-medium">VAT (5%)</p>
                    <p className="font-medium">AED {vatDisplay}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-200 my-6" />

            {/* TOTAL */}
            <div className="flex justify-between font-semibold text-[18px]">
                <p>TOTAL</p>
                <p>AED {grandTotalDisplay}</p>
            </div>

            <div className="paymentSection h-auto mt-10 w-screen md:-translate-x-[30.5%] -translate-x-[10%] px-5 md:px-0 font-Poppins border-t border-gray-200 ">

                <h2 className="text-center text-3xl font-semibold mb-10 mt-8">Payment Method.</h2>

                <div className="flex flex-col gap-6 w-full md:w-[60%] mx-auto">

                    {/* ------- Pay with Card ------- */}
                    <div
                        className="flex items-center justify-between py-5 border-b border-gray-200"
                        onClick={() => setMethod("card")}
                    >
                        <div className="flex items-center gap-4 cursor-pointer">
                            <div className={`${radioBase} ${method === "card" && radioSelected}`}>
                                {method === "card" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                            </div>
                            <p className="text-lg">Pay with Card</p>
                        </div>

                        <div className="div h-20 w-40 md:w-50">
                            <img src={card} className="w-full h-full object-cover opacity-80" />
                        </div>
                    </div>

                    {/* ------- Pay with Apple Pay ------- */}
                    {/* <div
                        className="flex items-center justify-between py-5 border-b border-gray-200"
                        onClick={() => setMethod("applepay")}
                    >
                        <div className="flex items-center gap-4 cursor-pointer">
                            <div className={`${radioBase} ${method === "applepay" && radioSelected}`}>
                                {method === "applepay" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                            </div>
                            <p className="text-lg">Apple Pay</p>
                        </div>

                        <img src={applePay} className="w-30 h-20 object-contain" />
                    </div> */}


                    {/* ------- Pay with Tamara ------- */}
                    {/* <div
                        className="flex items-center justify-between py-5 border-b border-gray-200"
                        onClick={() => setMethod("tamara")}
                    >
                        <div className="flex items-center gap-4 cursor-pointer">
                            <div className={`${radioBase} ${method === "tamara" && radioSelected}`}>
                                {method === "tamara" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                            </div>
                            <p className="text-lg">Pay with Tamara</p>
                        </div>

                        <div className="div w-30 h-20">
                            <img
                                src={tamara}
                                className="h-full w-full object-contain opacity-80"
                            />
                        </div>
                    </div> */}

                    {/* ------- Pay with Tabby ------- */}
                    <div
                        className="flex items-center justify-between py-5 border-b border-gray-200"
                        onClick={() => setMethod("tabby")}
                    >
                        <div className="flex items-center gap-4 cursor-pointer">
                            <div className={`${radioBase} ${method === "tabby" && radioSelected}`}>
                                {method === "tabby" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                )}
                            </div>
                            <p className="text-lg">Pay with Tabby</p>
                        </div>

                        <div className="div w-20 h-20">
                            <img
                                src={tabby}
                                className="h-full w-full object-cover opacity-80"
                            />
                        </div>
                    </div>

                    {/* ------- Terms & Conditions ------- */}
                    <div
                        className="flex items-center gap-4 mt-3 cursor-pointer"
                        onClick={() => setAgree(!agree)}
                    >
                        <div className={`${radioBase} ${agree && radioSelected}`}>
                            {agree && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <p className="text-lg">
                            I agree to the{" "}
                            <span className="text-[#b89bff] font-semibold cursor-pointer">
                                Terms & Conditions
                            </span>
                        </p>
                    </div>

                    {/* ------- Pay Now Button ------- */}
                    <button
                        className="mt-8 w-full py-4 rounded-full text-white text-lg font-medium
          bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
          border border-[#bca8ff]
          shadow-[0_2px_8px_rgba(0,0,0,0.1)]
          hover:from-[#a27aff] hover:to-[#cda5ff]
          hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
          transition-all duration-300 cursor-pointer"
                        onClick={handlePayment}
                    // onClick={createOrder}
                    >
                        Pay Now (AED {grandTotalDisplay})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentStep;