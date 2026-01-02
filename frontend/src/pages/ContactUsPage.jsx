import React from "react";
import { motion } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } }
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ContactUsPage = () => {
    const MapEmbed = () => (
        <div className="w-full h-[260px] md:h-[320px] rounded-[35px] overflow-hidden shadow-sm">
            <iframe
                title="Blush Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3633.251628150236!2d54.5065737!3d24.4073243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e415212557f0d%3A0x8e662618e3aea73e!2sBlush%20Floral%20Boutique!5e0!3m2!1sen!2sin!4v1766142820991!5m2!1sen!2sin" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );

    return (
        <div>
            <Navbar />
            <section className="w-full bg-white font-Poppins overflow-hidden">

                {/* ===== HEADER ===== */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={item}
                    className="max-w-[1400px] mx-auto px-5 md:px-20 pt-12 pb-6"
                >
                    <h1 className="font-chopard text-[26px] md:text-[40px] mb-3">
                        Contact Us
                    </h1>
                    <p className="text-gray-500 text-sm md:text-[15px] max-w-xl font-montserrat">
                        We’re here to help you create meaningful moments.
                        Reach out to us for orders, custom requests, or any questions.
                    </p>
                </motion.div>

                {/* ===== CONTENT ===== */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-[1400px] mx-auto px-5 md:px-20 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10"
                >

                    {/* ===== CONTACT INFO ===== */}
                    <motion.div variants={item} className="flex flex-col gap-6">

                        <div className="bg-[#F9F8F6] rounded-[35px] p-6 md:p-8 shadow-sm">
                            <h2 className="font-chopard text-[20px] md:text-[28px] mb-6">
                                Get in Touch
                            </h2>

                            <div className="flex flex-col gap-5">

                                <div className="flex items-start gap-4">
                                    <MdEmail className="text-[#a27aff] text-2xl" />
                                    <div>
                                        <h4 className="font-montserrat font-medium text-sm">
                                            Email
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                            info@blushflowers.ae
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MdPhone className="text-[#a27aff] text-2xl" />
                                    <div>
                                        <h4 className="font-montserrat font-medium text-sm">
                                            Phone
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                            +971 52 799 4773
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MdLocationOn className="text-[#a27aff] text-2xl" />
                                    <div>
                                        <h4 className="font-montserrat font-medium text-sm">
                                            Location
                                        </h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            United Arab Emirates <br />
                                            Delivering across all 7 Emirates
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <motion.div variants={item}>
                            <MapEmbed />
                        </motion.div>

                        {/* Small Note Card */}
                        <div className="bg-[#f7f5f3] rounded-[25px] p-5 shadow-sm">
                            <p className="text-xs md:text-sm text-gray-500 font-montserrat leading-relaxed">
                                Orders placed before <b>2:00 PM</b> are eligible for same-day
                                delivery. For custom or bulk orders, please contact us in advance.
                            </p>
                        </div>
                    </motion.div>

                    {/* ===== CONTACT FORM ===== */}
                    <motion.div variants={item}>
                        <div className="bg-white border border-gray-200 rounded-[35px] p-6 md:p-8 shadow-sm">
                            <h2 className="font-chopard text-[20px] md:text-[28px] mb-6">
                                Send Us a Message
                            </h2>

                            <form className="flex flex-col gap-5">

                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#b89bff]"
                                />

                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#b89bff]"
                                />

                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#b89bff]"
                                />

                                <textarea
                                    rows="4"
                                    placeholder="Your Message"
                                    className="border border-gray-300 rounded-[20px] px-5 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b89bff]"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    className="mt-4 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                border border-[#bca8ff]
                shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                hover:from-[#a27aff] hover:to-[#cda5ff]
                hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
                text-white py-3 rounded-full transition font-montserrat text-sm cursor-pointer"
                                >
                                    Send Message
                                </motion.button>

                            </form>
                        </div>
                    </motion.div>

                </motion.div>

            </section>
            <Footer />
        </div>
    );
};

export default ContactUsPage;
