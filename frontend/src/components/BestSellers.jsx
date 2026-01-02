import React, { useContext } from 'react'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { HiOutlineChevronRight } from "react-icons/hi2";

// Assets
import flower1 from '../assets/flower1.png'
import cake2 from '../assets/cake2.png'
import bouquet from '../assets/bouquet.png'
import hamper from '../assets/hamper.png'
import chocolate2 from '../assets/chocolate2.png'
import flower14 from '../assets/flower17.png'
import neklace from '../assets/neklace.png'
import fruitsandflowers from '../assets/fruitsandflowers.png'
import basket from '../assets/basket.png'

const BestSellers = () => {
  const nav = useNavigate()
  const { loading } = useContext(ProductContext)

  const gotoProductListing = (productCategory) => {
    nav('/product-listing', { state: { selectedCategory: productCategory } })
    window.scrollTo(0, 0)
  }

  const categories = [
    { image: flower14, name: "Flowers", category: "Flowers" },
    { image: cake2, name: "Cakes", category: "Cake" },
    { image: bouquet, name: "Bouquet's", category: "Bouquet" },
    { image: hamper, name: "Hamper's", category: "Hamper" },
    { image: basket, name: "Basket", category: "Basket" },
    { image: chocolate2, name: "Chocolates", category: "Chocolate" },
    { image: neklace, name: "Neklace", category: "Neklace" },
    { image: fruitsandflowers, name: "Fruit's & Flower's", category: "Fruits and Flowers" },
  ]

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="w-full mt-10 md:mt-16 overflow-hidden">
      {loading ? (
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 px-6 md:px-20 py-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-[140px] h-[200px] md:w-[260px] md:h-[340px] flex flex-col gap-3">
              <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
                <Skeleton height="160px" className="rounded-[25px]" />
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={15} />
              </SkeletonTheme>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full">
          {/* Heading */}
          <div className="flex items-center justify-between w-full md:px-20 px-5">
            <h2 className="font-chopard md:text-[40px] text-[22px] mt-6">Signature Categories</h2>
          </div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-10 px-3 sm:px-8 md:px-20 py-10"
          >
            {categories.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                onClick={() => gotoProductListing(item)}
                className="relative w-[140px] sm:w-[180px] md:w-[250px] lg:w-[270px] h-[140px] sm:h-[190px] md:h-[230px] lg:h-[260px] cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 rounded-[25px] overflow-hidden group"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <h3 className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[11px] sm:text-[12px] md:text-[14px] font-medium font-montserrat text-center w-[90%] truncate">
                  {item.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider */}
          <div className="w-[90%] h-[1px] bg-gray-200 rounded-full mx-auto my-6 md:my-10"></div>
        </div>
      )}
    </section>
  )
}

export default BestSellers
