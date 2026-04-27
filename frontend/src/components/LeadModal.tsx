import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, ArrowRight } from 'lucide-react';

interface LeadModalProps {
  onClose: () => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean data
    const cleanName = name.trim();
    const cleanMobile = mobile.trim();

    // Validation
    if (!cleanName || !cleanMobile) {
      setError('Please fill in both fields to continue');
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(cleanName)) {
      setError('Name should only contain letters and spaces');
      return;
    }

    if (!/^\d+$/.test(cleanMobile)) {
      setError('Mobile number should only contain digits');
      return;
    }
    
    try {
      // Save to Backend
      await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          mobile: cleanMobile,
          source: 'initial_popup'
        })
      });

      // Save to localStorage for frontend state
      localStorage.setItem('leadName', cleanName);
      localStorage.setItem('leadMobile', cleanMobile);
      localStorage.setItem('leadCaptured', 'true');
      
      onClose();
    } catch (err) {
      console.error('Error saving lead:', err);
      // Still proceed to website if backend fails, but log it
      localStorage.setItem('leadName', cleanName);
      localStorage.setItem('leadMobile', cleanMobile);
      localStorage.setItem('leadCaptured', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('leadCaptured', 'skipped');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-md p-8 relative overflow-hidden"
          style={{ background: 'rgba(15, 15, 15, 0.8)', border: '1px solid rgba(212, 163, 115, 0.2)' }}
        >
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-tan/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tan/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair font-bold text-white mb-2">Welcome to Cater King</h2>
              <p className="text-gray-400">Experience premium catering tailored just for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User size={16} className="text-[#D4A373]" /> Full Name
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your name"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-colors ${
                    error && !name ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-[#D4A373]/50'
                  }`}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Phone size={16} className="text-[#D4A373]" /> Mobile Number
                </label>
                <input 
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="054 -- --- ----"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-colors ${
                    error && !mobile ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-[#D4A373]/50'
                  }`}
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm font-medium text-center"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full bg-[#D4A373] text-[#0A0A0A] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#C39262] transition-colors group shadow-lg shadow-tan/10"
              >
                Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <button 
              onClick={handleSkip}
              className="w-full mt-6 text-gray-500 hover:text-white text-sm font-medium transition-colors underline-offset-4 hover:underline"
            >
              Skip to enter website
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LeadModal;
