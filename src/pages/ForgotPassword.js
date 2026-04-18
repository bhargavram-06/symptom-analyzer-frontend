import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true); // Start Spinner
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { 
                email: email.toLowerCase() 
            });
            toast.success("OTP sent to your email!");
            navigate('/reset-password', { state: { email: email.toLowerCase() } });
        } catch (err) {
            toast.error(err.response?.data?.message || "User not found");
        } finally {
            setLoading(false); // Stop Spinner
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl"
            >
                <button onClick={() => navigate('/login')} className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
                    <ArrowLeft size={16}/> Back to Login
                </button>
                
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Reset Access</h2>
                <p className="text-slate-500 text-xs mb-8 font-medium">Verification required to update your health portal password.</p>
                
                <form onSubmit={handleSendOTP} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Registered Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" required 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-500 transition-all"
                                placeholder="name@email.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-500"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                SENDING CODE...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                SEND OTP
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;