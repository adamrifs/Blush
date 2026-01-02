import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMapPin } from "react-icons/fi";

const AnnouncementBar = () => {
  const emirates = [
    "Abu Dhabi",
    "Ajman",
    "Al Ain",
    "Dubai",
    "Sharjah",
  ];

  const [selected, setSelected] = useState(
    localStorage.getItem("selectedEmirate") || "Abu Dhabi"
  );

  const [open, setOpen] = useState(false);

  const changeEmirate = (value) => {
    window.dispatchEvent(
      new CustomEvent("announcementEmirateChange", { detail: value })
    );
    setSelected(value);
    localStorage.setItem("selectedEmirate", value);
    window.dispatchEvent(new CustomEvent("emirateChanged", { detail: value }));
  };

  useEffect(() => {
    const handler = (e) => {
      setSelected(e.detail);
      localStorage.setItem("selectedEmirate", e.detail);
    };
    window.addEventListener("emirateChanged", handler);
    return () => window.removeEventListener("emirateChanged", handler);
  }, []);

  return (
    <div className="
      w-full h-[32px] md:h-[42px]
      bg-[#0a0a0a]
      flex items-center justify-between
      px-6 md:px-12
      font-montserrat
      border-b border-white/5
    ">
      
      {/* LEFT: Subtle Brand Tagline */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b89bff] animate-pulse"></span>
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">
          Premium Florist
        </p>
      </div>

      {/* CENTER: Rotating or Static Announcement */}
      <div className="flex-1 flex justify-center overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            text-[9px] md:text-[11px]
            text-white/80
            tracking-[0.15em]
            uppercase
            font-light
            text-center
            select-none
          "
        >
          Delivery available across all Emirates
        </motion.h2>
      </div>

      {/* RIGHT: Sophisticated Location Picker */}
      <div className="relative flex justify-end min-w-[120px] md:min-w-[180px]">
        <motion.div
          onClick={() => setOpen(!open)}
          whileHover={{ backgroundColor: "rgba(184, 155, 255, 0.1)" }}
          className="
            flex items-center gap-2
            px-3 py-1
            rounded-full
            bg-white/5
            border border-white/10
            text-white text-[9px] md:text-[11px]
            cursor-pointer select-none
            transition-all duration-300
            hover:border-[#b89bff]/40
          "
        >
          <FiMapPin className="text-[#b89bff] text-[10px] md:text-xs" />
          <span className="font-light text-white/60 hidden md:block">
            Shipping to:
          </span>
          <span className="font-semibold tracking-wide uppercase">
            {selected}
          </span>
          <FiChevronDown
            className={`
              text-xs 
              transition-transform duration-500
              text-[#b89bff]
              ${open ? "rotate-180" : ""}
            `}
          />
        </motion.div>

        {/* DROPDOWN MENU */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="
                absolute right-0 mt-10
                bg-[#111111]
                border border-white/10
                text-white/90
                rounded-2xl
                shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                w-44
                overflow-hidden
                z-[1000]
                backdrop-blur-xl
              "
            >
              <div className="py-2">
                <p className="px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5 mb-1">
                  Select Location
                </p>
                {emirates.map((em) => (
                  <motion.li
                    key={em}
                    whileHover={{ x: 5, color: "#d6b8ff" }}
                    onClick={() => {
                      changeEmirate(em);
                      setOpen(false);
                    }}
                    className="
                      px-5 py-2.5
                      text-[11px]
                      font-medium
                      tracking-wide
                      hover:bg-white/5
                      cursor-pointer
                      transition-all
                      flex items-center justify-between
                      group
                    "
                  >
                    {em}
                    {selected === em && (
                      <span className="w-1 h-1 rounded-full bg-[#b89bff]"></span>
                    )}
                  </motion.li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}

export default AnnouncementBar