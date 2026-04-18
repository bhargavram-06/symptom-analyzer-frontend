import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
     Users,  Mail, 
    ArrowLeft, GraduationCap, 
    Globe, ShieldCheck, Microscope, Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'} font-sans pb-20 relative selection:bg-blue-500/30`}>
            
            {/* --- FLOATING BACKGROUND BLUR --- */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            {/* --- DYNAMIC HEADER --- */}
            <nav className={`p-5 sticky top-0 z-[100] backdrop-blur-xl border-b ${darkMode ? 'bg-[#020617]/80 border-white/5' : 'bg-white/80 border-slate-200'} flex items-center justify-between`}>
                <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/home')} 
                    className={`p-3 rounded-2xl flex items-center gap-2 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'}`}
                >
                    <ArrowLeft size={18}/>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Back</span>
                </motion.button>
                <div className="flex flex-col items-center text-center">
                    <span className="text-[8px] font-black uppercase tracking-[0.6em] text-blue-500 mb-0.5">Project Intelligence</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">About Vital Portal</span>
                </div>
                <div className="w-12 h-12 flex items-center justify-center">
                    <Fingerprint size={24} className="text-blue-600 animate-pulse" />
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 relative z-10 pt-10">
                
                {/* --- 1. HERO STORY --- */}
                <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="text-center mb-24">
                    <h2 className="text-[11vw] md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
                        The Soul of <br />
                        <span className="text-blue-600">Innovation.</span>
                    </h2>
                    <p className={`text-base md:text-xl font-bold leading-relaxed max-w-2xl mx-auto italic ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        "Vital Portal isn't just a website; it's a commitment to bringing clinical-grade health analysis into the hands of every individual."
                    </p>
                </motion.section>

                {/* --- 2. THE COLLEGE MISSION (VIIT) --- */}
                <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="mb-24">
                    <div className={`p-8 md:p-14 rounded-[3rem] border relative overflow-hidden ${darkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200 shadow-2xl shadow-blue-500/5'}`}>
                        <div className="flex flex-col items-center text-center md:text-left md:items-start gap-6">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                                <GraduationCap size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                                    Vignan's Institute of <br /> Information Technology
                                </h3>
                                <p className={`text-sm md:text-base font-medium leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Conceptualized and brought to life at <strong>VIIT, Vizag</strong>, this project represents the pinnacle of student research and technical execution. We aimed to solve the problem of hospital congestion by providing an intelligent preliminary screening tool.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">VIIT Research</span>
                                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">Vizag, AP</span>
                                </div>
                            </div>
                        </div>
                        <Globe size={300} className="absolute -right-20 -bottom-20 text-blue-600/5" />
                    </div>
                </motion.section>

                {/* --- 3. EXTENDED CORE VALUES --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
                    <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <Users className="text-emerald-500" size={28} />
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Human First</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">
                            Our primary goal is to simplify medical terminology. We believe everyone deserves to understand their body without needing a medical degree.
                        </p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className={`p-10 rounded-[3rem] border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <Microscope className="text-purple-500" size={28} />
                            <h4 className="text-xl font-black uppercase italic tracking-tighter">AI Precision</h4>
                        </div>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">
                            Leveraging modern machine learning algorithms to identify patterns in symptoms and provide contextually relevant health data instantly.
                        </p>
                    </motion.div>
                </div>

                {/* --- 4. THE ARCHITECT SECTION --- */}
                <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }} className="text-center mb-24 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <h2 className="text-[20vw] font-black uppercase italic tracking-tighter leading-none">VITAL</h2>
                    </div>
                    
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Lead Developer & Architect</p>
                    <h3 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-10">
                        Bhargav <br /> <span className="text-blue-600">Ram</span>
                    </h3>
                    
                    <div className="space-y-8">
                        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Fuelled by a passion for health-tech and full-stack development, Bhargav Ram designed Vital Portal to be a seamless blend of intelligence and accessibility.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <motion.a 
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                href="mailto:bhargavram4611@gmail.com" 
                                className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20"
                            >
                                <Mail size={18} /> Send Suggestion
                            </motion.a>
                            <p className="text-[10px] font-black text-slate-600 lowercase tracking-widest">bhargavram4611@gmail.com</p>
                        </div>
                    </div>
                </motion.section>

                {/* --- 5. HIGH-END DISCLAIMER --- */}
                <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
                    <div className={`p-8 md:p-12 rounded-[3rem] border flex flex-col items-center gap-6 ${darkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                        <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                            <ShieldCheck size={30} />
                        </div>
                        <div className="text-center">
                            <h5 className="text-rose-500 font-black text-[11px] uppercase tracking-[0.3em] mb-3">Critical Disclaimer</h5>
                            <p className={`text-[10px] md:text-[11px] font-bold uppercase leading-relaxed max-w-2xl ${darkMode ? 'text-rose-300/60' : 'text-rose-800'}`}>
                                This is an Educational Health Project. The analysis provided is based on patterns and is NOT a clinical diagnosis. In case of serious symptoms or physical distress, bypass this application and proceed to the nearest emergency room immediately.
                            </p>
                        </div>
                    </div>
                </motion.section>

                <div className="text-center mt-20 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Vital Portal • VIIT vizag</p>
                </div>
            </div>
        </div>
    );
};

export default About;