import React from 'react'
import flower12 from '../assets/flower12.png'
import flower13 from '../assets/flower13.png'
import flower14 from '../assets/flower14.png'
import desertShop from '../assets/desertShop.png'
import { useNavigate } from 'react-router-dom'

const CuratedforYou = () => {
    const nav = useNavigate()

    const gotoProductListing = () => {
        nav('/product-listing')
        window.scrollTo(0, 0)
    }

    const Card = ({ image, title }) => (
        <div className='relative group flex-shrink-0 md:w-[50%] lg:w-[25%] md:h-[500px] w-[300px] h-[350px] overflow-hidden rounded-[25px]'>

            {/* Image */}
            <img
                src={image}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
            />

            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0'></div>

            {/* Content */}
            <h2 className='font-chopard absolute bottom-15 left-5 text-white text-[22px] md:text-[24px] z-10'>
                {title}
            </h2>

            <button
                className='
                    z-10
                    px-5 py-1
                    bg-transparent
                    border-2 border-white
                    rounded-full
                    absolute bottom-5 left-5
                    text-white
                    font-montserrat
                    hover:bg-white hover:text-black
                    transition duration-300
                    cursor-pointer
                    active:scale-90
                '
                onClick={gotoProductListing}
            >
                Bloom Now
            </button>
        </div>
    )

    return (
        <div className='w-[100vw] mt-0 md:mt-5'>
            <div className='flex md:w-[100%] items-center justify-between md:px-20 px-5 pb-3'>
                <h2 className='font-chopard md:text-[40px] text-[20px]'>
                    Curated for You
                </h2>
            </div>

            <div className='w-full lg:w-screen lg:overflow-hidden px-10 md:px-20 flex items-center justify-start lg:justify-center gap-5 overflow-x-scroll scrollbar-hide mb-10 md:mb-16'>

                <Card image={flower12} title="Azhar Collection" />
                <Card image={flower13} title="Express Delivery" />
                <Card image={desertShop} title="Blossoms in the Sands" />
                <Card image={flower14} title="Your daily floral surprise" />

            </div>

            <div className='w-[90%] h-[1px] bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2 my-5 md:my-0'></div>
        </div>
    )
}

export default CuratedforYou
