import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiAlertCircle, FiCheckCircle, FiMail } from 'react-icons/fi'

const RefundPolicy = () => {
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
                            Assurance Maison
                        </div>
                        <h1 className="text-5xl md:text-7xl font-chopard text-[#1a1a1a] mb-6 tracking-tight">
                            Refund <span className="italic">& Return</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light font-Poppins">
                            We stand behind the artistry of our blooms. If your experience isn't perfect, 
                            our dedicated team is committed to making it right.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- CONTENT BODY --- */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT: Icon Timeline Indicators */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col gap-20 py-4 items-center">
                        <div className="w-px h-full bg-gray-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col gap-24">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiRefreshCw /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiCheckCircle /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiAlertCircle /></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-11 space-y-24">
                        
                        {/* Section 1: Order Cancellation */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-chopard text-gray-900 mb-8 uppercase tracking-wide">Order Cancellation</h2>
                            <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                                <p className="text-gray-600 leading-[1.9] font-light text-[15px] font-Poppins">
                                    All orders can be cancelled until they are prepared and designed. Once the design process has begun or the arrangement has been dispatched, we cannot accept cancellations. 
                                    <br /><br />
                                    If your order has been paid and you need to make a change or cancel it, you must contact us within <span className="font-semibold text-black">12 hours of placing the order</span>. Once the packaging and preparation process has started, it can no longer be cancelled.
                                </p>
                            </div>
                        </motion.div>

                        {/* Section 2: Eligibility Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-[#f8f6ff] border border-[#b89bff]/10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                    <FiCheckCircle className="text-[#b89bff] text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">Guaranteed Refunds</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins mb-6">
                                    We issue refunds for the following circumstances:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Order not received within guaranteed time",
                                        "Wrong item received",
                                        "Arrangement arrived significantly damaged"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[13px] text-gray-600 font-light font-Poppins">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#b89bff]"></span> {text}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-6">
                                    <FiAlertCircle className="text-orange-400 text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">Non-Refundable</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins">
                                    Refunds are not granted if:
                                    <br /><br />
                                    • Your order does not arrive due to factors within your control (e.g. providing the wrong shipping address).
                                    <br /><br />
                                    • Exceptional circumstances outside our control (e.g. customs delays or natural disasters).
                                </p>
                            </motion.div>
                        </div>

                        {/* Section 3: Process */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]"
                        >
                            <h2 className="text-2xl font-chopard text-gray-900 mb-6 uppercase tracking-widest">Refund Request Process</h2>
                            <p className="text-gray-600 text-[15px] leading-[1.9] font-light font-Poppins">
                                You can submit refund or reshipment requests within <span className="font-semibold text-black">10 days</span> after the guaranteed delivery period has expired.
                                <br /><br />
                                To initiate a request, please visit our Contact page and provide your order number along with a description of the issue. Our quality assurance team will review your request and respond within 24-48 business hours.
                            </p>
                        </motion.div>

                        {/* FINAL CTA: Contact */}
                        <motion.div 
                            className={`rounded-[3rem] p-12 text-center text-white relative overflow-hidden ${brandGradient}`}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <FiMail className="text-4xl mb-6 opacity-80" />
                                <h3 className="text-3xl font-chopard mb-4">Need Assistance?</h3>
                                <p className="text-white/80 text-sm font-light mb-10 max-w-md font-Poppins">
                                    Our floral concierge is available to help resolve any concerns regarding your order.
                                </p>
                                <button className="px-12 py-4 bg-white text-[#1a1a1a] rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-xl">
                                    Contact Support
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

export default RefundPolicy;