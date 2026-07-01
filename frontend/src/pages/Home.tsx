import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, Sparkles, ShieldCheck, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LeadModal from '../components/LeadModal';
import heroImage from '../assets/hero-new.jpg';
import heroMobileImage from '../assets/hero-mobile.png';
import cateringTeam from '../assets/caterraja.jpeg';
import food1 from '../assets/food1.jpeg';
import food2 from '../assets/food2.jpeg';
import food3 from '../assets/food3.jpeg';

const Home = () => {
  const [showLeadModal, setShowLeadModal] = useState(false);

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

      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.35))]" />
          <img src={heroImage} alt="Luxury Catering" className="hidden h-full w-full object-cover md:block" />
          <img src={heroMobileImage} alt="Luxury Catering" className="block h-full w-full object-cover md:hidden" />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-center px-4 pb-20 pt-32 sm:px-6 md:pt-0 md:pb-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-tan/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-tan backdrop-blur-md">
              <Sparkles size={13} /> Luxury catering, simplified
            </div>
            <h1 className="text-4xl font-playfair font-bold leading-[1.05] text-[#FFD88A] sm:text-5xl md:text-7xl">
              Beautiful food experiences for every celebration.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg md:text-xl">
              From intimate dinners to custom corporate spreads, Cater Raja makes booking, styling, and delivery feel effortless from the very first click.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/book" className="flex w-full items-center justify-center gap-2 rounded-full bg-tan px-8 py-4 text-lg font-bold text-richBlack shadow-[0_0_40px_rgba(201,160,92,0.35)] transition-all hover:-translate-y-0.5 hover:bg-tan/90 sm:w-auto">
                Start booking <ArrowRight size={18} />
              </Link>
              <Link to="/meal-packs" className="flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto">
                Explore meal packs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-richBlack py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative h-[460px] sm:h-[520px]">
            <img src={food2} alt="Main menu spread" className="absolute left-[12%] top-[14%] h-[68%] w-[64%] rounded-[28px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />
            <img src={food1} alt="Chef plating" className="absolute left-[1%] top-[2%] h-[30%] w-[28%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
            <img src={food3} alt="Elegant catering display" className="absolute right-[2%] top-[8%] h-[30%] w-[28%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
            <img src={cateringTeam} alt="Catering team" className="absolute bottom-[1%] left-[6%] h-[32%] w-[34%] rounded-[24px] border-4 border-richBlack object-cover shadow-2xl" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">About Cater Raja</p>
            <h2 className="mt-4 text-3xl font-playfair font-bold text-white sm:text-4xl">A polished catering experience from first message to final delivery.</h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-gray-300">
              <p>Planning your event should feel exciting, not complicated. Our platform brings together menu selection, portion planning, service style decisions, and secure confirmations in one clear workflow.</p>
              <p>Whether you are hosting a house party, a corporate lunch, or a large celebration, we make it easier to choose premium dishes, keep budgets in check, and schedule everything with confidence.</p>
            </div>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-tan px-7 py-3 font-semibold text-richBlack transition-all hover:-translate-y-0.5 hover:bg-tan/90">
              Discover more <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#2D0000] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">Why guests love it</p>
              <h3 className="mt-2 text-3xl font-playfair font-bold text-white">Every detail is designed to feel effortless.</h3>
            </div>
            <Link to="/meal-packs" className="text-sm font-semibold text-tan transition-colors hover:text-tan/80">View flexible meal packs →</Link>
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

      <section className="bg-richBlack py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
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
            <h3 className="text-3xl font-playfair font-bold text-white">Dubai & Sharjah</h3>
            <p className="mt-2 text-gray-400">Coverage across key service zones</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;