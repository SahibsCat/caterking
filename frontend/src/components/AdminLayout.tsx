import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Package as PackageIcon, 
  LogOut,
  Calendar,
  Layers,
  Users
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-richBlack text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal border-r border-white/10 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <img src="https://sahibs.ae/cdn/shop/files/DUBAI_UAE_logo-edited.png?v=1723524044&width=114" alt="Cater King Logo" className="h-10 w-10 object-contain rounded-full bg-richBlack border border-white/20" />
          <span className="text-xl font-playfair font-bold text-tan">Cater King</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink to="/admin/menu" icon={<Utensils size={20} />} label="Menu Items" />
          <SidebarLink to="/admin/orders" icon={<ShoppingBag size={20} />} label="Orders" />
          <SidebarLink to="/admin/packages" icon={<PackageIcon size={20} />} label="Packages" />
          <SidebarLink to="/admin/dates" icon={<Calendar size={20} />} label="Delivery Dates" />
          <SidebarLink to="/admin/occasion-menus" icon={<Layers size={20} />} label="Occasion Menus" />
          <SidebarLink to="/admin/meal-box-menus" icon={<Layers size={20} />} label="Meal Box Menus" />
          <SidebarLink to="/admin/customers" icon={<Users size={20} />} label="Customers" />
        </nav>

        <button 
          onClick={handleLogout}
          className="p-4 flex items-center gap-3 text-red-400 hover:bg-white/5 transition-colors border-t border-white/10"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white group"
  >
    <span className="text-gray-400 group-hover:text-tan transition-colors">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default AdminLayout;
