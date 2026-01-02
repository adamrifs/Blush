import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

/* Motion variants */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutUs = () => {
    const nav = useNavigate();

    return (
        <div>
            <Navbar />

            <section className="w-full bg-white font-Poppins overflow-hidden">

                {/* ===== HERO TEXT ===== */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-[1200px] mx-auto px-5 md:px-20 pt-16 pb-12 text-center"
                >
                    <motion.h1
                        variants={item}
                        className="font-chopard text-[28px] md:text-[44px] font-medium mb-6"
                    >
                        About Blush
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="text-gray-500 text-sm md:text-[16px] max-w-3xl mx-auto leading-relaxed font-montserrat"
                    >
                        A floral brand inspired by emotion, elegance, and meaningful
                        moments — thoughtfully crafted in the heart of the UAE.
                    </motion.p>
                </motion.div>

                {/* ===== STORY CARD ===== */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-[1100px] mx-auto px-5 md:px-20"
                >
                    <div className="bg-[#F9F8F6] rounded-[35px] p-6 md:p-10 shadow-sm">
                        <h2 className="font-chopard text-[22px] md:text-[32px] mb-6">
                            Our Story
                        </h2>

                        <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-montserrat">
                            Blush was born in the heart of the United Arab Emirates — inspired
                            by a culture that celebrates beauty, emotion, and thoughtful
                            gifting.
                            <br /><br />
                            What began as a simple idea soon evolved into a brand devoted to
                            transforming flowers into meaningful expressions of love,
                            gratitude, and celebration.
                            <br /><br />
                            Every creation is handcrafted with care, using premium materials
                            and refined design. At Blush, we believe gifts are not just objects
                            — they are emotions, stories, and memories waiting to be shared.
                        </p>
                    </div>
                </motion.div>

                {/* ===== VALUES / PROMISE ===== */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-[1200px] mx-auto px-5 md:px-20 py-14"
                >
                    <motion.div
                        variants={item}
                        className="bg-white border border-gray-200 rounded-[35px] p-6 md:p-10 shadow-sm"
                    >
                        <h2 className="font-chopard text-[22px] md:text-[30px] mb-6">
                            Our Promise
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            {[
                                "Premium quality & fresh designs",
                                "Reliable delivery across the UAE",
                                "Moments crafted with care & elegance",
                            ].map((text, i) => (
                                <div
                                    key={i}
                                    className="bg-[#f7f5f3] rounded-[25px] p-6 text-sm md:text-[15px] text-gray-600 font-montserrat"
                                >
                                    {text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* ===== CTA ===== */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-[1200px] mx-auto px-5 md:px-20 pb-20"
                >
                    <div className="bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
            rounded-[40px] p-10 md:p-14 text-center text-white shadow-[0_4px_20px_rgba(107,70,193,0.25)]">

                        <p className="text-sm md:text-[16px] font-montserrat mb-8 max-w-2xl mx-auto">
                            We deliver across all seven Emirates with care, precision, and
                            attention to detail — helping you celebrate life’s most important
                            moments beautifully.
                        </p>

                        <button
                            className="bg-white text-gray-800 px-8 py-3 rounded-full font-montserrat shadow hover:bg-gray-100 transition cursor-pointer"
                            onClick={() => {
                                nav("/contact-us-page");
                                window.scrollTo(0, 0);
                            }}
                        >
                            Contact Us
                        </button>
                    </div>
                </motion.div>

            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
