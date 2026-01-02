import React from 'react'
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { PiTrademarkRegisteredLight } from "react-icons/pi";
import logoPng from '../assets/logoPng.png'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const nav = useNavigate();

  const handleNav = (path) => {
    nav(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#080808] text-white pt-6 md:pt-24 pb-12 px-8 md:px-16 lg:px-24 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto">

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 lg:gap-x-12 pb-10">

          {/* COLUMN 1: BRAND STORY (4/12) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-52 mb-0 group cursor-pointer" onClick={() => handleNav('/')}>
              <img
                src={logoPng}
                alt="Blush Logo"
                className="w-full h-auto object-contain brightness-110 group-hover:opacity-80 transition-opacity"
              />
            </div>
            <p className="text-gray-400 text-[13px] font-light leading-relaxed max-w-sm font-Poppins">
              Crafting bespoke floral experiences since 2025. We believe in the language of flowers to express what words cannot, delivering elegance across the Emirates.
            </p>
            <div className="flex gap-6 mt-8">
              <a href="#" className="text-gray-400 hover:text-[#b89bff] transition-colors text-lg"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-[#b89bff] transition-colors text-lg"><FaTiktok /></a>
              <a href="#" className="text-gray-400 hover:text-[#b89bff] transition-colors text-lg"><FaFacebookF /></a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (2/12) */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8 text-white">Maison</h4>
            <ul className="space-y-4 text-[13px] font-light text-gray-400 font-Poppins text-center md:text-left">
              <li onClick={() => handleNav('/')} className="hover:text-white cursor-pointer transition-colors">Home</li>
              <li onClick={() => handleNav('/product-listing')} className="hover:text-white cursor-pointer transition-colors">Collection</li>
              <li onClick={() => handleNav('/contact-us-page')} className="hover:text-white cursor-pointer transition-colors">Boutique</li>
              <li onClick={() => handleNav('/ai-page')} className="hover:text-[#b89bff] cursor-pointer transition-colors font-medium">AI Flower Finder</li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT (2/12) */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8 text-white">Assistance</h4>
            <ul className="space-y-4 text-[13px] font-light text-gray-400 font-Poppins md:text-left text-center">
              <li onClick={() => handleNav('/contact-us-page')} className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li onClick={() => handleNav('/delivery-policy')} className="hover:text-white cursor-pointer transition-colors">Shipping</li>
              <li onClick={() => handleNav('/refund-policy')} className="hover:text-white cursor-pointer transition-colors">Returns</li>
              <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER (4/12) - Filling the right side */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-8 text-white">Newsletter</h4>
            <p className="text-gray-400 text-[13px] font-light mb-6 font-Poppins text-center lg:text-left">
              Subscribe to receive updates on new seasonal collections and boutique events.
            </p>
            <div className="w-full max-w-sm flex border-b border-white/20 pb-2 focus-within:border-[#b89bff] transition-colors group">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-none outline-none text-sm w-full font-light py-1 placeholder:text-gray-600 font-Poppins"
              />
              <button className="text-[10px] uppercase tracking-widest font-bold text-[#b89bff] hover:text-white transition-colors ml-4">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: POLICIES & COPYRIGHT */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Left: Policy Links */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] uppercase tracking-[0.25em] text-gray-500 font-medium font-Poppins">
            {['Privacy', 'Terms', 'Delivery', 'Refunds'].map((item) => (
              <span
                key={item}
                onClick={() => handleNav(
                  `/${item.toLowerCase() === "privacy" 
                    ? "privacy-policy" 
                    : item.toLowerCase() === "terms" 
                      ? "term-and-conditions" 
                      : item.toLowerCase() === "refunds" 
                        ? "refund-policy" 
                        : item.toLowerCase() + "-policy"
                  }`
                )}
                className="hover:text-white cursor-pointer transition-colors duration-300"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Right: Copyright */}
          <div className="flex items-center text-[10px] uppercase tracking-[0.2em] text-gray-600 font-Poppins font-semibold">
            <span>© 2025 Blush Maison</span>
            <PiTrademarkRegisteredLight className="mx-2 text-sm" />
            <span className="hidden sm:inline">All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;