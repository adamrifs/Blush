import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AnnouncementBar from '../components/AnnouncementBar'
import { RiEqualizer3Line } from "react-icons/ri";
import FilterDropDown from '../components/FilterDropDown';
import { MdKeyboardArrowDown } from "react-icons/md";
import Sticky from 'react-stickynode';
import { IoMdClose } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext.jsx';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import { serverUrl } from '../../url.js';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import api from '../utils/axiosInstance.js';
import CategoryNav from '../components/CategoryNav.jsx';
import Footer from '../components/Footer.jsx';

const ProductListing = () => {
    const location = useLocation()
    const product = location.state?.selectedCategory || null;
    const [selectedCategory, setSelectedCategory] = useState(product)
    const [displayedProducts, setDisplayedProducts] = useState([])
    const [sortBox, setSortBox] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [cartPopup, setCartPopup] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 30;

    const { products, loading, sessionId, fetchCartCount, cartCount, cart } = useContext(ProductContext)

    const nav = useNavigate()
    const gotoCart = () => {
        nav('/cart-page')
    }

    useEffect(() => {
        if (location.state?.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory)
        }
    }, [location.state])


    useEffect(() => {
        if (!products.length) return;

        if (selectedCategory) {
            let filtered = [];

            if (selectedCategory.category) {
                filtered = products.filter(
                    (item) => item.category === selectedCategory.category
                );
            } else if (selectedCategory.occasions) {
                filtered = products.filter(
                    (item) => item.occasions === selectedCategory.occasions
                );
            } else if (selectedCategory.name) {
                filtered = products.filter(
                    (item) => item.name === selectedCategory.name
                );
            }

            setDisplayedProducts(filtered);
        } else {
            setDisplayedProducts([...products].sort(() => 0.5 - Math.random()));
        }

        setCurrentPage(1);
    }, [selectedCategory, products]);




    // __________________________ sort by option _______________________________
    const handleSortBox = () => {
        setSortBox(!sortBox)
    }

    const handleSortChange = (option) => {
        let sorted = [...displayedProducts]
        if (option === 'Latest') {
            sorted = [...products].reverse()
        } else if (option === 'Price: Low to High') {
            sorted.sort((a, b) => a.price - b.price)
        } else if (option === 'Price: High to Low') {
            sorted.sort((a, b) => b.price - a.price)
        } else if (option === 'Name: A → Z') {
            sorted.sort((a, b) => a.name.localeCompare(b.name))
        } else if (option === 'Name: Z → A') {
            sorted.sort((a, b) => b.name.localeCompare(a.name))
        }
        setDisplayedProducts(sorted)
        setSortBox(false)
    }

    // ______________________ Filter option ___________________________
    const [selectedFilterOption, setSelectedFilterOption] = useState()
    const handleFilterChange = (title, selectedOptions) => {
        if (title === 'Category') {
            const filtered = products.filter(item => selectedOptions.includes(item.category))
            setDisplayedProducts(filtered)
            setSelectedFilterOption(selectedOptions)
        } else if (title === 'Occasions') {
            const filtered = products.filter(item => selectedOptions.includes(item.occasions))
            setDisplayedProducts(filtered)
            setSelectedFilterOption(selectedOptions)
        } else if (title === 'Budget') {
            const filtered = products.filter(item => {
                const price = Number(item.price);
                return selectedOptions.some(option => {
                    if (option === "Under 250 AED") return price < 250;
                    if (option === "250 AED to 500 AED") return price >= 250 && price <= 500;
                    if (option === "500 AED to 750 AED") return price > 500 && price <= 750;
                    if (option === "Over 750 AED") return price > 750;
                    return false;
                });
            });
            setDisplayedProducts(filtered);
            setSelectedFilterOption(selectedOptions);
        }
        //  If nothing is selected → show all products
        if (selectedOptions.length === 0) {
            setDisplayedProducts(products);
        }

    }
    // __________ handle clear all
    const handleClearAll = () => {
        setSelectedCategory(null)
        setSelectedFilterOption([]);
        setDisplayedProducts(products);
        setFilterOpen(false);
    }
    // to disable background scroll on when filter option is turned on 
    // useEffect(() => {
    //     if (filterOpen) {
    //         document.body.style.overflow = 'hidden'
    //     } else {
    //         document.body.style.overflow = 'auto'
    //     }
    // }, [filterOpen])

    // ______________________________ add to cart 
    const addToCart = async (productId) => {
        try {
            const response = await api.post(serverUrl + `/cart/addToCart`, { productId, sessionId, quantity: 1 }, {
                withCredentials: true
            })
            // toast.success('Succesfully added to cart')
            fetchCartCount()
            console.log(response.data)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const subTotal = cart.reduce((total, item) => {
        const itemPrice = item.basePrice * item.quantity;
        const addonPrice = item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
        return total + itemPrice + addonPrice;
    }, 0);


    // console.log('cart', cart)
    const onClose = () => {
        setCartPopup(false)
    }

    const resolveImage = (img) => {
        if (!img) return "/placeholder.webp";
        if (Array.isArray(img)) return resolveImage(img[0]);
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || "/placeholder.webp";
        return "/placeholder.webp";
    };

    const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE);

    const paginatedProducts = displayedProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    return (
        <div>
            <AnnouncementBar />
            <Navbar />
            <CategoryNav />
            <div className='maincontainer md:w-[80%] w-[90%] h-auto mx-auto mb-5 '>
                {
                    loading ? (
                        <div className="mt-6 md:grid md:grid-cols-[250px_1fr] flex flex-col items-start justify-start md:gap-6 gap-3">
                            {/* Sidebar Skeleton */}
                            <div className="md:w-[250px] w-full bg-[#f3f3f4] md:bg-transparent p-3 rounded-[6px] space-y-4">
                                <Skeleton height={30} width="60%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} height={20} width="80%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                    ))}
                                </div>
                                <div className="space-y-3 mt-4">
                                    <Skeleton height={25} width="50%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} height={18} width="75%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                    ))}
                                </div>
                                <div className="space-y-3 mt-4">
                                    <Skeleton height={25} width="40%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} height={18} width="65%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                    ))}
                                </div>
                            </div>

                            {/* Product Cards Skeleton */}
                            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-5 w-full">
                                {[...Array(8)].map((_, index) => (
                                    <div key={index} className="p-1">
                                        <div className="rounded-[8px] overflow-hidden">
                                            <Skeleton height={220} baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            <Skeleton height={20} width="50%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                            <Skeleton height={15} width="80%" baseColor="#e7e7ea" highlightColor="#f5f5f5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mt-10 mb-10">
                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b-[0.5px] border-gray-100 pb-4">

                                    {/* Title: The focus is on the serif font and spacing */}
                                    <div className="flex flex-col">
                                        <h1 className="font-chopard text-3xl md:text-5xl text-[#1a1a1a] tracking-tight">
                                            {selectedCategory ? selectedCategory.category : 'All Products'}
                                        </h1>
                                    </div>

                                    {/* Counter: Minimalist and sophisticated */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-medium text-gray-400">
                                            Collection
                                        </span>
                                        <div className="w-10 h-[1px] bg-gray-200"></div>
                                        <span className="text-[11px] md:text-[12px] uppercase tracking-[0.25em] font-light text-gray-500 font-Poppins">
                                            {displayedProducts.length} Results
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <div className='md:grid md:grid-cols-[250px_1fr] flex flex-col items-start justify-start md:gap-6 gap-3 mt-4'>
                                {/* ________________ side filters ______________________ */}
                                
                                    <div className='sidefilter relative z-[1] md:w-[250px] w-full h-[40px] md:h-auto bg-[#f3f3f4] md:bg-transparent p-2 rounded-[6px] md:block flex border-b-gray-300'
                                    >
                                        {/* _______ filter open on mobile screen */}
                                        <h1 className='flex items-center justify-between w-full px-2 gap-5 font-montserrat md:text-xl font-medium' onClick={() => setFilterOpen(!filterOpen)}>Filter <RiEqualizer3Line /></h1>

                                        {/* ________________________ category _______________________ */}
                                        <div className='category md:block hidden'>
                                            <FilterDropDown
                                                title={'Category'}
                                                onFilterChange={handleFilterChange}
                                                option={['Bouquet', 'Bouquet in Bag', 'Box Arrangements', 'Cake', 'Cakes and Flowers', 'Chocolate', 'Chocolate and Flowers', 'Combo Deals', 'Flowers', 'Forever Flowers', 'Fresh Cakes', 'Flower Basket', 'Fruits and Flowers', 'Hand Bouquet', 'Mini Bag Arrangements', 'Mini Bouquet', 'Necklace', 'Plants', 'Vase Arrangements']}
                                            />
                                        </div>
                                        {/* _________________________ occassions ___________________ */}
                                        <div className='md:block hidden'>
                                            <FilterDropDown title={'Occasions'}
                                                onFilterChange={handleFilterChange}
                                                option={["Mother's Day", "Valentine's Day", "Eid", "National Day", "Birthday", "Anniversary", "Graduation", "New Year"]} />
                                        </div>
                                        {/* _________________ budget__________ */}
                                        <div className='md:block hidden'>
                                            <FilterDropDown title={"Budget"}
                                                onFilterChange={handleFilterChange}
                                                option={["Under 250 AED", "250 AED to 500 AED", "500 AED to 750 AED", "Over 750 AED"]} />
                                        </div>
                                    </div>
                                
                                {/* ____________ mobile filter option display _____________  */}
                                {
                                    filterOpen && (
                                        <div className='md:hidden block w-[88vw] h-auto absolute top-[400px] left-1/2 -translate-x-1/2  bg-white rounded-[6px] z-[9999] shadow-lg animate-fadeIn p-4 max-h-[80vh] overflow-y-auto '>
                                            {/* category */}
                                            <div className='category md:hidden block '>
                                                <FilterDropDown
                                                    title={'Category'}
                                                    onFilterChange={handleFilterChange}
                                                    option={['Bouquet', 'Bouquet in Bag', 'Box Arrangements', 'Cake', 'Cakes and Flowers', 'Chocolate', 'Chocolate and Flowers', 'Combo Deals', 'Flowers', 'Forever Flowers', 'Fresh Cakes', 'Flower Basket', 'Fruits and Flowers', 'Hand Bouquet', 'Mini Bag Arrangements', 'Mini Bouquet', 'Necklace', 'Plants', 'Vase Arrangements']}
                                                />
                                            </div>
                                            {/* occasions */}
                                            <div className='md:hidden block'>
                                                <FilterDropDown title={'Occasions'}
                                                    onFilterChange={handleFilterChange}
                                                    option={["Mother's Day", "Valentine's Day", "Eid", "National Day", "Birthday", "Anniversary", "Graduation", "New Year"]} />
                                            </div>
                                            {/* _________________ budget__________ */}
                                            <div className='md:hidden block'>
                                                <FilterDropDown title={"Budget"}
                                                    onFilterChange={handleFilterChange}
                                                    option={["Under 250 AED", "250 AED to 500 AED", "500 AED to 750 AED", "Over 750 AED"]} />
                                            </div>
                                        </div>
                                    )
                                }
                                {/* ____________________________ product listing ___________________________ */}
                                <div className='productListing'>
                                    {/* _____________________ sort by etc .. settings _______  */}
                                    <div className='relative flex flex-wrap items-center gap-3 md:py-5 pb-3 '>
                                        <button className='flex items-center gap-2 text-gray-700 bg-[#f3f3f4] text-[15px] p-2 px-2 pl-3 rounded-full font-montserrat hover:bg-[#e7e7ea] hover:text-[#b89bff] transition duration-300 cursor-pointer active:scale-90' onClick={handleSortBox}>Sort by <MdKeyboardArrowDown className='text-2xl' /></button>

                                        {
                                            sortBox && (
                                                <div className="absolute md:top-18 top-14 left-2 w-[230px] bg-white shadow-[0_4px_25px_rgba(0,0,0,0.08)] rounded-[12px] border border-gray-100 overflow-hidden animate-fadeIn z-40">
                                                    <ul className="font-montserrat text-[15px] text-gray-700">
                                                        {[
                                                            'Latest',
                                                            'Price: Low to High',
                                                            'Price: High to Low',
                                                            'Name: A → Z',
                                                            'Name: Z → A',
                                                        ].map((option, index) => (
                                                            <li
                                                                key={index}
                                                                className="px-4 py-3 hover:bg-[#f8f8f8] cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-none hover:text-[#0f708a] active:scale-[0.98]"
                                                                onClick={() => handleSortChange(option)}
                                                            >
                                                                {option}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )
                                        }

                                        <button className='flex items-center gap-2 text-gray-700 bg-[#f3f3f4] text-[15px] p-2 px-3 rounded-full font-montserrat hover:bg-[#e7e7ea] hover:text-[#b89bff] transition duration-300 cursor-pointer active:scale-90' onClick={handleClearAll}>Clear All</button>

                                        {
                                            selectedCategory && (
                                                <h3 className='relative z-[50] text-white bg-[#d6b8ff] border border-[#d2e1e8] text-[15px] p-2 px-3 rounded-full font-montserrat flex items-center gap-2'>
                                                    {selectedCategory.category}
                                                    <IoMdClose
                                                        className='cursor-pointer hover:scale-90 transition duration-300 pointer-events-auto '
                                                        onClick={() => setSelectedCategory(null)}
                                                    />
                                                </h3>

                                            )

                                        }
                                        {selectedFilterOption && selectedFilterOption.map((opt, index) => (
                                            <h3 key={index} className='relative z-[50] text-white bg-[#d6b8ff] border border-[#d2e1e8] text-[15px] p-2 px-3 rounded-full font-montserrat flex items-center gap-2'>
                                                {opt}
                                                <IoMdClose
                                                    className='cursor-pointer hover:scale-90 transition duration-300 pointer-events-auto z-[50]'
                                                    onClick={() => setSelectedFilterOption(selectedFilterOption.filter(item => item !== opt))}
                                                />
                                            </h3>
                                        ))}
                                    </div>

                                    {/* _________________ cards ________________________ */}
                                    <div className='cardsContainer flex items-center justify-start w-full max-w-full flex-wrap md:gap-10 gap-2'>
                                        {paginatedProducts.map((item, index) => (
                                            <div className='md:w-[270px] w-[48%] p-1' key={index}>
                                                {/* Image section */}
                                                <div className='group relative md:w-[270px] w-full md:h-[220px] h-[120px] overflow-hidden rounded-[20px] cursor-pointer'>
                                                    <Link to={`/product/${item.slug}`}>
                                                        <img
                                                            src={resolveImage(item.image?.[0])}
                                                            alt={item.name}
                                                            className='w-full h-full object-cover object-center hover:scale-105 transition duration-300'
                                                        />
                                                    </Link>

                                                    {/* Desktop Add to Cart (on hover) */}
                                                    <button
                                                        className='hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-10  
          bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white  
          font-montserrat font-semibold text-[13px] tracking-wide rounded-[10px] 
          transition-all duration-300 ease-in-out active:scale-95 opacity-0 
          group-hover:opacity-100 group-hover:translate-y-0 translate-y-3 cursor-pointer'
                                                        onClick={() => {
                                                            addToCart(item._id)
                                                            setCartPopup(true)
                                                        }}>
                                                        Add to Basket
                                                    </button>
                                                </div>

                                                <div className="mt-5 px-1 flex flex-col items-center text-center">
                                                    {/* Category or Boutique Label */}
                                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#b89bff] font-bold mb-1">
                                                        Boutique Choice
                                                    </span>

                                                    {/* Product Name using font-chopard for elegance */}
                                                    <h3 className='font-Poppins text-[17px] md:text-[20px] text-gray-900 leading-tight mb-2 line-clamp-1'>
                                                        {item.name}
                                                    </h3>

                                                    {/* Price Section */}
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-montserrat font-medium text-sm text-gray-900">
                                                            AED {item.price}
                                                        </span>
                                                        <span className="text-[10px] font-Poppins text-gray-400 font-light uppercase tracking-wider">
                                                            + VAT
                                                        </span>
                                                    </div>

                                                    {/* Mobile Specific Action - Refined */}
                                                    <button
                                                        className='md:hidden mt-4 w-full py-2 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white  text-[10px] uppercase tracking-widest font-bold  flex items-center justify-center gap-2 rounded-[10px] font-Poppins'
                                                        onClick={() => {
                                                            addToCart(item._id);
                                                            setCartPopup(true);
                                                        }}>
                                                        Add to Basket
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-12">
                                            {/* Prev */}
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                className={`px-4 py-2 rounded-full border text-sm font-montserrat transition
                ${currentPage === 1
                                                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                                        : "hover:bg-gray-100 border-gray-400 cursor-pointer"
                                                    }`}
                                            >
                                                Prev
                                            </button>

                                            {/* Page Numbers */}
                                            {[...Array(totalPages)].map((_, index) => {
                                                const page = index + 1;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-9 h-9 rounded-full font-montserrat text-sm transition
                        ${currentPage === page
                                                                ? "bg-[#b89bff] text-white"
                                                                : "border border-gray-300 hover:bg-gray-100 cursor-pointer"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            {/* Next */}
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                className={`px-4 py-2 rounded-full border text-sm font-montserrat transition
                ${currentPage === totalPages
                                                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                                        : "hover:bg-gray-100 border-gray-400 cursor-pointer"
                                                    }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )
                }
                {/* _______________________________________ cart popup */}
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
            </div>
            <Footer/>
        </div>
    )
}

export default ProductListing