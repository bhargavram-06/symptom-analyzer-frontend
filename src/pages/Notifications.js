import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Activity, ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const savedDarkMode = document.documentElement.classList.contains('dark');
        setDarkMode(savedDarkMode);
    }, []);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'} font-sans pb-20`}>
            {/* Header */}
            <div className={`p-6 border-b sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'} flex items-center gap-4`}>
                <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest">Health Notifications</h1>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-10">
                {/* --- AUGUST AI PROMO CARD --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-600 to-teal-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden mb-12"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <Activity size={28} className="text-emerald-300" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">August AI</h2>
                                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-[0.2em]">Your 24/7 External Health Companion</p>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-emerald-50 leading-relaxed mb-8 italic">
                            If our built-in analyzer isn't providing enough detail, take your health insights to the next level with August AI.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                { title: "Lab Report Analysis", desc: "Understand your blood tests" },
                                { title: "Prescription Help", desc: "Decipher medical notes" },
                                { title: "Symptom Checker", desc: "Advanced AI insights" },
                                { title: "Image Analysis", desc: "Visual health assessment" },
                                { title: "Personalized Wellness", desc: "Tailored health plans" },
                                { title: "Memory & Context", desc: "Remembers your history" }
                            ].map((f, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start gap-3 hover:bg-white/20 transition-all">
                                    <ChevronRight size={16} className="text-emerald-300 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-wide">{f.title}</p>
                                        <p className="text-[9px] text-emerald-200 font-medium uppercase">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WhatsApp Button */}
                        <motion.a 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            href="https://wa.me/918738030604" target="_blank" rel="noreferrer"
                            className="w-full flex items-center justify-center gap-4 py-5 rounded-[2rem] bg-white text-emerald-900 font-black uppercase text-xs tracking-[0.2em] shadow-xl"
                        >
                            <MessageCircle size={20} /> Chat on WhatsApp: 8738030604
                        </motion.a>
                    </div>
                    
                    {/* Background decoration */}
                    <ShieldCheck size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                </motion.div>

                {/* --- RECENT SYSTEM NOTIFICATIONS --- */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 px-4">Recent Updates</h3>
                    
                    <div className={`p-6 rounded-[2rem] border flex gap-5 items-center ${darkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                            <Bell size={24}/>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wide">Cloud Sync Active</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Your medical history is now secured on any device.</p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-[2rem] border flex gap-5 items-center ${darkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <ShieldCheck size={24}/>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wide">Security Verification</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Password reset system updated with professional encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;