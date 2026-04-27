import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

import { ShoppingBag, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-white/5 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Business Overview</h1>
        <p className="text-gray-400">Real-time performance metrics for Cater King</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`AED ${stats?.revenue.toLocaleString()}`} 
          icon={<TrendingUp className="text-green-400" />}
          description="Total paid orders"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders.toString() || '0'} 
          icon={<ShoppingBag className="text-blue-400" />}
          description="Life-time orders"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats?.pendingOrders.toString() || '0'} 
          icon={<Clock className="text-orange-400" />}
          description="Requiring attention"
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-charcoal border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
          Order activity reports will appear here soon.
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) => (
  <div className="bg-charcoal border border-white/10 rounded-2xl p-6 hover:border-tan/30 transition-all cursor-default group">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-white/5 p-3 rounded-lg group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
    </div>
    <p className="text-gray-400 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold text-white mb-2">{value}</p>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

export default Dashboard;
