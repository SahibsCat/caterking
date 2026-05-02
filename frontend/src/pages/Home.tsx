import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LeadModal from '../components/LeadModal';
import heroImage from '../assets/hero-new.jpg';
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

  return (
    <div className="pt-0"> {/* 👈 pushes everything below fixed header */}

      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} />}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/35 z-10" />
          <img
            src={heroImage}
            alt="Luxury Catering"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 relative z-20 w-full flex justify-center text-center pt-32 pb-20 md:pt-0 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-7xl font-playfair font-bold mb-6 text-[#FFD700] leading-[1.2] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              Culinary <br className="hidden md:block" />
              Excellence <br className="hidden md:block" />
              Tailored For You.
            </h1>

            <p className="text-lg md:text-2xl text-[#FFD700] mb-10 font-inter leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] mx-auto max-w-3xl px-4 md:px-0">
              Experience the finest catering services in Dubai and Sharjah. From intimate gatherings to grand celebrations, we bring luxury dining to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/book"
                className="w-full sm:w-auto bg-[#B99272] text-white flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(185,146,114,0.4)]"
              >
                Start Booking <ArrowRight size={20} />
              </Link>

              <Link
                to="/meal-packs"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 rounded-full text-lg font-bold text-white text-center hover:bg-white/20 transition-all shadow-xl"
              >
                Quick Meal Packs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-richBlack border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Images Left - Layered Composition */}
          <div className="relative h-[500px] md:h-[600px] w-full mt-10 lg:mt-0">
            {/* Base/Main Image - Food 2 (Big) */}
            <img
              src={food2}
              alt="Main Food"
              className="absolute w-[65%] h-[70%] object-cover rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10"
              style={{ left: '15%', top: '15%' }}
            />
            {/* Top Left Image - Food 1 (Square) */}
            <img
              src={food1}
              alt="Food 1"
              className="absolute w-[35%] aspect-square object-cover rounded-2xl shadow-2xl z-20 border-4 border-richBlack"
              style={{ left: '0%', top: '0%' }}
            />
            {/* Top Right Image - Food 3 (Square) */}
            <img
              src={food3}
              alt="Food 3"
              className="absolute w-[35%] aspect-square object-cover rounded-2xl shadow-2xl z-20 border-4 border-richBlack"
              style={{ right: '0%', top: '10%' }}
            />
            {/* Bottom Left Image - Catering Team (Square) */}
            <img
              src={cateringTeam}
              alt="Catering Team"
              className="absolute w-[40%] aspect-square object-cover rounded-2xl shadow-2xl z-30 border-4 border-richBlack"
              style={{ left: '5%', bottom: '0%' }}
            />
          </div>

          {/* Content Right */}
          <div className="pl-0 lg:pl-8">
            <h2 className="text-sm font-bold text-tan tracking-[0.2em] uppercase mb-4">About</h2>
            <h3 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6 leading-tight">
              Cater King – Your Complete Catering Solution, Simplified
            </h3>
            <div className="space-y-6 text-gray-300 font-inter leading-relaxed text-lg">
              <p>
                Planning a party, corporate event or daily meal service should be exciting—not stressful. Cater king is a smart, end-to-end catering platform designed to make ordering food for any occasion seamless, customizable, and efficient.
              </p>
              <p>
                Whether you're hosting an intimate house party, organizing a corporate gathering, or setting up recurring meal plans, our platform gives you complete control—from menu creation to budget planning—all in one place.
              </p>
            </div>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 bg-[#B99272] text-richBlack px-8 py-3 rounded-full hover:bg-[#A67F5F] transition-all font-bold w-fit"
            >
              Read More <ArrowRight size={20} />
            </Link>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-richBlack">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="glass-card p-8 text-center">
            <Star className="text-tan mx-auto mb-4" size={40} />
            <h3 className="text-3xl font-playfair font-bold mb-2">4.9/5</h3>
            <p className="text-gray-400">Average Rating</p>
          </div>

          <div className="glass-card p-8 text-center">
            <Clock className="text-tan mx-auto mb-4" size={40} />
            <h3 className="text-3xl font-playfair font-bold mb-2">10k+</h3>
            <p className="text-gray-400">Events Served</p>
          </div>

          <div className="glass-card p-8 text-center">
            <MapPin className="text-tan mx-auto mb-4" size={40} />
            <h3 className="text-3xl font-playfair font-bold mb-2">UAE</h3>
            <p className="text-gray-400">Dubai & Sharjah</p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;