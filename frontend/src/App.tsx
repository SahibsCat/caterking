import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import MealPacks from './pages/MealPacks';
import Header from './components/Header';
import Footer from './components/Footer';

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

// Protection Guard
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-richBlack text-white font-inter">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><main><Home /></main><Footer /></>} />
          <Route path="/book" element={<><Header /><main><BookingFlow /></main><Footer /></>} />
          <Route path="/meal-packs" element={<><Header /><main><MealPacks /></main><Footer /></>} />

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
      </div>
    </Router>
  );
}

export default App;

