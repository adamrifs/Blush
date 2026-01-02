import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiClock, FiNavigation, FiExternalLink } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StoreLocation = () => {
    // Dynamic store data based on your Contact Page
    const stores = [
        {
            id: 1,
            name: "Blush Boutique - Headquarters",
            address: "Near Jumeirah Beach Road, Al Safa 1, Dubai, UAE",
            phone: "+971 50 123 4567",
            hours: "Mon - Sun: 09:00 AM - 10:00 PM",
            coordinates: { lat: 25.1873, lng: 55.2281 },
            mapUrl: "https://www.google.com/maps?q=Al+Safa+1+Dubai"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] font-montserrat overflow-x-hidden">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-24 pb-16 px-6 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#b89bff] text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block"
                    >
                        Visit Our Maison
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-chopard mb-6 text-[#1a1a1a]"
                    >
                        Find a <span className="italic">Blush</span> Near You
                    </motion.h1>
                    <div className="h-[1px] w-24 bg-[#b89bff]/30 mx-auto" />
                </div>
            </section>

            {/* --- MAP & INFO CONTAINER --- */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-auto lg:h-[680px]">
                    
                    {/* LEFT: Store Card Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 flex flex-col gap-6"
                    >
                        {stores.map((store) => (
                            <div 
                                key={store.id}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-[#b89bff]/40 transition-all duration-500"
                            >
                                <h2 className="text-2xl font-chopard mb-8 text-[#1a1a1a]">{store.name}</h2>
                                
                                <div className="space-y-6 text-[13px] text-gray-500 font-light leading-relaxed">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-[#f8f6ff]">
                                            <FiMapPin className="text-[#b89bff] text-lg shrink-0" />
                                        </div>
                                        <p>{store.address}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-[#f8f6ff]">
                                            <FiPhone className="text-[#b89bff] text-lg shrink-0" />
                                        </div>
                                        <p>{store.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-full bg-[#f8f6ff]">
                                            <FiClock className="text-[#b89bff] text-lg shrink-0" />
                                        </div>
                                        <p>{store.hours}</p>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-col gap-3">
                                    <a 
                                        href={store.mapUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="w-full py-4 rounded-full bg-[#1a1a1a] text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b89bff] transition-all shadow-xl"
                                    >
                                        <FiNavigation /> Get Directions
                                    </a>
                                    <button className="w-full py-4 rounded-full bg-white border border-gray-200 text-[#1a1a1a] text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                                        <FiExternalLink /> Store Details
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Additional Info Box */}
                        <div className="p-8 rounded-[2rem] bg-[#f8f6ff] border border-[#b89bff]/10">
                            <p className="text-[10px] uppercase tracking-widest text-[#b89bff] font-bold mb-3">Private Viewing</p>
                            <p className="text-[12px] text-gray-500 leading-relaxed font-light">
                                Book a private consultation with our head floral designers for bespoke wedding and royal event arrangements.
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT: Map Display */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 relative rounded-[3rem] overflow-hidden border border-gray-100 group shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
                    >
                        {/* Light Mode Map Overlay */}
                        <div className="absolute inset-0 bg-blue-50/10 pointer-events-none z-10" />
                        
                        <iframe
                            title="Blush Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.17851002432!2d55.2255!3d25.1873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzE0LjMiTiA1NcKwMTMnMzEuOCJF!5e0!3m2!1sen!2sae!4v1670000000000!5m2!1sen!2sae"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(0.2) contrast(1.1) brightness(1.05)" }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>

                        {/* Floating Interaction Prompt */}
                        <div className="absolute bottom-10 left-10 z-20">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="px-8 py-4 bg-white/90 backdrop-blur-md border border-gray-100 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-[#1a1a1a] shadow-lg"
                            >
                                Exploring Al Safa District
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- SERVICES BAR --- */}
            <section className="max-w-7xl mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Click & Collect", desc: "Order online and pick up in 2 hours." },
                        { title: "Flower Bar", desc: "Build your own bouquet with our experts." },
                        { title: "Global Shipping", desc: "Send Blush elegance worldwide." }
                    ].map((service, i) => (
                        <div key={i} className="p-10 rounded-[2rem] bg-[#fafafa] border border-gray-100 text-center group hover:bg-white hover:shadow-xl transition-all duration-500">
                            <h3 className="text-[#b89bff] text-[11px] font-bold uppercase tracking-widest mb-4">{service.title}</h3>
                            <p className="text-[13px] text-gray-400 font-light leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />

            <style dangerouslySetInnerHTML={{ __html: `
                .font-chopard { font-family: 'Chopard', serif; }
            `}} />
        </div>
    );
};

export default StoreLocation;