import React, { useContext } from 'react'
import { ProductContext } from '../context/ProductContext'
import { HiOutlineChevronRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const Featured = () => {
    const { products, loading } = useContext(ProductContext)
    const maximumProducts = products.filter((item) => item.isFeatured).sort(() => 0.5 - Math.random()).slice(0, 4)
    const nav = useNavigate()

    const gotoProductListing = (product) => {
        nav("/product-listing", { state: { selectedCategory: product } });
        window.scrollTo(0, 0);
    };

    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -50 },
        show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    };

    const resolveImage = (img) => {
        if (!img) return "";
        if (typeof img === "string") return img;
        if (typeof img === "object") return img.url || "";
        return "";
    };

    return (
        <div className="w-full mt-5 overflow-hidden">
            {loading ? (
                <div className="flex md:w-[100%] md:h-[480px] gap-8 md:gap-0 overflow-x-auto scrollbar-hide items-center justify-evenly md:px-20 px-5 mt-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="w-[140px] h-[220px] md:w-[270px] md:h-[370px] flex flex-col gap-3"
                        >
                            <Skeleton
                                height={160}
                                width={160}
                                className="md:w-[270px] md:h-[270px] md:rounded-[50px] rounded-[35px]"
                            />
                            <Skeleton width="80%" height={20} />
                            <Skeleton width="60%" height={15} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {/* Heading */}
                    <div className="flex md:w-[100%] items-center justify-between md:px-20 px-5">
                        <h2 className="font-chopard md:text-[40px] text-[22px]">
                            Featured Products
                        </h2>
                        <button
                            onClick={() => gotoProductListing(null)}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff]
              shadow-[0_2px_8px_rgba(0,0,0,0.1)]
              hover:from-[#a27aff] hover:to-[#cda5ff]
              hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
              text-white md:px-6 md:py-3 px-3 py-2 text-xs md:text-[15px]
              font-montserrat rounded-[20px] transition duration-300 cursor-pointer"
                        >
                            See Deals <HiOutlineChevronRight />
                        </button>
                    </div>

                    {/* Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-8"
                    >
                        <div
                            className="
                flex gap-3 px-5 overflow-x-auto scrollbar-hide
                md:grid md:overflow-visible
                md:grid-cols-2 md:gap-6 md:px-20
                lg:grid-cols-3
                xl:grid-cols-4
              "
                        >
                            {maximumProducts.map((item) => (
                                <motion.div
                                    key={item._id}
                                    variants={cardVariants}
                                    className="
                    flex-shrink-0
                    w-[140px] h-[220px]
                    md:w-auto md:h-[370px]
                    cursor-pointer
                  "
                                >
                                    <Link to={`/product/${item._id}`}>
                                        {/* Image */}
                                        <div
                                            className="
                        w-[140px] h-[140px]
                        md:w-full md:aspect-square md:h-[270px]
                        rounded-[35px] md:rounded-[38px]
                        overflow-hidden shadow-md
                      "
                                        >
                                            <img
                                                src={resolveImage(item.image?.[0])}
                                                alt={item.name}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center justify-between mt-3">
                                            <p className="font-montserrat text-xs md:text-sm text-gray-500">
                                                AED{" "}
                                                <span className="text-lg md:text-xl text-black font-medium ml-1">
                                                    {(item.price * 1.05).toFixed(2)}
                                                </span>
                                            </p>
                                            <span className="text-[9px] md:text-[11px] text-gray-400">
                                                VAT Included
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <p className="font-montserrat text-xs md:text-sm truncate">
                                            {item.name}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="w-[90%] md:w-[70%] h-px bg-gray-200 mx-auto my-10" />
                </div>
            )}
        </div>
    )
}

export default Featured