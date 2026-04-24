import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-richBlack flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-charcoal rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="bg-tan/10 p-4 rounded-full">
            <ChefHat className="text-tan w-12 h-12" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-white">Admin Login</h1>
          <p className="text-gray-400">Access the Cater King dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full bg-richBlack border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-tan focus:outline-none transition-all"
                placeholder="admin@caterking.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                required
                className="w-full bg-richBlack border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-tan focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tan text-richBlack font-bold py-3 rounded-lg hover:bg-tan/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
