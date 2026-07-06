import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, Sparkles, ShieldCheck, CalendarDays, ChefHat, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadModal from '../components/LeadModal';
import { AnimatePresence } from 'framer-motion';
import heroImage from '../assets/hero-new.jpg';
import heroMobileImage from '../assets/hero-mobile.png';
import cateringTeam from '../assets/caterraja.jpeg';
import food1 from '../assets/food1.jpeg';
import food2 from '../assets/food2.jpeg';
import food3 from '../assets/food3.jpeg';
import { useEffect } from 'react';

const Home = () => {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isCaptured = localStorage.getItem('leadCaptured');
    if (!isCaptured) {
      const timer = setTimeout(() => setShowLeadModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const highlights = [
    { icon: Sparkles, title: 'Curated menus', text: 'Elegant packages tailored for birthdays, weddings, and corporate gatherings.' },
    { icon: ShieldCheck, title: 'Reliable delivery', text: 'Professional service, punctual arrival, and premium finishing touches.' },
    { icon: CalendarDays, title: 'Flexible planning', text: 'Book around your calendar with clear pricing and simple confirmations.' },
  ];

  return (
    <div className="pt-0">
      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} />}

      {/* Order Type Modal */}
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
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-tan/30 hover:bg-white/10 cursor-pointer"
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
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-tan/30 hover:bg-white/10 cursor-pointer"
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

      <section className="relative flex min-h-[85vh] sm:min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.35))]" />
          <img src={heroImage} alt="Luxury Catering" className="hidden h-full w-full object-cover md:block" />
          <img src={heroMobileImage} alt="Luxury Catering" className="block h-full w-full object-cover md:hidden" />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-center px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 md:pt-0 md:pb-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-tan/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-tan backdrop-blur-md">
              <Sparkles size={13} /> Luxury catering, simplified
            </div>
            <h1 className="text-3xl font-playfair font-bold leading-[1.08] text-[#FFD88A] sm:text-4xl md:text-5xl lg:text-7xl">
              Beautiful food experiences for every celebration.
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8 md:text-lg">
              From intimate dinners to custom corporate spreads, Cater Raja makes booking, styling, and delivery feel effortless from the very first click.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setShowOrderTypeModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-tan px-8 py-4 text-lg font-bold text-richBlack shadow-[0_0_40px_rgba(201,160,92,0.35)] transition-all hover:-translate-y-0.5 hover:bg-tan/90 sm:w-auto cursor-pointer"
              >
                Start booking <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-richBlack py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
            <img src={food2} alt="Main menu spread" className="absolute left-[12%] top-[14%] h-[68%] w-[64%] rounded-[28px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />
            <img src={food1} alt="Chef plating" className="absolute left-[1%] top-[2%] h-[30%] w-[28%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
            <img src={food3} alt="Elegant catering display" className="absolute right-[2%] top-[8%] h-[30%] w-[28%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
            <img src={cateringTeam} alt="Catering team" className="absolute bottom-[1%] left-[6%] h-[32%] w-[34%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">About Cater Raja</p>
            <h2 className="mt-4 text-2xl font-playfair font-bold text-white sm:text-3xl lg:text-4xl">A polished catering experience from first message to final delivery.</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-gray-300">
              <p>Planning your event should feel exciting, not complicated. Our platform brings together menu selection, portion planning, service style decisions, and secure confirmations in one clear workflow.</p>
              <p>Whether you are hosting a house party, a corporate lunch, or a large celebration, we make it easier to choose premium dishes, keep budgets in check, and schedule everything with confidence.</p>
            </div>
            <a href="#/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-tan px-7 py-3 font-semibold text-richBlack transition-all hover:-translate-y-0.5 hover:bg-tan/90">
              Discover more <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#2D0000] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">Why guests love it</p>
              <h3 className="mt-2 text-2xl sm:text-3xl font-playfair font-bold text-white">Every detail is designed to feel effortless.</h3>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <motion.div key={title} whileHover={{ y: -4, scale: 1.01 }} className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-tan/10 text-tan">
                  <Icon size={22} />
                </div>
                <h4 className="text-xl font-semibold text-white">{title}</h4>
                <p className="mt-3 text-sm leading-7 text-gray-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-richBlack py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 px-4 sm:px-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
            <Star className="mx-auto mb-4 text-tan" size={38} />
            <h3 className="text-3xl font-playfair font-bold text-white">4.9/5</h3>
            <p className="mt-2 text-gray-400">Average rating from happy clients</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
            <Clock className="mx-auto mb-4 text-tan" size={38} />
            <h3 className="text-3xl font-playfair font-bold text-white">10k+</h3>
            <p className="mt-2 text-gray-400">Events served across the UAE</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center">
            <MapPin className="mx-auto mb-4 text-tan" size={38} />
            <h3 className="text-3xl font-playfair font-bold text-white">Dubai &amp; Sharjah</h3>
            <p className="mt-2 text-gray-400">Coverage across key service zones</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;