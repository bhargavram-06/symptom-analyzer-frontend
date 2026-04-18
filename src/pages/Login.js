import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import toast from 'react-hot-toast';


const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // Your Live Site Key
    const RECAPTCHA_SITE_KEY = "6Led4KQsAAAAACODFPPTlj-e8U9XKTjkowA_VRcy";

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            return toast.error("Please complete the Security Verification");
        }

        setLoading(true);
        try {
            // Sending email, password, and the reCAPTCHA token to the backend
            const res = await axios.post('https://symptom-analyzer-backend1.onrender.com/api/auth/login', { 
                email, 
                password,
                captchaToken 
            });
            
            // Save Token and User info to LocalStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            toast.success("Welcome back, " + res.data.user.name);
            navigate('/home'); 
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl backdrop-blur-sm"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">Login</h2>
                    <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase">Access Vital Health Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="email" 
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                placeholder="name@email.com"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-12 py-4 text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {/* Forgot Password sits neatly below */}
                        <div className="flex justify-end pr-1">
                            <span 
                                onClick={() => navigate('/forgot-password')}
                                className="text-[11px] font-bold text-blue-500 cursor-pointer hover:text-blue-400 transition-colors uppercase tracking-widest mt-2"
                            >
                                Forgot Password?
                            </span>
                        </div>
                    </div>

                    {/* reCAPTCHA Section */}
                    <div className="flex flex-col items-center py-2">
                        <label className="text-[10px] font-black text-slate-600 mb-3 uppercase tracking-widest">Security Verification</label>
                        <div className="rounded-xl overflow-hidden border border-slate-800 shadow-lg scale-90 md:scale-100">
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_SITE_KEY}
                                onChange={(val) => setCaptchaToken(val)}
                                theme="dark"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                    >
                        {loading ? "AUTHENTICATING..." : "SIGN IN TO PORTAL"}
                        {!loading && <ChevronRight size={20} />}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Don't have an account? 
                        <span 
                            onClick={() => navigate('/signup')}
                            className="ml-2 text-white cursor-pointer hover:text-blue-400 transition-colors underline underline-offset-4"
                        >
                            Create Profile
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;