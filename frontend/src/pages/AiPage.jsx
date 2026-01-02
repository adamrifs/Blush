import React, { useEffect } from "react";
import { FiSearch, FiCpu, FiCamera, FiWind, FiArrowRight } from "react-icons/fi";
import { GiCrystalGrowth, GiAbstract050 } from "react-icons/gi";
import ailogo from "../assets/ailogo.png";
import { motion, AnimatePresence } from "framer-motion";

const AiPage = () => {
    // Background particle generation
    const particles = Array.from({ length: 15 });

    return (
        <div className="min-h-screen bg-[#050505] text-white font-montserrat overflow-x-hidden relative">
            
            {/* --- FUTURISTIC BACKGROUND LAYER --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b89bff]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[100px] rounded-full" />
                
                {/* Floating Particles */}
                {particles.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: Math.random() * 1000 }}
                        animate={{ 
                            opacity: [0.2, 0.5, 0.2], 
                            y: [0, -1000],
                            x: Math.random() * 100 - 50 
                        }}
                        transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: "linear" }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-2xl font-bold tracking-tighter"
                    >
                        <span className="bg-gradient-to-r from-[#b89bff] via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            BlushAI
                        </span>
                        <motion.img
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            src={ailogo}
                            className="w-10 h-8 object-contain"
                        />
                    </motion.h1>

                    <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
                        <a href="/" className="hover:text-[#b89bff] transition">Home</a>
                        <a href="/shop" className="hover:text-[#b89bff] transition">Boutique</a>
                        <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition">
                            Beta Access
                        </button>
                    </nav>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
                
                {/* Hero Title */}
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#b89bff] text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block"
                    >
                        The Future of Floristry
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-chopard mb-6 leading-tight"
                    >
                        Where Botany Meets <br />
                        <span className="italic text-white/90">Intelligence</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* LEFT: AI Interaction Modules */}
                    <div className="lg:col-span-4 space-y-6">
                        {[
                            { title: "Design My Bouquet", desc: "AI-driven emotional arrangement", icon: <FiWind />, color: "from-pink-500/20" },
                            { title: "Care Advisor", desc: "Real-time plant health diagnostics", icon: <FiCpu />, color: "from-cyan-500/20" },
                            { title: "Visual Search", desc: "Identify species via neural lens", icon: <FiCamera />, color: "from-yellow-500/20" },
                        ].map((box, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className={`p-6 rounded-[2rem] border border-white/10 bg-gradient-to-br ${box.color} to-transparent backdrop-blur-md cursor-pointer group`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="p-3 rounded-2xl bg-white/5 text-xl mb-4 group-hover:text-[#b89bff] transition">
                                        {box.icon}
                                    </div>
                                    <FiArrowRight className="opacity-0 group-hover:opacity-100 transition translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                                <h3 className="text-lg font-semibold mb-1 uppercase tracking-wider">{box.title}</h3>
                                <p className="text-sm text-white/40 font-light">{box.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CENTER: The "Core" (Animated Galaxy) */}
                    <div className="lg:col-span-4 flex justify-center py-12 relative">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                            {/* Orbital Rings */}
                            <div className="absolute inset-0 border border-[#b89bff]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 border border-indigo-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            
                            {/* The Core */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="w-32 h-32 bg-[#b89bff] rounded-full blur-[60px] opacity-50" 
                                />
                                <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-white to-[#b89bff] rounded-full shadow-[0_0_50px_rgba(184,155,255,0.6)] flex items-center justify-center">
                                    <GiAbstract050 className="text-black text-4xl animate-pulse" />
                                </div>
                            </div>

                            {/* Orbiting Elements */}
                            <div className="flower-orbit absolute inset-0">
                                {/* Flowers injected via CSS/JS */}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Daily Creation Showcase */}
                    <div className="lg:col-span-4">
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 rounded-[2.5rem] border border-[#b89bff]/30 bg-[#b89bff]/5 backdrop-blur-2xl text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[10px] px-3 py-1 bg-[#b89bff] text-black font-bold rounded-full">LIVE</span>
                            </div>
                            
                            <h4 className="text-[#b89bff] text-xs font-bold uppercase tracking-[0.3em] mb-6">Daily AI Synthesis</h4>
                            
                            <div className="relative mb-8 flex justify-center">
                                <div className="absolute inset-0 bg-[#b89bff]/20 blur-3xl rounded-full scale-75 group-hover:scale-110 transition duration-700" />
                                <img
                                    src="https://cdn-icons-png.flaticon.com/128/346/346218.png"
                                    alt="AI Orchid"
                                    className="w-40 h-40 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                />
                            </div>

                            <p className="text-sm leading-relaxed text-white/70 mb-8 px-4">
                                "Today's neural synthesis: The <span className="text-white font-bold italic">Cyber-Orchid</span>. A manifestation of digital serenity and winter morning light."
                            </p>

                            <button className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-[#b89bff] hover:text-white transition-all shadow-xl">
                                Claim Digital Seed
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* --- NEW SECTION: AI CAPABILITIES GRID --- */}
                <div className="mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <h3 className="text-2xl font-chopard">System Capabilities</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Emotion Mapping", value: "98.2%", sub: "Accuracy in mood-based selection" },
                            { label: "Floral Database", value: "12k+", sub: "Species analyzed worldwide" },
                            { label: "Synthesis Speed", value: "< 2s", sub: "Bespoke design generation time" },
                        ].map((stat, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition">
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-[10px] text-[#b89bff]">{stat.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="w-full py-12 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">© 2024 Blush AI Laboratories</p>
                    <div className="flex gap-10">
                        {['Architecture', 'Privacy', 'Neural Tech', 'Ethical Sourcing'].map(item => (
                            <button key={item} className="text-[10px] text-white/50 hover:text-white transition uppercase tracking-widest">{item}</button>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Custom Orbit Animation Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes orbit {
                    0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
                }
                .animate-orbit {
                    animation: orbit 15s linear infinite;
                }
                .font-chopard { font-family: 'Chopard', serif; }
            `}} />
        </div>
    );
};

export default AiPage;