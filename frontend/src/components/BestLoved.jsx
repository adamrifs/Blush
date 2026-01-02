import React from 'react'
import flower9 from '../assets/flower9.png'
import flower10 from '../assets/flower10.png'
import flower11 from '../assets/flower11.png'
import cake from '../assets/cake.png'
import chocolate from '../assets/chocolate.png'
import { motion, scale } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BestLoved = () => {
    const ourProducts = [
        {
            image: flower9,
            category: 'Bouquet'
        },
        {
            image: flower10,
            category: 'Vase Arrangements'
        },
        {
            image: cake,
            category: "Cake"
        },
        {
            image: chocolate,
            category: "Chocolate"
        }
    ]

    const nav = useNavigate()

    const gotoProductListing = (product) => {
        nav('/product-listing', { state: { selectedCategory: product } })
        window.scrollTo(0, 0)
    }

    const containerVariant = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }
    const cardVariant = {
        hidden: { opacity: 0, y: -50 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div className='w-[100vw] mt-10 md:mt-10'>
            <div className='flex md:w-[100%] items-center justify-between md:px-20 px-5 pb-3'>
                <h2 className='font-chopard md:text-[40px] text-[20px] '>Our Best-Loved</h2>
            </div>

            {/* ================ listing ================== */}
            <motion.div
                variants={containerVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex md:w-[100%] md:h-[320px] gap-2 overflow-x-auto scrollbar-hide items-center justify-evenly md:px-20 px-5 mt-2 md:mt-0"
            >
                {ourProducts.map((item, i) => (
                    <motion.div
                        variants={cardVariant}
                        key={i}
                        className="flex-shrink-0 md:w-[230px] md:h-[230px] w-[100px] h-[100px] rounded-full bg-[#f3f3f4] overflow-hidden cursor-pointer"
                        onClick={() => gotoProductListing(item)}
                    >
                        <img
                            src={item.image}
                            className={`w-full h-full object-cover hover:scale-105 transition duration-300 ${i === 0 ? 'rotate-[340deg]' : ''
                                }`}
                        />
                    </motion.div>
                ))}
            </motion.div>
            <div className='w-[90%] h-[1px] bg-gray-200 rounded-full absolute left-1/2 -translate-1/2 my-5 md:my-5'></div>
        </div>
    )
}

export default BestLoved