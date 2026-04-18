import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
import { 
    User, Droplet, Trash2, 
    FileText, History, ArrowLeft, Camera, Eye, Plus, X, ChevronRight, Activity 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    
    // 1. Initial State Loading
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem('medicalHistory')) || []);
    const [docs, setDocs] = useState(JSON.parse(localStorage.getItem('medicalDocs')) || []);

    // --- CRITICAL CLOUD SYNC FUNCTION ---
    const syncWithCloud = async (updatedUser, updatedHistory, updatedDocs) => {
        const token = localStorage.getItem('token');
        try {
            const payload = {
                email: updatedUser.email,
                name: updatedUser.name,
                age: updatedUser.age,
                bloodGroup: updatedUser.bloodGroup,
                height: updatedUser.height,
                weight: updatedUser.weight,
                profilePic: updatedUser.profilePic,
                medicalHistory: updatedHistory, // Sending the full array
                medicalDocs: updatedDocs       // Sending the full array
            };

            console.log("☁️ Syncing to Cloud:", payload);

            const res = await axios.post('https://symptom-analyzer-backend1.onrender.com/api/auth/sync-profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                console.log("✅ Cloud Sync Success");
                // Update local 'user' object to keep it consistent
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
        } catch (err) {
            console.error("❌ Cloud Sync Error:", err);
            toast.error("Cloud backup failed");
        }
    };

    const handleFileUpload = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // 10MB limit
        if (file.size > 10 * 1024 * 1024) return toast.error("File too large (Max 10MB)");

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            if (type === 'profile') {
                const updatedUser = { ...userData, profilePic: base64String };
                setUserData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                await syncWithCloud(updatedUser, history, docs);
                toast.success("Profile photo updated!");
            } else {
                const newDoc = {
                    id: Date.now().toString(),
                    name: file.name,
                    date: new Date().toLocaleDateString(),
                    fileData: base64String
                };
                const updatedDocs = [newDoc, ...docs];
                setDocs(updatedDocs);
                localStorage.setItem('medicalDocs', JSON.stringify(updatedDocs));
                // Sync current user, current history, and the NEW docs
                await syncWithCloud(userData, history, updatedDocs);
                toast.success("Document Secured in Vault");
            }
        };
        reader.readAsDataURL(file);
    };

    const deleteDoc = async (id) => {
        const updatedDocs = docs.filter(d => d.id !== id);
        setDocs(updatedDocs);
        localStorage.setItem('medicalDocs', JSON.stringify(updatedDocs));
        await syncWithCloud(userData, history, updatedDocs);
        toast.success("Document deleted");
    };

    const handleSave = async () => {
        localStorage.setItem('user', JSON.stringify(userData));
        await syncWithCloud(userData, history, docs);
        setIsEditing(false);
        toast.success("Profile Synced");
    };

    const clearHistory = async () => {
        if(window.confirm("Clear all analysis history?")) {
            setHistory([]);
            localStorage.removeItem('medicalHistory');
            await syncWithCloud(userData, [], docs);
            toast.success("History cleared");
        }
    };

    const bmi = (userData.weight / ((userData.height / 100) ** 2)).toFixed(1);

    const getConfidenceColor = (score) => {
        if (score >= 75) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
        if (score >= 45) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
        return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans">
            {/* Header */}
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 p-6 sticky top-0 z-50 flex justify-between items-center">
                <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeft size={16}/> Dashboard
                </button>
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 text-center flex-1">Vital Portal Vault</h1>
                <div className="w-20"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: PROFILE DATA */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-8 text-center shadow-2xl relative">
                        <div className="relative w-32 h-32 mx-auto mb-6 group">
                            <div className="w-full h-full bg-slate-800 rounded-full border-4 border-blue-600 overflow-hidden flex items-center justify-center shadow-lg">
                                {userData.profilePic ? <img src={userData.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <User size={50} className="text-slate-600"/>}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-[#0f172a] cursor-pointer hover:scale-110 transition-all">
                                <Camera size={14}/>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} />
                            </label>
                        </div>

                        <div className="space-y-4 text-left">
                            <DetailRow label="Name" value={userData.name} isEditing={isEditing} onChange={(val) => setUserData({...userData, name: val})} />
                            <DetailRow label="Email" value={userData.email} />
                            <DetailRow label="Blood Group" value={userData.bloodGroup} isEditing={isEditing} onChange={(val) => setUserData({...userData, bloodGroup: val})} icon={<Droplet size={14} className="text-red-500"/>} />
                            <DetailRow label="Height (cm)" value={userData.height} isEditing={isEditing} onChange={(val) => setUserData({...userData, height: val})} />
                            <DetailRow label="Weight (kg)" value={userData.weight} isEditing={isEditing} onChange={(val) => setUserData({...userData, weight: val})} />
                        </div>

                        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={`w-full mt-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-emerald-600 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                            {isEditing ? "Confirm Changes" : "Edit Profile"}
                        </button>
                    </motion.div>

                    {/* BMI CARD */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                        <Activity size={40} className="absolute -right-4 -top-4 text-white/10" />
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Health Index</p>
                        <h2 className="text-5xl font-black italic mb-2 tracking-tighter">{bmi} BMI</h2>
                    </div>
                </div>

                {/* RIGHT COLUMN: HISTORY & VAULT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ANALYSIS HISTORY */}
                    <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                <History size={18} className="text-blue-500"/> Recent Analysis
                            </h3>
                            <button onClick={clearHistory} className="text-rose-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-rose-500/10 transition-all">Clear All</button>
                        </div>
                        <div className="space-y-4 max-h-[350px] overflow-y-auto no-scrollbar">
                            {history.length > 0 ? history.map((item) => (
                                <div key={item.id} onClick={() => navigate('/home', { state: { selectedSymptoms: item.symptoms } })} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><Activity size={18}/></div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-white tracking-wide">{item.disease}</p>
                                            <p className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase">{item.date} • {item.time}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-500 transition-all" />
                                </div>
                            )) : (
                                <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-[2rem]">
                                    <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No cloud history found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DIGITAL VAULT */}
                    <div className="bg-[#0f172a] border border-white/5 rounded-[3rem] p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                <FileText size={18} className="text-emerald-500"/> Secure Vault
                            </h3>
                            <label className="bg-emerald-600/10 text-emerald-500 p-2.5 rounded-xl border border-emerald-500/20 cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">
                                <Plus size={20}/>
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'doc')} />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {docs.map(doc => (
                                <div key={doc.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 group relative hover:border-blue-500/30 transition-all">
                                    <button onClick={() => deleteDoc(doc.id)} className="absolute top-5 right-5 text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><FileText size={24}/></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase text-slate-200 truncate pr-6">{doc.name}</p>
                                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">{doc.date}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => window.open(doc.fileData)} className="w-full bg-slate-900/50 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                        <Eye size={14}/> View File
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ label, value, icon, isEditing, onChange }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 pt-1">
        <div className="flex items-center gap-2 text-slate-500">
            {icon || <User size={14}/>}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {isEditing && onChange ? (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="bg-slate-800 text-xs font-bold text-white px-3 py-1.5 rounded-lg outline-none border border-blue-500/30 w-32 text-right focus:border-blue-500 transition-all" />
        ) : (
            <span className="text-xs font-bold text-slate-200">{value}</span>
        )}
    </div>
);

export default Profile;