import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Package as PackageIcon, 
  LogOut,
  Calendar,
  Layers,
  Users,
  Menu,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stats, setStats] = useState<{ pendingOrders: number }>({ pendingOrders: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
            return;
          }
          throw new Error('Unable to load admin data');
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          const pending = data.filter((o: any) => o.status === 'pending').length;
          setStats({ pendingOrders: pending });
        }
      })
      .catch(() => {});
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isActive = (to: string) => {
    return to === '/admin' 
      ? location.pathname === '/admin' 
      : location.pathname.startsWith(to);
  };

  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} className="sidebar-icon" />, label: 'Dashboard' },
    { to: '/admin/menu', icon: <Utensils size={20} className="sidebar-icon" />, label: 'Menu Items' },
    { to: '/admin/orders', icon: <ShoppingBag size={20} className="sidebar-icon" />, label: 'Orders', badge: stats.pendingOrders },
    { to: '/admin/packages', icon: <PackageIcon size={20} className="sidebar-icon" />, label: 'Packages' },
    { to: '/admin/dates', icon: <Calendar size={20} className="sidebar-icon" />, label: 'Delivery Dates' },
    { to: '/admin/occasion-menus', icon: <Layers size={20} className="sidebar-icon" />, label: 'Occasion Menus' },
    { to: '/admin/meal-box-menus', icon: <Layers size={20} className="sidebar-icon" />, label: 'Meal Box Menus' },
    { to: '/admin/customers', icon: <Users size={20} className="sidebar-icon" />, label: 'Customers' },
  ];

  return (
    <div className="flex min-h-screen bg-[#4A0000] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#2D0000] border-r border-white/10 flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <img src="/logo.jpg" alt="Cater Raja Logo" className="h-10 w-10 object-contain rounded-full bg-richBlack border border-white/20" />
          <span className="text-xl font-playfair font-bold text-tan">Cater Raja</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all text-gray-300 hover:text-white group relative ${
                isActive(link.to) ? 'sidebar-link-active text-white' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-gray-400 group-hover:text-tan transition-colors ${isActive(link.to) ? 'text-tan' : ''}`}>{link.icon}</span>
                <span className="font-medium text-sm">{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-tan text-[10px] font-bold text-richBlack pulse-ring">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-400 hover:bg-white/5 transition-colors border-t border-white/10"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </aside>

      {/* Mobile Header / Top bar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 bg-[#2D0000] border-b border-white/10 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Cater Raja Logo" className="h-8 w-8 object-contain rounded-full bg-richBlack" />
            <span className="text-lg font-playfair font-bold text-tan">Cater Raja</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="text-tan p-2 rounded-lg hover:bg-white/5"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />

              {/* Sidebar Panel */}
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 left-0 w-64 bg-[#2D0000] z-55 border-r border-white/10 flex flex-col lg:hidden shadow-2xl"
              >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/logo.jpg" alt="Cater Raja Logo" className="h-8 w-8 object-contain rounded-full" />
                    <span className="text-lg font-playfair font-bold text-tan">Cater Raja</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="text-tan p-1.5 rounded-lg hover:bg-white/5"
                    aria-label="Close sidebar"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                  {links.map((link) => (
                    <Link 
                      key={link.to}
                      to={link.to} 
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all text-gray-300 hover:text-white group ${
                        isActive(link.to) ? 'sidebar-link-active text-white' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-gray-400 group-hover:text-tan transition-colors ${isActive(link.to) ? 'text-tan' : ''}`}>{link.icon}</span>
                        <span className="font-semibold text-sm">{link.label}</span>
                      </div>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tan text-[10px] font-bold text-richBlack">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>

                <button 
                  onClick={handleLogout}
                  className="p-4 flex items-center gap-3 text-red-400 hover:bg-white/5 transition-colors border-t border-white/10"
                >
                  <LogOut size={20} />
                  <span className="font-semibold text-sm">Logout</span>
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
