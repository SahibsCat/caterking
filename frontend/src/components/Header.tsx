import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-[1000] bg-richBlack backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src="/logo.jpg" alt="Cater Raja" className="h-14 w-14 object-contain rounded-full border border-tan/30 bg-richBlack" />
            <span className="text-xl md:text-2xl font-playfair font-bold text-tan">Cater Raja</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-tan transition-colors">Home</Link>
            <Link to="/about" className="hover:text-tan transition-colors">About Us</Link>
            <Link to="/meal-packs" className="hover:text-tan transition-colors">Meal Packs</Link>
            <Link to="/book" className="bg-[#C9A05C] text-richBlack px-6 py-2 rounded-full font-semibold hover:bg-[#B58E4E] transition-all shadow-[0_0_15px_rgba(201,160,92,0.4)]">
              Book Now
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-tan z-[1100] relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav — rendered outside header to avoid stacking context issues */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[1050] md:hidden flex flex-col"
          style={{ backgroundColor: '#4A0000' }}
        >
          {/* Top bar spacer matching header height */}
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img src="/logo.jpg" alt="Cater Raja" className="h-14 w-14 object-contain rounded-full border border-tan/30 bg-richBlack" />
              <span className="text-xl font-playfair font-bold text-tan">Cater Raja</span>
            </Link>
            <button onClick={closeMenu} className="text-tan" aria-label="Close menu">
              <X size={32} />
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8">
            <Link
              to="/"
              onClick={closeMenu}
              className="text-3xl font-playfair font-semibold text-white hover:text-tan transition-colors w-full text-center py-3 border-b border-white/10"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="text-3xl font-playfair font-semibold text-white hover:text-tan transition-colors w-full text-center py-3 border-b border-white/10"
            >
              About Us
            </Link>
            <Link
              to="/meal-packs"
              onClick={closeMenu}
              className="text-3xl font-playfair font-semibold text-white hover:text-tan transition-colors w-full text-center py-3 border-b border-white/10"
            >
              Meal Packs
            </Link>
            <Link
              to="/book"
              onClick={closeMenu}
              className="mt-4 bg-[#C9A05C] text-richBlack px-12 py-4 rounded-full font-bold text-xl hover:bg-[#B58E4E] transition-all shadow-[0_0_20px_rgba(201,160,92,0.4)]"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
