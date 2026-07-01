import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import MealPacks from './pages/MealPacks';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Policies from './pages/Policies';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import MenuManager from './pages/admin/MenuManager';
import OrderManager from './pages/admin/OrderManager';
import PackageManager from './pages/admin/PackageManager';
import DateManager from './pages/admin/DateManager';
import OccasionMenuManager from './pages/admin/OccasionMenuManager';
import MealBoxMenuManager from './pages/admin/MealBoxMenuManager';
import CustomerManager from './pages/admin/CustomerManager';

// Shared Components
import { ToastContainer } from './components/Toast';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


// Protection Guard
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token && window.location.hash.startsWith('#/admin') && !window.location.hash.includes('/login')) {
      const authCheck = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) {
            localStorage.removeItem('adminToken');
            window.location.hash = '#/admin/login';
          }
        } catch {
          // Ignore auth check failures and keep the UI open if the backend is temporarily unavailable.
        }
      };
      authCheck();
    }
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-richBlack text-white font-inter">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><main className="min-h-screen pt-20"><Home /></main><Footer /></>} />
          <Route path="/book" element={<><Header /><main className="min-h-screen pt-20"><BookingFlow /></main><Footer /></>} />
          <Route path="/meal-packs" element={<><Header /><main className="min-h-screen pt-20"><MealPacks /></main><Footer /></>} />
          <Route path="/about" element={<><Header /><main className="min-h-screen pt-20"><About /></main><Footer /></>} />
          <Route path="/policies" element={<><Header /><main className="min-h-screen pt-20"><Policies /></main><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="packages" element={<PackageManager />} />
            <Route path="dates" element={<DateManager />} />
            <Route path="occasion-menus" element={<OccasionMenuManager />} />
            <Route path="meal-box-menus" element={<MealBoxMenuManager />} />
            <Route path="customers" element={<CustomerManager />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;

