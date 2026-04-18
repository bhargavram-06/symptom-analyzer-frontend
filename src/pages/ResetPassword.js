import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Hash, ArrowRight, Loader2, Timer, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = (location.state?.email || "").toLowerCase();
    
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(35);

    useEffect(() => {
        if (timeLeft > 0 && !isVerified) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, isVerified]);

    const handleResend = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setTimeLeft(35);
            setOtp('');
            toast.success("New OTP sent!");
        } catch (err) {
            toast.error("Failed to resend");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            if (res.data.success) {
                setIsVerified(true);
                toast.success("OTP Verified!");
            }
        } catch (err) {
            toast.error("Invalid or Expired OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
            toast.success("Password Updated!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <motion.div initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Security Reset</h2>
                    <p className="text-slate-500 text-[10px] font-bold tracking-widest mt-1 uppercase">User: <span className="text-blue-400 lowercase">{email}</span></p>
                </div>

                {!isVerified && (
                    <div className="mb-6 flex items-center justify-between bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <Timer size={16} className={timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-400"} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${timeLeft < 10 ? 'text-red-500' : 'text-slate-400'}`}>{timeLeft}s Left</span>
                        </div>
                        {timeLeft === 0 && (
                            <button onClick={handleResend} className="text-blue-500 hover:text-white text-[10px] font-black uppercase flex items-center gap-1">
                                <RefreshCw size={12} /> Resend
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={isVerified ? handleFinalReset : handleVerifyOTP} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter 6-Digit Code</label>
                        <div className="relative">
                            <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 ${isVerified ? 'text-emerald-500' : 'text-slate-500'}`} size={18} />
                            <input 
                                type="text" required maxLength="6" disabled={isVerified || timeLeft === 0} value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`w-full bg-slate-800/50 border ${isVerified ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-white'} rounded-2xl pl-12 pr-4 py-4 outline-none font-mono text-xl tracking-[0.5em]`}
                                placeholder="000000"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isVerified && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Secure Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:border-blue-500 transition-all" 
                                        placeholder="••••••••" 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        type="submit" 
                        disabled={loading || (timeLeft === 0 && !isVerified)} 
                        className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${isVerified ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 disabled:bg-slate-800 disabled:text-slate-600'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : isVerified ? "COMPLETE RESET" : "VERIFY IDENTITY"}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;