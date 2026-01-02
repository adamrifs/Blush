import React from "react";

const FlowerLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-white via-[#f5f5f5] to-black/90 backdrop-blur-sm z-50">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Outer soft fade ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-300 to-transparent blur-2xl opacity-40"></div>

        {/* Inner black ring */}
        <div className="w-16 h-16 rounded-full border-[3px] border-black border-t-transparent animate-spin shadow-[0_0_20px_rgba(0,0,0,0.4)]"></div>

        {/* Subtle glowing dot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.7)]"></div>
      </div>
    </div>
  );
};

export default FlowerLoader;
