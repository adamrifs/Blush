import React from 'react'
import { Heart } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Favourites = () => {
    const nav = useNavigate()
    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-[#f9f8f4] rounded-lg border border-[#e9e9e9] text-center p-6 font-Poppins">
            {/* Icon */}
            <div className="text-gray-400 mb-6">
                <Heart size={64} strokeWidth={1.2} />
            </div>

            {/* Message */}
            <h2 className="text-xl sm:text-2xl text-gray-800 mb-6">
                Choose your favorite flowers
            </h2>

            {/* Button */}
            <button
                className="px-6 py-3 rounded-full 
        bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
        border border-[#bca8ff]
        shadow-[0_2px_8px_rgba(0,0,0,0.1)]
        hover:from-[#a27aff] hover:to-[#cda5ff]
        hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
        text-white font-medium transition-all duration-300 ease-in-out"
                onClick={() => nav('/product-listing')}>
                Pick your favorite one
            </button>
        </div>
    )
}

export default Favourites