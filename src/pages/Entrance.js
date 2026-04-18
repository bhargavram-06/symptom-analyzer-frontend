import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Activity } from 'lucide-react';

const Entrance = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white overflow-hidden relative px-4 text-center">
            
            {/* Background Glow */}
            <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white">
                    VITAL PORTAL
                </h1>
                
                <p className="text-blue-400 font-bold tracking-[0.3em] text-[10px] md:text-xs mb-10 uppercase">
                    Your Personal AI Health Companion & Symptom Analyzer
                </p>
            </motion.div>

            {/* Feature Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-blue-500 rounded-xl">
                    <Activity size={16} className="text-blue-400"/>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-emerald-500 rounded-xl">
                    <Zap size={16} className="text-emerald-400"/>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Fast OTP</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-red-500 rounded-xl">
                    <Shield size={16} className="text-red-400"/>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Safety</span>
                </div>
            </div>

            {/* Action Buttons */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="bg-white text-slate-900 px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-blue-50 transition-all"
            >
                GET STARTED &gt;
            </motion.button>

            <button 
                onClick={() => navigate('/login')}
                className="mt-8 text-slate-400 hover:text-white transition-colors font-bold tracking-widest text-xs underline underline-offset-4"
            >
                ALREADY A MEMBER? LOGIN
            </button>

            {/* Bottom Footer */}
            <div className="absolute bottom-10 w-full text-center">
                <p className="text-slate-600 font-bold text-[10px] tracking-[0.5em] uppercase">
                    Professional Guidance & Care
                </p>
            </div>
        </div>
    );
};

export default Entrance;