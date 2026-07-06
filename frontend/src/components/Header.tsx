import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, ChefHat, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { closeMenu(); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // Meal Packs removed from nav but page still exists
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
  ];

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowOrderTypeModal(true);
  };

  return (
    <>
      {/* Order Type Selection Modal */}
      <AnimatePresence>
        {showOrderTypeModal && (
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowOrderTypeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#2D0000] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-tan/20 bg-tan/10">
                  <Sparkles className="text-tan" size={22} />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white">How would you like to order?</h3>
                <p className="mt-2 text-sm text-gray-400">Choose the type of catering service you need.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setShowOrderTypeModal(false); navigate('/book?start=true'); }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-tan/30 hover:bg-white/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tan/10 text-tan">
                    <ChefHat size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Bulk Order / Event Catering</p>
                    <p className="mt-0.5 text-xs text-gray-400">For events, parties &amp; corporate gatherings. Min 20 guests.</p>
                  </div>
                </button>
                <button
                  onClick={() => { setShowOrderTypeModal(false); navigate('/meal-packs'); }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-tan/30 hover:bg-white/10"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tan/10 text-tan">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Meal Box / Packs</p>
                    <p className="mt-0.5 text-xs text-gray-400">Quick boxes for office lunches, school &amp; daily needs. Min 20 units.</p>
                  </div>
                </button>
              </div>
              <button
                onClick={() => setShowOrderTypeModal(false)}
                className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-richBlack/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]' : 'bg-richBlack/85 backdrop-blur-sm border-b border-white/5'}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-tan/30 bg-richBlack shadow-[0_0_20px_rgba(201,160,92,0.2)]">
              <img src="/logo.jpg" alt="Cater Raja" className="h-9 w-9 object-contain rounded-full" />
            </div>
            <div>
              <p className="font-playfair text-lg font-bold text-tan">Cater Raja</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/55">Luxury catering</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`relative text-sm font-medium transition-all ${isActive(to) ? 'text-tan' : 'text-white/80 hover:text-white'}`}>
                {label}
                {isActive(to) && <motion.span layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-tan" />}
              </Link>
            ))}
            <button
              onClick={handleBookNow}
              className="inline-flex items-center gap-2 rounded-full bg-tan px-5 py-2.5 text-sm font-bold text-richBlack shadow-[0_0_22px_rgba(201,160,92,0.35)] transition-all hover:-translate-y-0.5 hover:bg-tan/90 cursor-pointer"
            >
              <Sparkles size={15} /> Book Now
            </button>
          </nav>

          <button className="rounded-xl p-2 text-tan transition-colors hover:bg-white/5 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={isMenuOpen ? 'close' : 'open'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1040] bg-black/60 backdrop-blur-sm md:hidden" onClick={closeMenu} />
            <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="fixed inset-x-0 top-0 z-[1050] bg-[#4A0000] md:hidden">
              <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
                <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                  <img src="/logo.jpg" alt="Cater Raja" className="h-12 w-12 rounded-full border border-tan/30 bg-richBlack object-contain" />
                  <span className="font-playfair text-xl font-bold text-tan">Cater Raja</span>
                </Link>
                <button onClick={closeMenu} className="rounded-xl p-2 text-tan hover:bg-white/5" aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-2 px-6 py-8">
                {navLinks.map(({ to, label }, i) => (
                  <motion.div key={to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <Link to={to} onClick={closeMenu} className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-2xl font-playfair font-semibold transition-all ${isActive(to) ? 'border border-tan/20 bg-tan/10 text-tan' : 'text-white hover:bg-white/5 hover:text-tan'}`}>
                      {isActive(to) && <span className="h-1.5 w-1.5 rounded-full bg-tan" />}
                      {label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="mt-4">
                  <button
                    onClick={() => { closeMenu(); setShowOrderTypeModal(true); }}
                    className="block w-full rounded-full bg-tan px-10 py-4 text-center text-xl font-bold text-richBlack shadow-[0_0_24px_rgba(201,160,92,0.4)] cursor-pointer"
                  >
                    Book Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
