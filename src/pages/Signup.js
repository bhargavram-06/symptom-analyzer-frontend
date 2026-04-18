import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    // 1. Initial State - Matches your User.js Backend Schema exactly
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        age: '',
        bloodGroup: '', 
        height: '', 
        weight: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 2. Pointing to your live Render Backend
            const res = await axios.post('https://symptom-analyzer-backend1.onrender.com/api/auth/signup', formData);

            toast.success(res.data.message || "Profile Created!");
            
            // Wait a second so user sees the success toast before redirecting
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            // Displays specific error (like "Email already exists") if backend sends it
            const errorMsg = err.response?.data?.message || "Registration failed";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 md:p-10 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[2rem] w-full max-w-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full"></div>

                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black tracking-tighter mb-2 italic">CREATE PROFILE</h2>
                    <p className="text-slate-500 text-xs font-bold tracking-[0.3em] uppercase leading-relaxed">Join the Vital Health Network</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name - Name attribute matches Backend 'name' */}
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Full Name</label>
                        <input 
                            name="name" 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                            placeholder="Enter full name" 
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                            placeholder="name@gmail.com" 
                        />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Secure Password</label>
                        <div className="relative">
                            <input 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                onChange={handleChange} 
                                required 
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
                                placeholder="••••••••" 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Age */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Age</label>
                        <input name="age" type="number" onChange={handleChange} required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="21" />
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Blood Group</label>
                        <select 
                            name="bloodGroup" 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-300"
                        >
                            <option value="">Select</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                    </div>

                    {/* Height */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Height (cm)</label>
                        <input name="height" type="number" onChange={handleChange} required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="175" />
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block ml-1">Weight (kg)</label>
                        <input name="weight" type="number" onChange={handleChange} required className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" placeholder="70" />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="md:col-span-2 bg-white text-slate-950 font-black py-5 rounded-2xl mt-4 hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5 uppercase tracking-widest text-xs">
                        <ShieldCheck size={20}/> Complete Registration
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-all" onClick={() => navigate('/login')}>
                    Already a member? <span className="text-blue-500 underline underline-offset-4">Sign In</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;