import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LeadModal from '../components/LeadModal';

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
    <div className="pt"> {/* 👈 pushes everything below fixed header */}

      {showLeadModal && <LeadModal onClose={() => setShowLeadModal(false)} />}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-richBlack font-bold via-richBlack/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Catering"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-7xl font-playfair font-bold mb-6 text-white leading-tight drop-shadow-2xl">
              Culinary <span className="text-tan">Excellence</span> <br />
              Tailored For You.
            </h1>

            <p className="text-xl text-gray-200 mb-8 font-inter leading-relaxed drop-shadow-md">
              Experience the finest catering services in Dubai and Sharjah. From intimate gatherings to grand celebrations, we bring luxury dining to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/book"
                className="bg-[#B99272] text-richBlack flex items-center justify-center gap-2 px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(185,146,114,0.4)]"
              >
                Start Booking <ArrowRight size={24} />
              </Link>

              <Link
                to="/meal-packs"
                className="border border-white/20 backdrop-blur-sm px-8 py-4 rounded-full text-lg font-bold text-center hover:bg-white/10 transition-colors"
              >
                Quick Meal Packs
              </Link>
            </div>
          </motion.div>
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