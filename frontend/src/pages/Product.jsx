import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import { ProductContext } from '../context/ProductContext'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Pagination } from 'swiper/modules'
import 'swiper/css/pagination'
import { GiBeachBag } from "react-icons/gi";
import { GiHand, GiEmerald } from "react-icons/gi";
import { MdPayment } from "react-icons/md";
import { FaPaypal, FaCcVisa, FaApplePay, FaCcMastercard } from "react-icons/fa";
import Footer from '../components/Footer'
import ContactUs from '../components/ContactUs'
import { toast } from 'react-toastify'
import axios from 'axios'
import { serverUrl } from '../../url'
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import '../styles/FlowerLoader.css'
import { useLoader } from '../context/LoaderContext'
import api from '../utils/axiosInstance'
import CategoryNav from '../components/CategoryNav'

const Product = () => {

    const nav = useNavigate()
    const { products, sessionId, cartCount, setCartCount, fetchCartCount, cart, } = useContext(ProductContext)
    const { setLoading } = useLoader();
    const { productId, slug } = useParams()
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1)
    const [cartPopup, setCartPopup] = useState(false)

    const [addingToCart, setAddingToCart] = useState(false);
    // const product = products?.find((item) => String(item._id) === String(productId))
    const product = products?.find((item) => item.slug === slug || String(item._id) === String(slug));

    const resolveImage = (img) => {
        if (!img) return "";
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || "";
        return "";
    };

    const badges = [
        {
            icon: <GiHand className="text-[#0f708a] text-2xl" />,
            title: "Handcrafted Arrangements",
            text: "Designed with care by expert florists",
        },
        {
            icon: <GiEmerald className="text-[#0f708a] text-2xl" />,
            title: "Premium Quality Blooms",
            text: "Only the freshest and finest flowers",
        },
        {
            icon: <MdPayment className="text-[#0f708a] text-2xl" />,
            title: "Secure Payments",
            text: "Pay safely through trusted gateways",
        },
    ]

    //old depends on productid for url 
    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' })
    // }, [productId])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [slug])

    useEffect(() => {
        if (product?.image?.length) {
            setSelectedImage(product.image[0]?.url || product.image[0]);
        }
    }, [product]);


    // useEffect(() => {
    //     setLoading(true);
    // }, [productId]);

    const gotoCart = () => {
        nav('/cart-page')
        window.scrollTo(0, 0)
    }

    const addToCart = async (productId) => {
        try {
            await api.post(
                serverUrl + `/cart/addToCart`,
                { productId, sessionId, quantity },
                { withCredentials: true, showLoader: true, }
            );
            fetchCartCount();
            setCartPopup(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    axios
    const quantityIncrement = () => {
        setQuantity(quantity + 1)
    }
    const quantityDecrement = () => {
        if (quantity === 1) {
            setQuantity(1)
        } else {
            setQuantity(quantity - 1)
        }
    }

    const subTotal = cart.reduce((total, item) => {
        const itemPrice = item.basePrice * item.quantity;
        const addonPrice = item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
        return total + itemPrice + addonPrice;
    }, 0);

    const onClose = () => {
        setCartPopup(false)
    }

    if (!product) {
        return null; 
    }

    const basePrice = Number(product.price || 0);
    const vatPrice = (basePrice * 1.05).toFixed(2);


    return (
        <div className='overflow-x-hidden'>
            <AnnouncementBar />
            <Navbar />
            <CategoryNav />

            <div className='maincontainer md:w-[86%] w-[94%] max-w-[1400px] h-auto mx-auto mb-10 flex flex-col items-center justify-start'>
                <div className='topContainer w-full min-h-[80vh] pt-5 flex flex-col md:flex-row gap-6 md:gap-10'>
                    {/* leftcontainer */}
                    <div className='leftContainer flex items-start justify-start gap-3 md:w-[60%] w-full h-auto md:h-full'>
                        <div className='imageMapDiv hidden md:flex flex-col gap-5'>
                            {product?.image
                                ?.filter(Boolean)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className='w-[80px] h-[80px] overflow-hidden rounded-[12px] hover:scale-95 transition duration-300'
                                    >
                                        <img
                                            src={resolveImage(item)}
                                            className='w-full h-full object-cover cursor-pointer'
                                            onClick={() => setSelectedImage(resolveImage(item))}
                                        />
                                    </div>
                                ))}

                        </div>

                        <div className='largeImage w-full md:w-[640px] md:h-[600px] h-[350px] sm:h-[380px] overflow-hidden rounded-[36px] transition-shadow duration-700 ease-in-out shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] '>
                            <img
                                src={
                                    selectedImage ||
                                    resolveImage(product?.image?.[0])
                                }
                                className='hidden md:block w-full h-full object-cover'
                            />

                            {/* mobile slider */}
                            <Swiper
                                spaceBetween={10}
                                slidesPerView={1}
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                className='md:hidden w-full h-[350px] sm:h-[380px] overflow-hidden rounded-2xl'
                            >
                                {product?.image
                                    ?.filter(Boolean)
                                    .map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={resolveImage(item)}
                                                className='w-full h-full object-cover'
                                            />
                                        </SwiperSlide>
                                    ))}

                            </Swiper>
                        </div>
                    </div>

                    {/* right container */}
                    <div className='rightContainer w-full md:h-full p-3 sm:p-4'>
                        {/* top div breadcrumb name price details */}
                        <div className='flex flex-col items-start gap-6 md:gap-5 h-auto w-full'>
                            {/* breadcrumb */}
                            <nav className="text-sm font-Poppins text-gray-400 mb-3">
                                <Link to="/" className="hover:text-[#0f708a]">Home</Link> /{" "}
                                <Link to={`/product-listing?category=${product.category}`}
                                    className="hover:text-[#0f708a]">
                                    {product.category}
                                </Link>{" "}
                                / <span className="text-gray-600">{product.name}</span>
                            </nav>

                            {/* Product name */}
                            <h2 className='font-Poppins font-normal md:text-[22px] text-[18px] leading-snug break-words'>
                                {product.name}
                            </h2>

                            {/* Price block */}
                            <h1 className="font-Poppins font-bold md:text-[32px] text-[24px] flex flex-wrap items-center gap-3 relative w-full">
                                {/* Final price */}
                                <span className="font-Poppins font-light text-3xl md:text-4xl text-gray-900">
                                    AED {vatPrice}
                                </span>

                                {/* Compare / Regular price */}
                                {product.regularPrice > vatPrice && (
                                    <span className="font-Poppins md:text-[16px] text-[12px] line-through text-gray-400 font-normal">
                                        AED {product.regularPrice}
                                    </span>
                                )}

                                {/* VAT text */}
                                <span className="font-Poppins text-sm text-gray-400 font-light">
                                    Inc. VAT
                                </span>

                                {/* Stock badge */}
                                <span
                                    className={`
                ${product.inStock
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-red-50 text-red-600 border border-red-200"} px-3 py-1 text-[12px] font-medium rounded-full font-Poppins absolute right-2 top-1/2 -translate-y-1/2 md:static md:translate-y-0 `}
                                >
                                    {product.inStock ? "In Stock" : "Out of Stock"}

                                </span>
                                {product.regularPrice > vatPrice && (
                                    <p key={`${product._id}-${vatPrice}`}
                                        className="text-[13px]
                font-medium
                text-emerald-700
                bg-emerald-50
                px-3 py-1
                rounded-full
                animate-slide-in">
                                        You save AED {(product.regularPrice - vatPrice).toFixed(2)}
                                    </p>
                                )}
                            </h1>


                            {/* Quantity counter */}
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={quantityDecrement}
                                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
                                >
                                    -
                                </button>

                                <span className="text-lg font-Poppins font-medium w-8 text-center">
                                    {quantity}
                                </span>

                                <button
                                    onClick={quantityIncrement}
                                    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to cart */}
                            <button
                                disabled={addingToCart}
                                onClick={() => addToCart(product._id)}
                                className={`py-3 md:py-4 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white font-Poppins font-normal text-[15px] tracking-wide rounded-[12px] transition-all duration-300 ease-in-out active:scale-95 flex items-center justify-center gap-3 cursor-pointer fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[90%] md:static md:translate-x-0 md:w-full z-9999}`
                                }
                            >
                                {addingToCart ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        Add to Basket <GiBeachBag className="text-[22px]" />
                                    </>
                                )}
                            </button>

                        </div>


                        {/* badges */}
                        <div className='w-full md:h-[250px] rounded-[8px] mt-10 flex flex-row md:flex-col overflow-x-auto md:overflow-visible justify-start md:justify-evenly md:gap-3 gap-4 scrollbar-hide pb-2'>
                            {badges.map((item, index) => (
                                <div
                                    key={index}
                                    className='min-w-[75%] sm:min-w-[60%] md:min-w-0 flex items-start gap-3 p-3 md:p-4 rounded-[8px] bg-[#f7f5f3] flex-shrink-0'
                                >
                                    {item.icon}
                                    <div className='flex flex-col gap-2'>
                                        <h3 className='font-Poppins text-sm font-semibold text-left'>
                                            {item.title}
                                        </h3>
                                        <p className='font-Poppins text-xs text-gray-400 text-left'>
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* payment card badges */}
                        <div className='paymentBadges border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm my-4'>
                            <h2 className='text-sm font-semibold font-Poppins text-gray-800'>
                                Ways to pay
                            </h2>
                            <div className='flex items-center gap-3 md:gap-4 flex-wrap'>
                                <div className='border border-gray-300 rounded-md p-2 md:p-3 bg-gray-50 hover:bg-gray-100 transition'>
                                    <FaPaypal className='text-[#003087] text-2xl' />
                                </div>
                                <div className='border border-gray-300 rounded-md p-2 md:p-3 bg-gray-50 hover:bg-gray-100 transition'>
                                    <FaCcVisa className='text-[#1a1f71] text-2xl' />
                                </div>
                                <div className='border border-gray-300 rounded-md p-2 md:p-3 bg-gray-50 hover:bg-gray-100 transition'>
                                    <FaApplePay className='text-black text-2xl' />
                                </div>
                                <div className='border border-gray-300 rounded-md p-2 md:p-3 bg-gray-50 hover:bg-gray-100 transition'>
                                    <FaCcMastercard className='text-[#eb001b] text-2xl' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* description */}
                <div className='w-full border-t border-gray-200 mt-14'>
                    <h3 className='font-Poppins text-[22px] md:text-[24px] p-4'>Description</h3>
                    <p className='font-Poppins text-[15px] md:text-[16px] p-4 text-gray-500 leading-relaxed'>
                        {product.description}
                    </p>
                </div>

                {/* Suggested Products Section */}
                <div className='w-full h-auto mt-12 mb-10'>
                    <h2 className='font-Poppins text-[20px] sm:text-[22px] md:text-[26px] mb-6 px-2 md:px-4 text-black'>
                        People also viewed
                    </h2>
                    <div className='w-full overflow-hidden'>
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1.2}
                            grabCursor={true}
                            touchStartPreventDefault={false}
                            preventClicks={false}
                            preventClicksPropagation={false}
                            breakpoints={{
                                480: { slidesPerView: 1.6 },
                                640: { slidesPerView: 2.2 },
                                1024: { slidesPerView: 4 },
                            }}
                            className='px-2 md:px-4 touch-pan-y'
                        >
                            {products
                                .filter(
                                    (item) =>
                                        item.category === product.category && item._id !== product._id
                                ).sort(() => 0.5 - Math.random())
                                .slice(0, 8)
                                .map((item) => (
                                    <SwiperSlide
                                        key={item._id}
                                        className="group mb-4 touch-pan-y"
                                    >
                                        <Link
                                            to={`/product/${item.slug}`}
                                            className="block bg-white rounded-[20px] overflow-hidden
             border border-[#f1f1f1]
             transition-all duration-300
             hover:-translate-y-1
             hover:shadow-[0_18px_40px_rgba(15,112,138,0.18)]
             pointer-events-auto"
                                        >
                                            {/* Image Section */}
                                            <div className="relative w-full h-[240px] sm:h-[260px] md:h-[300px] overflow-hidden">
                                                <img
                                                    src={resolveImage(item.image?.[0])}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />

                                                {/* Soft gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Price Badge */}
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md
                      px-3 py-1 rounded-full shadow-sm">
                                                    <p className="font-Poppins text-[13px] font-semibold text-[#0f708a]">
                                                        AED {(item.price * 1.05).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="font-Poppins font-medium text-[15px] sm:text-[16px]
                     text-gray-800 leading-snug line-clamp-2
                     group-hover:text-[#0f708a] transition-colors">
                                                    {item.name}
                                                </h3>

                                                {/* Sub text */}
                                                <p className="mt-1 text-[13px] text-gray-500 font-Poppins">
                                                    VAT included
                                                </p>
                                            </div>
                                        </Link>
                                    </SwiperSlide>

                                ))}
                        </Swiper>
                    </div>
                </div>
            </div>
            {cartPopup && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-[#F9F8F6] w-[90%] max-w-3xl rounded-3xl shadow-lg p-8"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <IoClose size={24} />
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-light text-[#1A1A1A] mb-2">
                            You’ve added items to your cart
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Cart subtotal: <span className="font-semibold text-[#164A48]">AED {(subTotal * 1.05).toFixed(2)}</span>
                        </p>

                        {/* Progress Bar */}
                        {/* <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span>Only AED 100 left to unlock free standard delivery!</span>
                                    <span className="font-semibold">AED 400</span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-[#164A48] rounded-full"></div>
                                </div>
                            </div> */}
                        {/* Buttons */}
                        <div className="flex justify-between items-center mt-8 gap-2">
                            <button
                                onClick={onClose}
                                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition font-Poppins"
                            >
                                Continue Shopping
                            </button>
                            <button className="bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] cursor-pointer text-white px-8 py-2 rounded-full transition font-Poppins"
                                onClick={gotoCart}>
                                View Cart ({cartCount})
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            <ContactUs />
            <Footer />
        </div>
    )
}

export default Product
