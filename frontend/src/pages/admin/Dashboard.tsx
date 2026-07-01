import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { ShoppingBag, TrendingUp, Clock, AlertCircle, Calendar, ArrowRight, User } from 'lucide-react';
import { formatAED } from '../../utils/currency';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

interface Order {
  _id: string;
  orderId: string;
  customerDetails: {
    name: string;
  };
  eventDetails: {
    occasion: string;
    date: string;
  };
  pricing: {
    total: number;
  };
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    // Generate greeting based on current time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch Stats
        const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!statsRes.ok) throw new Error('Failed to fetch stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch Recent Orders (reusing the same orders API to show actual recent items)
        const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (Array.isArray(ordersData)) {
            // Sort by creation date or orderId desc and take top 5
            const sorted = [...ordersData]
              .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
              .slice(0, 5);
            setRecentOrders(sorted);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-white/5 rounded-lg w-1/4"></div>
        <div className="h-4 bg-white/5 rounded-lg w-1/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
      </div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-white mb-1.5">
            {greeting}, Admin
          </h1>
          <p className="text-gray-400 text-sm flex items-center gap-1.5 font-medium">
            <Calendar size={14} className="text-tan" /> {todayStr}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-tan flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Portal Connected
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatAED(stats?.revenue || 0)}
          icon={<TrendingUp className="text-green-400" />}
          description="Total paid bookings"
          borderClass="border-l-4 border-l-green-500"
          delay={0}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalOrders.toString() || '0'} 
          icon={<ShoppingBag className="text-blue-400" />}
          description="Lifetime inquiries placed"
          borderClass="border-l-4 border-l-blue-500"
          delay={0.1}
        />
        <StatCard 
          title="Pending Attention" 
          value={stats?.pendingOrders.toString() || '0'} 
          icon={<Clock className="text-orange-400" />}
          description="Awaiting response/confirmation"
          borderClass="border-l-4 border-l-orange-500 font-semibold"
          delay={0.2}
          isWarning={!!stats?.pendingOrders}
        />
      </div>

      {/* Recent Bookings List (Replacing Dead Placeholder) */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-playfair text-white">Recent Activities</h2>
            <p className="text-gray-400 text-xs mt-1">Status of the most recent customer inquiries</p>
          </div>
          <Link 
            to="/admin/orders" 
            className="text-tan hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
          >
            Manage All Orders <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="p-2">
          {recentOrders.length === 0 ? (
            <div className="text-gray-500 text-center py-16 font-inter text-sm italic">
              No recent bookings or activities found.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentOrders.map((order, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={order._id} 
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-tan shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">{order.customerDetails?.name || 'Guest User'}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.eventDetails?.occasion} • {new Date(order.eventDetails?.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{formatAED(order.pricing?.total || 0)}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{order.orderId}</p>
                    </div>

                    <span className={`badge ${
                      order.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      order.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse' :
                      order.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-white/10'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  borderClass?: string;
  delay?: number;
  isWarning?: boolean;
}

const StatCard = ({ title, value, icon, description, borderClass = '', delay = 0, isWarning = false }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={`bg-[#2D0000] border border-white/10 rounded-2xl p-6 hover:border-tan/30 transition-all cursor-default group shadow-md ${borderClass} ${
      isWarning ? 'shadow-[0_0_15px_rgba(249,115,22,0.08)]' : ''
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className="text-3xl font-bold text-white mb-1.5 tracking-tight font-playfair">{value}</p>
    <p className="text-xs text-gray-500">{description}</p>
  </motion.div>
);

export default Dashboard;
