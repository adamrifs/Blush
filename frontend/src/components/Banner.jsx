import React, { useContext } from 'react'
import banner1 from '../assets/banner2.png'
import banner1Mob from '../assets/banner2mob.png'
import banner2 from '../assets/banner1.png'
import banner2Mob from '../assets/banner1mob.png'
import banner3 from '../assets/banner3.png'
import banner3Mob from '../assets/banner3mob.png'
import Slider from 'react-slick'
import { ProductContext } from '../context/ProductContext'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const { loading } = useContext(ProductContext)
  const nav = useNavigate()

  const gotoProductListing = () => {
    nav('/product-listing')
    window.scrollTo(0, 0)
  }

  // UPDATED: Added a 'highlight' property to make titles dynamic and elegant
  const banners = [
    {
      image: banner1,
      mobileImage: banner1Mob,
      subtitle: '',
      title: '',
      highlight: '',
    },
    {
      image: banner2,
      mobileImage: banner2Mob,
      subtitle: '',
      title: '',
      highlight: '',
    },
    {
      image: banner3,
      mobileImage: banner3Mob,
      subtitle: '',
      title: '',
      highlight: '',
    },
  ]

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500, 
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    fade: true,
    pauseOnHover: false,
    appendDots: dots => (
      <div className="absolute bottom-8 w-full">
        <ul className="flex justify-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2 h-2 bg-white/30 rounded-full transition-all duration-500 hover:bg-white/60 active-dot:bg-[#b89bff]" />
    )
  }

  if (loading) {
    return (
      <div className="w-full px-4 md:px-10 mt-6">
        <div className="w-full h-[60vh] md:h-[80vh] rounded-[40px] overflow-hidden">
          <SkeletonTheme baseColor="#f5f5f5" highlightColor="#ffffff">
            <Skeleton height="100%" width="100%" />
          </SkeletonTheme>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full px-4 md:px-10 mt-1 overflow-hidden">
      <div className="w-full h-[65vh] md:h-[72vh] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative group">
        <Slider {...settings}>
          {banners.map((item, i) => (
            <div key={i} className="relative w-full h-[65vh] md:h-[72vh] outline-none">

              {/* IMAGE LAYER with subtle zoom */}
              <picture>
                <source media="(max-width: 768px)" srcSet={item.mobileImage} />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[8000ms] ease-out"
                />
              </picture>

              {/* OVERLAY: Radial gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />

              {/* CONTENT BOX: Center-Left Aligned */}
              <div className="absolute bottom-10 md:-left-10 flex items-center px-6 md:px-24">
                <div className="max-w-[700px] animate-fadeIn">
                  
                    {item.subtitle && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-8 bg-[#b89bff]"></span>
                        <span className="text-white/90 font-montserrat text-[10px] md:text-xs tracking-[0.4em] uppercase font-light">
                          {item.subtitle}
                        </span>
                      </div>
                    )}

                    <h2 className="text-white font-chopard text-5xl md:text-8xl leading-tight mb-10 drop-shadow-2xl">
                      {item.title} <br />
                      <span className="italic font-light text-[#d6b8ff] opacity-90">{item.highlight}</span>
                    </h2>

                    <button
                      onClick={gotoProductListing}
                      className="
                        group/btn relative
                        bg-white text-gray-900 
                        px-10 md:px-14 py-4 
                        rounded-full font-Poppins font-semibold
                        text-[10px] md:text-xs uppercase tracking-[0.2em]
                        overflow-hidden transition-all duration-700
                        hover:bg-gradient-to-r hover:from-[#b89bff] hover:to-[#d6b8ff] 
                        hover:text-white border border-transparent hover:border-white/20
                        shadow-xl hover:shadow-[0_10px_30px_rgba(184,155,255,0.4)]
                        flex items-center gap-2
                      "
                    >
                      <span>Discover Collection</span>
                      <svg 
                        className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  
                </div>
              </div>

            </div>
          ))}
        </Slider>

        {/* CSS FOR CUSTOM DOTS & ANIMATIONS */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .slick-dots li button:before { display: none; }
          .slick-dots li.slick-active div {
            width: 40px !important;
            background: linear-gradient(90deg, #b89bff, #d6b8ff) !important;
            opacity: 1 !important;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}} />
      </div>
    </section>
  )
}

export default Banner