import React, { useContext, useState, useRef, useEffect } from "react";
import { BsCart4 } from "react-icons/bs";
import { PiUserCircle } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import { TbMenuDeep } from "react-icons/tb";
import { GiBeachBag } from "react-icons/gi";
import { motion } from "framer-motion";
import ailogo from "../assets/ailogo.png";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import logo from '../assets/logo2.png'
import { FiUser } from "react-icons/fi";
import userProfile from '../assets/user.png'
import Cookies from 'js-cookie'
import axios from "axios";
import { serverUrl } from "../../url";
import api from "../utils/axiosInstance";
import { ShoppingBasket } from 'lucide-react';
import { CircleUserRound } from 'lucide-react';

const Navbar = () => {
  const { products, cartCount, token } = useContext(ProductContext);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [userAccount, setUserAccount] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  //for mobile userprofile
  const [userProf, setUserProf] = useState(false)
  const searchRef = useRef(null);
  const nav = useNavigate();

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase()) ||
      item.occasions?.toLowerCase().includes(query.toLowerCase())
  );

  const handleUserAccount = () => {
    setUserAccount(!userAccount)
  }

  const handleSelectProduct = (product) => {
    setShowSearch(false);
    setQuery(product.name);
    nav("/product-listing", { state: { selectedCategory: product } });
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setShowSearch(true);
    setActiveIndex(-1);
  };


  const handleKeyDown = (e) => {
    if (!showSearch || filteredProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredProducts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredProducts.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelectProduct(filteredProducts[activeIndex]);
      } else if (filteredProducts.length === 1) {
        handleSelectProduct(filteredProducts[0]);
      }
    }
  };

  //  Hide on outside click
  //  Hide on outside click (with slight delay for mobile taps)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setTimeout(() => setShowSearch(false), 150);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const gotoAiPage = () => {
    nav('/ai-page')
  }
  const gotoLogin = () => {
    nav('/login')
  }

  //_________________ mobile user profile function 
  const gotoUserProf = () => {
    if (token) {
      nav('/user-profile')
    } else {
      setUserProf(true)
    }
  }


  const [user, setUser] = useState(null)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ show instantly if logged in with Google
    } else {
      const fetchUserData = async () => {
        const token = Cookies.get("authToken");
        if (!token) return;

        try {
          const response = await api.get(`${serverUrl}/user/getUser`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  return (
    <div className="mainContainer w-full h-[70px] md:h-[90px] flex items-center justify-between md:px-20 md:pr-32 px-4 sm:px-6 bg-white ">
      {/* Logo */}
      {/* <h1
        className="font-chopard font-normal text-xl sm:text-2xl md:text-5xl pt-1 cursor-pointer"
        onClick={() => {
          nav("/");
          window.scrollTo(0, 0);
        }}
      >
        BLUSH
      </h1> */}
      <div className="md:w-50 w-30 md:h-[90px] h-[65px]">
        <img src={logo}
          className="w-full h-full object-cover cursor-pointer "
          onClick={() => {
            nav("/");
            window.scrollTo(0, 0);
          }} />
      </div>
      {/* 🔍 Search bar */}
      <div
        ref={searchRef}
        className="relative flex-1 max-w-[220px] sm:max-w-[250px] md:max-w-[450px] mx-3 sm:mx-6"
      >
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowSearch(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="w-full h-[35px] sm:h-[50px] bg-[#f8f8f8] rounded-full pl-10 pr-2 text-sm sm:text-base font-montserrat placeholder:text-gray-500 outline-none  transition"
        />
        <IoIosSearch className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-lg sm:text-xl text-gray-500" />

        {/* 🔽 Suggestions box */}
        {showSearch && query && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-[55px] left-0 w-full bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-[100]"
          >
            {filteredProducts.length > 0 ? (
              <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {filteredProducts.map((item, index) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectProduct(item)}
                    className={`px-3 py-2 rounded-md cursor-pointer text-sm font-montserrat transition ${activeIndex === index
                      ? "bg-[#eefafe] text-[#0f708a]"
                      : "hover:bg-[#eefafe]"
                      }`}
                  >
                    {item.name}
                    {item.category && (
                      <span className="text-gray-400 text-xs ml-2">
                        ({item.category})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center font-montserrat italic">
                No matching products found.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Icons (unchanged) */}
      <div className="hidden md:flex gap-7 text-3xl md:text-4xl">
        <p className="flex text-[22px] items-center font-PPNeueMachina font-semibold cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300 active:scale-90"
          onClick={gotoAiPage}>
          BlushAI
          <motion.img
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 10,
              ease: "linear",
            }}
            src={ailogo}
            className="w-15 h-12 mb-1 object-cover align-middle"
          />
        </p>

        <div className="relative cursor-pointer hover:scale-95 transition duration-300"
          onClick={() => {
            nav('/cart-page');
            window.scrollTo(0, 0);
          }}
        >
          {/* <GiBeachBag className="cursor-pointer hover:scale-95 transition duration-300" /> */}
          <ShoppingBasket strokeWidth={1} color="#404040" className="cursor-pointer hover:scale-95 transition duration-300 w-8 h-10" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-3 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        {/* <FiUser className="cursor-pointer hover:scale-95 transition duration-300" /> */}

        <div
          className="relative w-auto h-10 flex items-center cursor-pointer"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Profile image */}
          {/* <img
            src={userProfile}
            alt="User Profile"
            className="w-full h-full object-cover hover:scale-90 transition duration-300"
            onClick={() => {
              if (token) {
                nav("/user-profile");
              }
            }}
          /> */}

          <CircleUserRound strokeWidth={1} color="#404040"
            className="cursor-pointer hover:scale-95 transition duration-300 w-8 h-8"
            onClick={() => {
              if (token) {
                nav("/user-profile");
              }
            }} />


          {/* Show first name if logged in */}
          {token ? (
            <h2 className="text-sm pl-2 flex items-center font-Poppins">
              {user?.firstname}
            </h2>
          ) : (
            <>
              {isOpen && (
                <div
                  className="absolute -bottom-[210px] -left-[200px]
                     bg-white rounded-[28px] shadow-xl p-6
                     w-[320px] h-[210px] flex flex-col items-center justify-center
                     z-50 transition-all duration-300 ease-in-out"
                >
                  {/* Top gradient button */}
                  <button
                    className="w-[260px] h-12 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                       border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                       hover:from-[#a27aff] hover:to-[#cda5ff]
                       text-white font-bold text-base
                       flex items-center justify-center font-Poppins cursor-pointer
                       transition-all duration-300 ease-in-out"
                    onClick={gotoLogin}
                  >
                    Sign In
                  </button>

                  {/* Helper text */}
                  <p className="text-[13px] text-gray-700 mt-3 font-Poppins">
                    Don't have an account?
                  </p>

                  {/* Bottom black button */}
                  <button
                    className="w-[240px] h-12 rounded-full bg-black text-white font-bold text-base mt-3
                       flex items-center justify-center font-Poppins cursor-pointer
                       transition-all duration-300 ease-in-out"
                    onClick={gotoLogin}
                  >
                    Create an Account
                  </button>
                </div>
              )}
            </>
          )}
        </div>


      </div>

      {/* Mobile menu toggle */}
      <TbMenuDeep className="md:hidden block text-3xl sm:text-4xl cursor-pointer" onClick={() => setSideBarOpen(!sidebarOpen)} />
      {
        sidebarOpen && (
          <div className='fixed inset-0 z-10' onClick={() => {
            setUserProf(false)
            setSideBarOpen(false)
          }}>

          </div>
        )
      }
      {/* __________________________ main nav div  */}
      <div className={`h-[100vh] w-[230px] bg-white shadow-lg rounded-tl-[12px] rounded-bl-[12px] fixed top-0 right-0 z-50 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col items-center gap-4 mt-10'>
          <p className='flex text-[22px] w-full px-4 items-center font-PPNeueMachina font-semibold cursor-pointer bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                  bg-clip-text text-transparent hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300 active:scale-90 '
            onClick={gotoAiPage}>
            BlushAI
            <motion.img
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 10,
                ease: 'linear'
              }}
              src={ailogo} className='w-15 h-12 mb-1 object-cover align-middle' />
          </p>

          <div className='w-full py-4 cursor-pointer transform hover:scale-95 transition-transform duration-300 flex items-center justify-start gap-3 px-3'>
            <div className="w-10 h-10 flex items-center">
              {/* <img
                src={userProfile}
                className="w-full h-full object-cover cursor-pointer hover:scale-90 transition duration-300"
                alt="user"
              /> */}
              <CircleUserRound strokeWidth={1} color="#404040" className="w-8 h-8 object-cover cursor-pointer hover:scale-90 transition duration-300" />
            </div>

            <p
              className='font-montserrat text-[18px]'
              onClick={gotoUserProf}
            >
              {token ? user?.firstname : "Account"}
            </p>

            {/* Login Popup */}


          </div>
          {!token && userProf && (
            <div className="fixed top-1/2 left-[8%] -translate-y-1/2 -translate-x-1/2 z-[9999] flex items-center justify-center">
              <div className="bg-white w-[320px] rounded-[28px] p-6 shadow-xl flex flex-col items-center">

                <button
                  className="w-[260px] h-12 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white font-bold"
                  onClick={gotoLogin}
                >
                  Sign In
                </button>

                <p className="text-[13px] text-gray-700 mt-3">
                  Don't have an account?
                </p>

                <button
                  className="w-[240px] h-12 rounded-full bg-black text-white font-bold mt-3"
                  onClick={gotoLogin}
                >
                  Create an Account
                </button>
              </div>
            </div>
          )}

          <div className='w-full py-4 relative cursor-pointer hover:scale-95 transition duration-300 text flex items-center justify-start gap-3 px-3' onClick={() => {
            nav('/cart-page');
            window.scrollTo(0, 0)
          }} >
            {/* <GiBeachBag className="w-8 h-8" /> */}
            <ShoppingBasket strokeWidth={1} color="#404040" className="w-8 h-8 " />

            {
              cartCount > 0 && (
                <span className="absolute top-1 left-8 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )
            }
            <p className='font-montserrat text-[18px]'>Basket</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
