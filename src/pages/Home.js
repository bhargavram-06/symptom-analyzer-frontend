import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Updated to latest framer-motion naming
import { 
    Search, Activity, User as Loader2, X, LayoutDashboard, 
    Info, LogOut, AlertTriangle, ChevronRight, Sun, Moon, 
    FileText, Bell, Menu, Check, Salad, Pill, Download, MessageSquare
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import Chatbot from '../components/Chatbot';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- States ---
    const [symptomInput, setSymptomInput] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState({ name: "User", weight: 65, height: 170, profilePic: "" });

    // --- Effects ---
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUserData(JSON.parse(savedUser));

        if (location.state?.selectedSymptoms) {
            setSymptomInput(location.state.selectedSymptoms);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const allSymptoms = [
        "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", "shivering", "chills", "joint_pain", 
        "stomach_pain", "acidity", "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition", 
        "spotting_urination", "fatigue", "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings", 
        "weight_loss", "restlessness", "lethargy", "patches_in_throat", "irregular_sugar_level", "cough", 
        "high_fever", "sunken_eyes", "breathlessness", "sweating", "dehydration", "indigestion", "headache", 
        "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite", "pain_behind_the_eyes", "back_pain", 
        "constipation", "abdominal_pain", "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes", 
        "acute_liver_failure", "fluid_overload", "swelling_of_stomach", "swelled_lymph_nodes", "malaise", 
        "blurred_and_distorted_vision", "phlegm", "throat_irritation", "redness_of_eyes", "sinus_pressure", 
        "runny_nose", "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate", "pain_during_bowel_movements", 
        "pain_in_anal_region", "bloody_stool", "irritation_in_anus", "neck_pain", "dizziness", "cramps", "bruising", 
        "obesity", "swollen_legs", "swollen_blood_vessels", "puffy_face_and_eyes", "enlarged_thyroid", "brittle_nails", 
        "swollen_extremeties", "excessive_hunger", "extra_marital_contacts", "drying_and_tingling_lips", "slurred_speech", 
        "knee_pain", "hip_joint_pain", "muscle_weakness", "stiff_neck", "swelling_joints", "movement_stiffness", 
        "spinning_movements", "loss_of_balance", "unsteadiness", "weakness_of_one_body_side", "loss_of_smell", 
        "bladder_discomfort", "foul_smell_of_urine", "continuous_feel_of_urine", "passage_of_gases", "internal_itching", 
        "toxic_look_(typhos)", "depression", "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body", 
        "belly_pain", "abnormal_menstruation", "dischromic_patches", "watering_from_eyes", "increased_appetite", 
        "polyuria", "family_history", "mucoid_sputum", "rusty_sputum", "lack_of_concentration", "visual_disturbances", 
        "receiving_blood_transfusion", "receiving_unsterile_injections", "coma", "stomach_bleeding", "distention_of_abdomen", 
        "history_of_alcohol_consumption", "blood_in_sputum", "prominent_veins_on_calf", "palpitations", "painful_walking", 
        "pus_filled_pimples", "blackheads", "scurring", "skin_peeling", "silver_like_dusting", "small_dents_in_nails", 
        "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze"
    ];

    const bmiValue = (userData.weight / ((userData.height / 100) ** 2)).toFixed(1);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!symptomInput) return toast.error("Select symptoms first");
        setLoading(true);
        try {
            const processed = symptomInput.split(',').map(s => s.toLowerCase().trim().replace(/ /g, "_")).filter(s => s !== "");
            const { data } = await axios.post('https://symptom-analyzer-backend1.onrender.com/api/symptom/analyze', { symptoms: processed });

            const newHistoryItem = { 
                id: Date.now(), 
                date: new Date().toLocaleDateString(), 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                symptoms: symptomInput, 
                confidence: data.confidence,
                ...data 
            };
            const existingHistory = JSON.parse(localStorage.getItem('medicalHistory')) || [];
            localStorage.setItem('medicalHistory', JSON.stringify([newHistoryItem, ...existingHistory]));
            setResult(data);
        } catch (err) { 
            toast.error("ML Service Offline"); 
        } finally { 
            setLoading(false); 
        }
    };

    const toggleSymptom = (s) => {
        const current = symptomInput.split(',').map(x => x.trim()).filter(x => x !== "");
        if(current.includes(s)) setSymptomInput(current.filter(x => x !== s).join(', '));
        else setSymptomInput([...current, s].join(', '));
    };

    const exportPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(37, 99, 235);
        doc.text("VITAL PORTAL", pageWidth / 2, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("AI-Powered Medical Analysis Report", pageWidth / 2, 28, { align: "center" });
        
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.5);
        doc.line(20, 32, pageWidth - 20, 32);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
        doc.text(`Patient: ${userData.name}`, 20, 52);
        
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(pageWidth - 85, 40, 65, 15, 3, 3, 'F');
        doc.text(`AI Confidence: ${result.confidence}%`, pageWidth - 80, 50);

        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235);
        doc.text("DIAGNOSIS:", 20, 70);
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(result.disease.toUpperCase(), 20, 80);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Medical Description:", 20, 95);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(result.description, pageWidth - 40);
        doc.text(descLines, 20, 102);

        const nextY = 102 + (descLines.length * 7);

        doc.setFont("helvetica", "bold");
        doc.text("Nutrition Plan:", 20, nextY + 10);
        doc.setFont("helvetica", "normal");
        doc.text(result.diet, 20, nextY + 17);

        doc.setFont("helvetica", "bold");
        doc.text("Medication:", pageWidth / 2, nextY + 10);
        doc.setFont("helvetica", "normal");
        doc.text(result.medicine, pageWidth / 2, nextY + 17);

        doc.setFont("helvetica", "bold");
        doc.text("Safety Precautions:", 20, nextY + 35);
        doc.setFont("helvetica", "normal");
        result.precautions?.forEach((p, i) => {
            doc.text(`• ${p}`, 25, nextY + 45 + (i * 7));
        });

        const footerY = 280;
        doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Disclaimer: AI-generated summary. Consult a doctor for professional advice.", pageWidth / 2, footerY, { align: "center" });

        doc.save(`${result.disease}_Medical_Report.pdf`);
        toast.success("Professional Report Downloaded");
    };

    const syncChatWithResults = () => {
        if (!result) return;
        const contextMessage = `USER REPORT: I have ${symptomInput}. Prediction: ${result.disease} (${result.confidence}%). Help me verify this.`;

        if (window.chatbase) {
            window.chatbase("open");
            setTimeout(() => {
                window.chatbase("send", { message: contextMessage });
                toast.success("Analyzing context...");
            }, 500); 
        } else {
            navigator.clipboard.writeText(contextMessage);
            toast.info("Context copied! Paste it in the chat.");
        }
    };

    const getConfidenceStatus = () => {
        if (!result || result.confidence === undefined) return null;
        if (result.confidence < 45) return { label: `Low Confidence (${result.confidence}%) - AI is uncertain`, color: "rose" };
        if (result.confidence < 75) return { label: `Moderate Confidence (${result.confidence}%) - Add more details`, color: "amber" };
        return { label: `High Confidence (${result.confidence}%) - Verified Pattern`, color: "emerald" };
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'} pb-20 font-sans relative overflow-x-hidden`}>
            {/* INJECT CHATBOT HERE - ONLY ON HOME */}
            <Chatbot />

            {/* --- HEADER --- */}
            <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className={`flex justify-between items-center px-4 md:px-10 py-4 sticky top-0 z-[60] border-b ${darkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'} shadow-md`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-0.5 shadow-md border border-slate-100 overflow-hidden">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain scale-150" />
                    </div>
                    <h1 className="text-lg font-black italic tracking-tighter uppercase hidden sm:block">Vital<span className="text-blue-600">Portal</span></h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden lg:flex items-center gap-3">
                        <button onClick={() => navigate('/home')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md"><LayoutDashboard size={14}/> Home</button>
                        <button onClick={() => navigate('/profile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><FileText size={14}/> My Reports</button>
                        <button onClick={() => navigate('/notifications')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Bell size={14}/> Notifications</button>
                        <button onClick={() => navigate('/about')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Info size={14}/> About</button>
                    </div>

                    <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border transition-all active:scale-90 ${darkMode ? 'bg-white/5 border-white/10 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
                    </button>

                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-blue-600 text-white active:scale-90 transition-all"><Menu size={20}/></button>

                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest border transition-all ${darkMode ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'}`}>
                        <LogOut size={14}/> Logout
                    </button>
                </div>
            </motion.nav>

            {/* --- SIDEBAR MENU --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed right-0 top-0 h-full w-72 z-[80] shadow-2xl p-6 flex flex-col ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-black uppercase text-blue-600 tracking-widest">Navigation</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-rose-500"><X size={20}/></button>
                            </div>
                            <div className="flex flex-col gap-5">
                                <button onClick={() => { navigate('/home'); setIsSidebarOpen(false); }} className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"><LayoutDashboard size={18}/> Home</button>
                                <button onClick={() => { navigate('/profile'); setIsSidebarOpen(false); }} className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"><FileText size={18}/> My Reports</button>
                                <button onClick={() => { navigate('/notifications'); setIsSidebarOpen(false); }} className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"><Bell size={18}/> Notifications</button>
                                <button onClick={() => { navigate('/about'); setIsSidebarOpen(false); }} className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"><Info size={18}/> About Us</button>
                                <div className="mt-10 pt-10 border-t border-slate-200 dark:border-white/5">
                                    <button onClick={() => { localStorage.clear(); navigate('/'); }} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-rose-500/10 text-rose-500 font-bold uppercase text-xs tracking-widest border border-rose-500/20"><LogOut size={18}/> Logout</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-4 mt-8">
                {/* --- BMI CARD --- */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2rem] p-5 md:p-8 mb-10 shadow-xl border border-white/10 relative overflow-hidden text-white max-w-4xl mx-auto">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-blue-200 text-[9px] font-black uppercase tracking-widest mb-1">Health Metric</p>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-3">BMI {bmiValue}</h2>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-inner inline-block ${
                                bmiValue < 18.5 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                bmiValue < 25 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}>
                                {bmiValue < 18.5 ? 'Underweight' : bmiValue < 25 ? 'Healthy Weight' : 'Overweight'}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-[9px] font-black text-blue-200 uppercase mb-1 tracking-widest">Weight</p>
                            <p className="text-3xl font-black italic text-white">{userData.weight}KG</p>
                        </div>
                    </div>
                    <Activity className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
                </motion.div>

                {/* --- HERO --- */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center mb-10 px-4">
                    <h2 className={`text-5xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>SYMPTOM <span className="text-blue-600">ANALYZER</span></h2>
                    <motion.p 
                        animate={{ color: ["#3b82f6", "#2dd4bf", "#f59e0b", "#ef4444", "#3b82f6"], opacity: [1, 0.8, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="font-black tracking-[0.4em] text-[10px] md:text-xs uppercase"
                    >
                        Skip the queue, start your care 🚀
                    </motion.p>
                </motion.div>

                {/* --- SEARCH BAR --- */}
                <motion.form variants={fadeInUp} initial="hidden" animate="visible" onSubmit={handleSearch} className="max-w-4xl mx-auto mb-16 relative px-2">
                    <div className="relative group">
                        <Search className="absolute left-6 text-slate-500" size={22} />
                        <input type="text" value={symptomInput} onChange={(e) => setSymptomInput(e.target.value)}
                            placeholder="Identify symptoms..."
                            className={`w-full border-2 rounded-[2rem] pl-14 pr-36 py-6 text-lg transition-all shadow-xl outline-none ${darkMode ? 'bg-[#0f172a] border-white/5 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'}`}
                        />
                        <button type="submit" disabled={loading} className="absolute right-2.5 top-2.5 bottom-2.5 bg-blue-600 text-white px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg">
                            {loading ? <Loader2 className="animate-spin" size={18}/> : "Analyze"}
                        </button>
                    </div>
                </motion.form>

                {/* --- SYMPTOM GRID --- */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-20 px-2">
                    {allSymptoms.map((s, i) => (
                        <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => toggleSymptom(s)}
                            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 shadow-md ${
                                symptomInput.includes(s) 
                                ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' 
                                : darkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${symptomInput.includes(s) ? 'bg-white/20' : darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                {symptomInput.includes(s) ? <Check size={16} className="text-white font-bold"/> : <Activity size={16} className="text-blue-600 opacity-60"/>}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tight text-center leading-tight truncate w-full">{s.replace(/_/g, ' ')}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- REPORT MODAL --- */}
            <AnimatePresence>
                {result && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResult(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className={`relative w-full max-w-4xl rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col border border-white/10 max-h-[92vh] ${darkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
                            <div className="bg-blue-600 p-5 flex justify-between items-center px-10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Medical Report</span>
                                <div className="flex gap-4 items-center">
                                    <Download size={20} className="cursor-pointer text-white hover:scale-110 transition-all" onClick={exportPDF} title="Download PDF" />
                                    <X size={22} className="cursor-pointer text-white" onClick={() => setResult(null)} />
                                </div>
                            </div>
                            <div className="p-8 md:p-12 overflow-y-auto no-scrollbar pb-16 text-center sm:text-left">
                                {getConfidenceStatus() && (
                                    <div className="flex justify-center mb-6">
                                        <div className={`px-5 py-2 rounded-full border flex items-center gap-2 ${
                                            getConfidenceStatus().color === "rose" ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                            getConfidenceStatus().color === "amber" ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                                                getConfidenceStatus().color === "rose" ? 'bg-rose-500' :
                                                getConfidenceStatus().color === "amber" ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{getConfidenceStatus().label}</span>
                                        </div>
                                    </div>
                                )}

                                <h3 className={`text-5xl md:text-7xl font-black mb-8 text-center uppercase italic tracking-tighter ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{result.disease}</h3>
                                
                                <div className="space-y-6">
                                    <div className={`p-6 rounded-[2rem] border text-left ${darkMode ? 'bg-white/5 border-white/5' : 'bg-blue-50 border-blue-100'}`}>
                                        <p className="text-blue-600 font-black text-[10px] uppercase mb-2 tracking-widest flex items-center gap-2"><Info size={16}/> Description</p>
                                        <p className="text-sm italic leading-relaxed">{result.description}</p>
                                    </div>

                                    {/* REFINEMENT / BOT CTA SECTION */}
                                    {result.confidence < 90 && (
                                        <div className={`p-6 rounded-[2rem] border-2 border-dashed flex flex-col gap-4 text-left ${darkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageSquare size={24}/></div>
                                                    <div>
                                                        <p className="font-black text-[10px] uppercase text-blue-600 tracking-tighter">AI Analysis Refinement</p>
                                                        <p className="text-xs italic opacity-70">Improve result by adding related symptoms or consulting our bot.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center sm:justify-end">
                                                <button 
                                                    onClick={syncChatWithResults}
                                                    className="text-[9px] font-black uppercase bg-blue-600 text-white px-4 py-2 rounded-xl animate-bounce hover:bg-blue-700 transition-colors"
                                                    >
                                                    Consult Bot ↓
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <p className="font-black text-[10px] uppercase mb-2 flex items-center gap-2"><Salad size={14}/> Nutrition Plan</p>
                                            <p className="text-xs italic leading-relaxed">{result.diet}</p>
                                        </div>
                                        <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-amber-50 border-amber-100'}`}>
                                            <p className="font-black text-[10px] uppercase mb-2 flex items-center gap-2"><Pill size={14}/> Medication</p>
                                            <p className="text-xs italic leading-relaxed">{result.medicine}</p>
                                        </div>
                                    </div>
                                    <div className={`p-6 rounded-[2rem] border text-left ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                        <p className="text-blue-600 font-black text-[10px] uppercase mb-4 tracking-widest">Precautions</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {result.precautions?.map((p, i) => (
                                                <div key={i} className="flex gap-3 items-center text-xs italic"><ChevronRight size={14} className="text-blue-600" /> {p}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={`p-6 rounded-[2rem] border flex items-center gap-4 ${darkMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                                        <AlertTriangle className="text-rose-500 shrink-0" size={24} />
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-left">Consult a healthcare professional if symptoms persist or worsen.</p>
                                    </div>
                                </div>
                                <button onClick={() => setResult(null)} className={`w-full mt-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all ${darkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>Dismiss Report</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;