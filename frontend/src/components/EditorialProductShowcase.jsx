import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { motion } from "framer-motion";

const EditorialProductShowcase = () => {
  const { products } = useContext(ProductContext);

  if (!products?.length) return null;

  const hero = products[23] || products[0];
  const side = products.slice(1, 5);

  const resolveImage = (img) => {
    if (!img) return "/placeholder.webp";
    if (Array.isArray(img)) return img[0];
    return img;
  };

  // 🔹 Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full md:w-[89%] mx-auto px-5 md:px-0 mt-20"
    >
      {/* Section Header */}
      <motion.div
        variants={fadeUp}
        className="mb-10 flex items-center justify-between"
      >
        <h2 className="font-chopard text-[26px] md:text-[40px]">
          Handpicked for You
        </h2>

        <Link
          to="/product-listing"
          className="flex items-center gap-2 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff]
            shadow-[0_2px_8px_rgba(0,0,0,0.1)]
            hover:from-[#a27aff] hover:to-[#cda5ff]
            hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
            text-white md:px-6 md:py-3 px-3  py-2 text-xs md:text-[15px]
            font-montserrat rounded-[20px] transition duration-300"
        >
          See Deals <HiOutlineChevronRight />
        </Link>
      </motion.div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Product */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="md:col-span-2"
        >
          <Link
            to={`/product/${hero.slug}`}
            className="relative block md:h-[520px] h-[420px] rounded-[28px]
              overflow-hidden group shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
          >
            <img
              src={resolveImage(hero.image)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="font-montserrat text-xs tracking-widest uppercase mb-2">
                Featured
              </p>
              <h3 className="font-chopard text-[26px] leading-tight mb-2">
                {hero.name}
              </h3>
              <p className="font-montserrat text-sm opacity-90">
                AED {(hero.price * 1.05).toFixed(2)} · VAT included
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Side Products */}
        <motion.div
          variants={container}
          className="grid grid-cols-2 md:grid-cols-1 gap-6"
        >
          {side.map((item) => (
            <motion.div
              key={item._id}
              variants={fadeRight}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Link
                to={`/product/${item.slug}`}
                className="group flex gap-4 items-center rounded-[22px] p-3
                  hover:bg-gray-50 transition"
              >
                <div className="w-[90px] h-[90px] rounded-[18px] overflow-hidden
                  flex-shrink-0 shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
                  <img
                    src={resolveImage(item.image)}
                    className="w-full h-full object-cover
                      group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div>
                  <h4 className="font-montserrat text-sm font-medium line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="font-montserrat text-xs text-gray-500 mt-1">
                    AED {(item.price * 1.05).toFixed(2)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default EditorialProductShowcase;
