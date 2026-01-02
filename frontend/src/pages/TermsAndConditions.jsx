import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { FiFileText, FiShield, FiLock, FiExternalLink, FiMail } from 'react-icons/fi'

const TermsAndConditions = () => {
    // Brand Gradient Class for consistency across legal pages
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
                            Maison Guidelines
                        </div>
                        <h1 className="text-5xl md:text-7xl font-chopard text-[#1a1a1a] mb-6 tracking-tight">
                            Terms <span className="italic">& Conditions</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light font-Poppins">
                            Welcome to Blush Flowers. These terms outline the elegant agreement 
                            between our boutique and our valued clientele.
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiFileText /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiShield /></div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${brandGradient}`}><FiLock /></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-11 space-y-24">
                        
                        {/* Section 1: Intro & Terminology */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl md:text-3xl font-chopard text-gray-900 mb-8 uppercase tracking-wide">Agreement & Terminology</h2>
                            <div className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(184,155,191,0.08)]">
                                <p className="text-gray-600 leading-[1.9] font-light text-[15px] font-Poppins">
                                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use www.blushflowers.ae if you do not agree to all terms stated here.
                                    <br /><br />
                                    The terminology "Client", "You" and "Your" refers to the person compliant to the Company's terms. "The Company", "Ourselves", "We", and "Us", refers to <span className="font-semibold text-black">BLUSH FLORAL BOUTIQUE LLC</span>.
                                </p>
                            </div>
                        </motion.div>

                        {/* Section 2: Cards Grid (Cookies & License) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-[#f8f6ff] border border-[#b89bff]/10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                                    <FiShield className="text-[#b89bff] text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">Cookies</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins">
                                    We employ cookies to enhance your experience. By accessing our Maison, you agree to use cookies in accordance with our Privacy Policy.
                                </p>
                            </motion.div>

                            <motion.div 
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-6">
                                    <FiLock className="text-[#b89bff] text-xl" />
                                </div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900">License</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed font-light font-Poppins mb-4">
                                    Unless stated, BLUSH FLORAL BOUTIQUE LLC owns the intellectual property for all material on this site:
                                </p>
                                <ul className="space-y-2 text-[13px] text-gray-400 font-light font-Poppins">
                                    <li>• No redistribution of content</li>
                                    <li>• No republication of material</li>
                                    <li>• No selling or renting material</li>
                                </ul>
                            </motion.div>
                        </div>

                        {/* Section 3: User Responsibility */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)]"
                        >
                            <h2 className="text-2xl font-chopard text-gray-900 mb-6 uppercase tracking-widest">User Engagement</h2>
                            <p className="text-gray-600 text-[15px] leading-[1.9] font-light font-Poppins">
                                Parts of this website offer an opportunity for users to post opinions. Blush does not filter or review comments prior to their presence. You warrant that your comments do not infringe intellectual property rights and are not unlawful.
                            </p>
                        </motion.div>

                        {/* Section 4: Liability & Disclaimer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900 uppercase tracking-wider flex items-center gap-3">
                                    <FiExternalLink className="text-[#b89bff]" /> Content Liability
                                </h3>
                                <p className="text-gray-500 text-[14px] leading-[1.8] font-light font-Poppins">
                                    We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims arising from your Website.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-chopard text-xl mb-4 text-gray-900 uppercase tracking-wider flex items-center gap-3">
                                    <FiShield className="text-[#b89bff]" /> Disclaimer
                                </h3>
                                <p className="text-gray-500 text-[14px] leading-[1.8] font-light font-Poppins">
                                    To the maximum extent permitted by law, we exclude all representations and warranties relating to our website and its use.
                                </p>
                            </div>
                        </div>

                        {/* FINAL CTA: Contact */}
                        <motion.div 
                            className={`rounded-[3rem] p-12 text-center text-white relative overflow-hidden ${brandGradient}`}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <FiMail className="text-4xl mb-6 opacity-80" />
                                <h3 className="text-3xl font-chopard mb-4">Legal Inquiries</h3>
                                <p className="text-white/80 text-sm font-light mb-10 max-w-md font-Poppins">
                                    Should you require further clarification regarding our terms, our concierge is available for assistance.
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

export default TermsAndConditions