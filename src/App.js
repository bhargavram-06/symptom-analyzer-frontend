import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Entrance from './pages/Entrance';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';

// --- Scroll To Top Utility ---
// This ensures every page starts at the top when you navigate
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      {/* --- Global Notifications --- */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          // Default styling for all toasts
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b',
            borderRadius: '1rem',
            padding: '16px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          // Specific settings for Success
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          // Specific settings for Errors
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #ef444433',
            }
          },
        }}
      />
      
      <Routes>
        {/* --- Landing & Authentication --- */}
        <Route path="/" element={<Entrance />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* --- Protected User Dashboard --- */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
        
        {/* --- 404 Error Page --- */}
        <Route path="*" element={
          <div className="h-screen bg-[#080d1a] flex flex-col items-center justify-center text-white p-6">
            <h1 className="text-9xl font-black text-slate-800 tracking-tighter">404</h1>
            <p className="text-xl font-black uppercase tracking-[0.5em] mb-8 text-blue-500">Route Lost</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="bg-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Back to Safe Zone
            </button>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;