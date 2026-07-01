import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_BASE_URL } from '../../config';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user || {}));
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4A0000] flex flex-col md:flex-row">
      {/* Brand Side Panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#2D0000] p-12 flex-col justify-between relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,160,92,0.08),transparent_50%)]" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#C9A05C]/5 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo.jpg" alt="Cater Raja" className="h-12 w-12 object-contain rounded-full border border-[#C9A05C]/30 bg-richBlack" />
          <span className="text-2xl font-playfair font-bold text-tan">Cater Raja</span>
        </div>

        <div className="space-y-6 relative z-10 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
            Crafting Culinary Experiences, Seamlessly.
          </h2>
          <p className="text-gray-400 font-inter leading-relaxed">
            Manage menus, customize client packages, track customer inquiries, and coordinate caterings — all from the central command hub.
          </p>
        </div>

        <div className="text-xs text-gray-500 font-inter relative z-10">
          © {new Date().getFullYear()} Cater Raja Portal. All rights reserved.
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,160,92,0.05),transparent_40%)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-md w-full bg-[#2D0000] rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <div className="bg-tan/10 p-4 rounded-2xl flex items-center justify-center shadow-lg border border-tan/10">
              <ChefHat className="text-tan w-10 h-10" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-white">Portal Sign In</h1>
            <p className="text-gray-400 text-sm">Please log in to manage your catering business.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-tan transition-colors w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-[#4A0000]/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-tan/30 focus:border-tan focus:outline-none transition-all placeholder:text-gray-600 text-sm"
                  placeholder="admin@caterraja.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-tan transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-[#4A0000]/60 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-tan/30 focus:border-tan focus:outline-none transition-all placeholder:text-gray-600 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tan text-richBlack font-bold py-4 rounded-xl hover:bg-tan/90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-tan/10 mt-2 font-inter"
            >
              {loading ? 'Verifying access...' : 'Secure Login'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
