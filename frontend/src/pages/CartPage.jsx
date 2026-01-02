import React, { useEffect, useState } from "react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../../url";
import Footer from "../components/Footer";
import { CiDiscount1 } from "react-icons/ci";
import { HiPlus } from "react-icons/hi2";
import { IoMdPaper } from "react-icons/io";
import { PiTrashThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import CategoryNav from "../components/CategoryNav";

const CartPage = () => {
    const { cart, setCart, cartCount, setCartCount, sessionId, fetchCartCount, token } = useContext(ProductContext)
    const [showPopup, setShowPopup] = useState(false);
    const nav = useNavigate()

    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            const response = await api.put(serverUrl + `/cart/updateCart`, { productId, sessionId, quantity }, {
                withCredentials: true
            })
            fetchCartCount()
            console.log(response.data)
            // toast.success('quantity updated')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleRemoveCart = async (productId) => {
        try {
            const response = await api.delete(serverUrl + `/cart/removeCart`, {
                data: { productId, sessionId },
                withCredentials: true
            });

            // Remove from UI instantly
            setCart(prev =>
                prev.filter(item => item.productId._id.toString() !== productId)
            );
            setCartCount(prev => prev - 1);

            // Re-fetch after slight delay (optional)
            setTimeout(fetchCartCount, 200);

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };



    // __________________________ calculations ___________________________________________

    const subTotal = cart.reduce((total, item) => {
        const itemPrice = item.basePrice * item.quantity;
        const addonPrice = item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
        return total + itemPrice + addonPrice;
    }, 0);


    // console.log('cart', cart)

    let deliveryCharges;
    if (subTotal >= 500) {
        deliveryCharges = 0
    } else if (cart.length === 0) {
        deliveryCharges = 0
    } else {
        deliveryCharges = 500
    }

    const total = subTotal;
    // console.log('cart:::', cart)

    const goToCheckout = () => {
        window.scrollTo(0, 0)
        if (cart.length === 0) {
            setShowPopup(true)
            return
        }
        if (token) {
            nav('/checkout', { state: { cart, subTotal, deliveryCharges, total } })

        } else {
            nav('/login', {
                state: {
                    from: '/checkout',
                    cart,
                    subTotal,
                    deliveryCharges,
                    total
                },
            });
        }
    }

    const onClose = () => {
        setShowPopup(false)
    }
    return (
        <div className="bg-[#f7f6f2] min-h-screen w-full overflow-x-hidden">
            <AnnouncementBar />
            <Navbar />
            <CategoryNav />
            
            <div className="maincontainer md:w-[72%] w-[94%] max-w-[1400px] min-h-[85vh] mx-auto mb-10 relative">
                <div className="py-5 mt-2">
                    <h1 className="font-chopard md:text-4xl text-2xl">Basket</h1>
                </div>

                <div className="subContainerleft&right md:flex flex-row items-start md:justify-between md:gap-4 h-auto w-full mb-5">
                    {/* left container */}
                    <div className="leftContainer md:w-[60%] w-full h-auto flex flex-col items-start gap-4">
                        {/* cart product cards */}
                        {cart.map((item, index) => (
                            <div
                                className="artCard bg-white w-full md:h-[150px] h-auto rounded-[14px] flex flex-row md:flex-row md:items-center gap-3 md:gap-5 p-3"
                                key={index}
                            >
                                <div className="w-[95px] h-[90px] md:w-[120px] md:h-[120px] rounded-[10px] overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                                    <img
                                        src={item?.productId?.image[0]?.url || item?.productId?.image[0]}
                                        className="w-full h-full object-cover"
                                        alt={item.productId.name}
                                    />
                                </div>

                                <div className="flex flex-col flex-1 h-full gap-6 md:gap-0 justify-between w-full md:w-auto">
                                    <h2 className="font-Poppins md:text-[16px] text-sm text-center md:text-left">
                                        {item.productId.name}
                                    </h2>

                                    {/* Quantity buttons */}
                                    <div className="mt-2 md:mt-0 w-[130px] md:w-[150px] h-9 md:h-10 rounded-full border border-[#b89bff] flex items-center justify-between px-1 mx-auto md:mx-0">
                                        <button
                                            className="text-lg font-Poppins hover:bg-[#d2e1e8] w-8 h-8 rounded-full cursor-pointer transition duration-300 active:scale-90 text-[#b89bff]"
                                            onClick={() => {
                                                if (item.quantity > 1) {
                                                    handleUpdateQuantity(item.productId._id, item.quantity - 1);
                                                } else {
                                                    handleRemoveCart(item.productId._id)
                                                }
                                            }}
                                        >
                                            {item.quantity === 1 ? <PiTrashThin className="ml-[6px] text-[#b89bff] " /> : '- '}
                                        </button>
                                        <span className="font-Poppins">{item.quantity}</span>
                                        <button
                                            className="text-lg font-Poppins hover:bg-[#d2e1e8] w-8 h-8 rounded-full cursor-pointer transition duration-300 active:scale-90 text-[#b89bff] "
                                            onClick={() =>
                                                handleUpdateQuantity(item.productId._id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="cartCardPrice flex items-end md:items-end justify-center md:justify-end mt-2 md:mt-0 w-full md:w-auto md:h-full">
                                    <h2 className="font-Poppins md:text-lg text-sm text-center md:text-right">
                                        AED{" "}
                                        <span className="font-semibold md:text-2xl text-lg">
                                            {(item.basePrice * item.quantity * 1.05).toFixed(2)}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* right container */}
                    <div className="rightContainer md:w-[40%] w-full h-auto mt-5 md:mt-0 flex flex-col gap-5">
                        <div className="Promocode h-[60px] md:h-[70px] md:w-full md:gap-3 rounded-[10px] cursor-pointer bg-white flex items-center justify-between px-4 active:scale-95 transition duration-300">
                            <CiDiscount1 className="text-2xl flex-shrink-0" />
                            <h2 className="font-Poppins flex-1 text-center md:text-left">
                                Add a promo code
                            </h2>
                            <HiPlus className="text-2xl flex-shrink-0" />
                        </div>

                        <div className="orderSummary bg-white rounded-[10px] w-full h-auto p-4 px-6 pb-6">
                            <h2 className="flex items-center gap-3 text-lg font-Poppins">
                                <IoMdPaper className="text-2xl" /> Order Summary
                            </h2>

                            <div className="flex items-center justify-between mt-8">
                                <h3 className="font-Poppins text-sm">Subtotal</h3>
                                <h3 className="font-Poppins text-lg">
                                    AED <span className="font-semibold text-2xl">{(subTotal * 1.05).toFixed(2)}</span>
                                </h3>
                            </div>

                            <div className="flex items-center justify-between mt-5">
                                <h3 className="font-Poppins text-sm">Delivery charges</h3>
                                <h3 className="font-Poppins text-xs text-right text-gray-400">
                                    {/* AED <span className="font-semibold text-2xl">{deliveryCharges}</span> */}
                                    Delivery Charge will be calculated at checkout
                                </h3>
                            </div>

                            <p className="font-Poppins text-[10px] mt-3 text-gray-400 w-[90%] leading-snug">
                                Please note that specific regions and express delivery may incur extra delivery fees
                            </p>

                            <div className="horizontalLine w-full h-[1px] bg-gray-200 mt-4"></div>

                            <div className="flex items-center justify-between mt-5">
                                <h3 className="font-Poppins text-sm">Total</h3>
                                <h3 className="font-Poppins text-lg">
                                    AED <span className="font-semibold text-2xl">{(total * 1.05).toFixed(2)}</span>
                                </h3>
                            </div>
                        </div>

                        {/* checkout button */}
                        <div className="bg-white md:bg-transparent h-[70px] w-full fixed bottom-0 left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center z-10 px-2">
                            <button className="py-3 md:py-4 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white font-Poppins font-normal text-[15px] tracking-wide rounded-full transition-all duration-300 ease-in-out active:scale-95 flex items-center justify-center gap-3 cursor-pointer w-full sm:w-[90%] md:w-full z-10"
                                onClick={goToCheckout}>
                                Proceed To Checkout <span className="font-semibold">AED {(total * 1.05).toFixed(2)}</span>
                            </button>
                        </div>
                    </div>
                </div>
                {
                    showPopup && (
                        <div className="fixed inset-0 bg-white/50 bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-[16px] shadow-lg w-[90%] max-w-[400px] p-6 text-center relative">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                                >
                                    &times;
                                </button>

                                <h2 className="font-Poppins text-lg text-gray-800 mb-4">
                                    Please select a product before proceeding to checkout
                                </h2>

                                <button
                                    onClick={() => {
                                        nav("/product-listing")
                                        window.scrollTo(0, 0)
                                    }}
                                    className="font-Poppins cursor-pointer bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] 
          shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] 
          hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white transition-all duration-300 ease-in-out 
          px-6 py-3 rounded-full w-full active:scale-95"
                                >
                                    Go to Products
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>

            <Footer />
        </div>

    );
};

export default CartPage;
