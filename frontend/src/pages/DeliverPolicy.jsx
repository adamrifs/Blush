import React from 'react'
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from 'framer-motion';
import { FiTruck, FiClock, FiPackage, FiHelpCircle, FiMail } from 'react-icons/fi';

const DeliveryPolicy = () => {
    // Brand Gradient Class for consistency
    const brandGradient = "bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] transition-all duration-300";

    return (
        <div className="bg-white min-h-screen font-montserrat text-[#1a1a1a]">
            <Navbar />
            
            {/* --- HERO HEADER --- */}
            <section className="w-full bg-[#fafafa] py-20 md:py-32 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className={`mb-6 px-4 py-1 rounded-full text-white text-[10px] uppercase tracking-[0.3em] font-bold ${brandGradient}`}>
                            Logistics Maison
                        </div>
                        <h1 className="text-5xl md:text-7xl font-chopard text-[#1a1a1a] mb-6 tracking-tight">
                            Shipping <span className="italic">& Delivery</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light font-Poppins">
                            From our atelier to your doorstep. We ensure every arrangement 
                            travels with care and arrives in pristine, breathtaking condition.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- CONTENT BODY --- */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT: Sidebar Navigation Indicators */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col gap-20 py-4 items-center">
                        <div className="w-px h-full bg-gray-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col gap-24">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiTruck /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiClock /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiHelpCircle /></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-11 space-y-24">
                        
                        {/* Section 1: Free Shipping */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-chopard text-gray-900 mb-8 uppercase tracking-wide">Complimentary Shipping</h2>
                            <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(184,155,191,0.08)] transition-all">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-20 h-20 rounded-full bg-[#f8f6ff] flex items-center justify-center shrink-0">
                                        <FiPackage className="text-3xl text-[#b89bff]" />
                                    </div>
                                    <p className="text-gray-600 leading-[1.9] font-light text-[15px] font-Poppins text-center md:text-left">
                                        We are proud to offer <span className="font-semibold text-black italic">Free Shipping within the UAE</span> for a limited period. Our boutique handles every delivery directly to ensure the quality of the flowers is never compromised during transit.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Section 2: Delivery Timeline Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-[#f8f6ff] border border-[#b89bff]/10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                    <FiClock className="text-[#b89bff] text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">Processing Time</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins">
                                    Orders are typically prepared within <span className="font-semibold text-black">24-48 hours</span>. This includes the sourcing of fresh blooms and the bespoke arrangement process by our floral artists.
                                </p>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-6">
                                    <FiTruck className="text-[#b89bff] text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">Shipping Time</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins">
                                    Once dispatched from our warehouse, delivery usually takes between <span className="font-semibold text-black">3 and 7 working days</span> depending on the specific Emirate and delivery slot.
                                </p>
                            </motion.div>
                        </div>

                        {/* Section 3: Support Card */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]"
                        >
                            <h2 className="text-2xl font-chopard text-gray-900 mb-6 uppercase tracking-widest">Customer Support</h2>
                            <p className="text-gray-600 text-[15px] leading-[1.9] font-light font-Poppins">
                                We guarantee the highest level of assistance regarding your shipment. If your order is delayed or you have specific delivery instructions (such as gate codes or preferred times), please reach out to our concierge team immediately.
                            </p>
                        </motion.div>

                        {/* FINAL CTA: Contact */}
                        <motion.div 
                            className={`rounded-[3rem] p-12 text-center text-white relative overflow-hidden ${brandGradient}`}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <FiMail className="text-4xl mb-6 opacity-80" />
                                <h3 className="text-3xl font-chopard mb-4">Track Your Order?</h3>
                                <p className="text-white/80 text-sm font-light mb-10 max-w-md font-Poppins">
                                    Our logistics team is available 24/7 to provide real-time updates on your floral delivery.
                                </p>
                                <button className="px-12 py-4 bg-white text-[#1a1a1a] rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl">
                                    Contact Logistics
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                .font-chopard { font-family: 'Chopard', serif; }
            `}} />
        </div>
    )
}

export default DeliveryPolicy;