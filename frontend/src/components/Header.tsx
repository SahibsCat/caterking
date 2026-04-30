import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-[1000] bg-richBlack/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 relative z-[60]">
          <img src="https://sahibs.ae/cdn/shop/files/DUBAI_UAE_logo-edited.png?v=1723524044&width=114" alt="Cater King" className="h-14 w-14 object-contain rounded-full border border-tan/30 bg-richBlack" />
          <span className="text-xl md:text-2xl font-playfair font-bold text-tan">Cater King</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-tan transition-colors">Home</Link>
          <Link to="/about" className="hover:text-tan transition-colors">About Us</Link>
          <Link to="/meal-packs" className="hover:text-tan transition-colors">Meal Packs</Link>
          <Link to="/book" className="bg-[#B99272] text-richBlack px-6 py-2 rounded-full font-semibold hover:bg-[#A67F5F] transition-all shadow-[0_0_15px_rgba(185,146,114,0.4)]">
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-[60] text-tan"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-richBlack z-50 flex flex-col items-center justify-center gap-8 md:hidden">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl hover:text-tan">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl hover:text-tan">About Us</Link>
            <Link to="/meal-packs" onClick={() => setIsMenuOpen(false)} className="text-2xl hover:text-tan">Meal Packs</Link>
            <Link to="/book" onClick={() => setIsMenuOpen(false)} className="bg-[#B99272] text-richBlack px-10 py-4 rounded-full font-bold text-xl hover:bg-[#A67F5F]">
              Book Now
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
