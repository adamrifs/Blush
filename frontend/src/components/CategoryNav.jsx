import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryNav = () => {
  const navigate = useNavigate();

  const categories = [
    { label: "New Arrivals", category: null },
    { label: "Best Sellers", category: null },
    { label: "Luxury Collection", category: "Forever Flowers" },
    { label: "Signature Bouquets", category: "Bouquet" },
    { label: "Cake", category: "Cake" },
    { label: "Chocolate and Flowers", category: "Chocolate and Flowers" },
  ];

  const handleNavigation = (category) => {
    navigate("/product-listing", {
      state: category ? { selectedCategory: { category } } : {},
    });
    window.scrollTo(0, 0);
  };

  return (
    <nav className="w-full bg-white z-40">
      {/* Top Hairline - very subtle */}
      <div className="border-t border-gray-50" />

      <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex justify-center items-center py-6 gap-8 md:gap-14 min-w-max">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(cat.category)}
              className="group relative flex flex-col items-center py-1"
            >
              <span
                className="
                  text-[10px] md:text-[11px]
                  uppercase tracking-[0.35em]
                  font-medium
                  text-gray-400
                  group-hover:text-black
                  transition-colors duration-500
                  font-Poppins
                  cursor-pointer
                "
              >
                {cat.label}
              </span>

              {/* --- PREMIUM EXPANDING LINE --- */}
              {/* This line is absolute positioned to not jump the layout */}
              <div className="absolute -bottom-1 w-full flex justify-center">
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-[#b89bff] to-transparent"
                />
              </div>
              
              {/* Static faint line for a 'ghost' effect (Optional/Premium touch) */}
              <div className="absolute -bottom-1 w-full h-[1px] bg-gray-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Hairline */}
      <div className="border-b border-gray-50" />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </nav>
  );
};

export default CategoryNav;