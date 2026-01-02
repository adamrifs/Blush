import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { FiShield, FiLock, FiInfo } from 'react-icons/fi'

const PrivacyPolicy = () => {
    return (
        <div className="bg-[#fdfdfd] min-h-screen font-montserrat">
            <Navbar />

            {/* --- HERO HEADER --- */}
            <section className="w-full bg-[#f8f6ff] py-16 md:py-24 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center"
                    >
                        <span className="text-[#b89bff] text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">
                            Legal Maison
                        </span>
                        <h1 className="text-4xl md:text-6xl font-chopard text-[#1a1a1a] mb-6">
                            Privacy <span className="italic text-[#b89bff]">Policy</span>
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light">
                            At <span className="text-gray-900 font-medium">BLUSH FLORAL BOUTIQUE LLC</span>, we value your trust above all else.
                            This document outlines how we curate and protect your digital experience.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- CONTENT BODY --- */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Side Indicator (Luxury Boutique Style) */}
                    <div className="hidden md:block md:col-span-1 border-l border-[#b89bff]/20">
                    </div>

                    <div className="md:col-span-11 space-y-20">

                        {/* Section 1: Intro */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="prose prose-sm max-w-none"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <FiShield className="text-[#b89bff] text-xl" />
                                <h2 className="text-xl md:text-2xl font-chopard text-gray-900 m-0">General Overview</h2>
                            </div>
                            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)]">
                                <p className="text-gray-600 leading-[1.8] font-light text-[15px]">
                                    At BLUSH FLORAL BOUTIQUE LLC, accessible from www.blushflowers.ae, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by www.blushflowers.ae and how we use it.
                                    <br /><br />
                                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                                    <br /><br />
                                    This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in www.blushflowers.ae. This policy is not applicable to any information collected offline or via channels other than this website.
                                </p>
                            </div>
                        </motion.div>

                        {/* Section 2: Consent */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <FiLock className="text-[#b89bff] text-xl" />
                                <h2 className="text-xl md:text-2xl font-chopard text-gray-900">Consent</h2>
                            </div>
                            <p className="text-gray-500 font-light leading-relaxed pl-8 border-l-2 border-[#f8f6ff]">
                                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                            </p>
                        </motion.div>

                        {/* Section 3: Information Collection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2rem] bg-[#fafafa] border border-gray-100">
                                <h3 className="font-chopard text-lg mb-4 text-gray-900">Information We Collect</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-light">
                                    The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                                    <br /><br />
                                    If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
                                <h3 className="font-chopard text-lg mb-4 text-gray-900">Information Usage</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Provide, operate, and maintain our website",
                                        "Improve, personalize, and expand our website",
                                        "Understand and analyze how you use our website",
                                        "Develop new products, services, features, and functionality",
                                        "Communicate with you for customer service",
                                        "Send you emails and find and prevent fraud"
                                    ].map((text, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-500 font-light">
                                            <span className="text-[#b89bff]">•</span> {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Section 4: Log Files */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)]"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <FiInfo className="text-[#b89bff] text-xl" />
                                <h2 className="text-xl md:text-2xl font-chopard text-gray-900 m-0">Log Files</h2>
                            </div>
                            <p className="text-gray-600 text-[15px] leading-[1.8] font-light">
                                www.blushflowers.ae follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                            </p>
                        </motion.div>

                        {/* Contact Card */}
                        <div className="bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] transition-all duration-300 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#b89bff]/10 blur-3xl rounded-full" />
                            <h3 className="text-white font-chopard text-2xl mb-4">Questions?</h3>
                            <p className="text-white text-sm font-light mb-8 max-w-md mx-auto">
                                If you have any questions or suggestions about our Privacy Policy, our concierge team is here to assist.
                            </p>
                            <button className="px-10 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                Contact Concierge
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .font-chopard { font-family: 'Chopard', serif; }
            `}} />
        </div>
    )
}

export default PrivacyPolicy