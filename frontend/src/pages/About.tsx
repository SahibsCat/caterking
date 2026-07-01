import { motion } from 'framer-motion';
import { Sparkles, Calendar, Settings, DollarSign, Users, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

const About = () => {
  const features = [
    { icon: <Calendar className="text-tan" size={24} />, title: 'Occasion-Based Ordering', description: 'Choose your event type—house parties, office events, celebrations, or meal subscriptions—and get tailored menu suggestions instantly.' },
    { icon: <Settings className="text-tan" size={24} />, title: 'Dynamic Menu Customization', description: 'Build your menu your way: Add or remove dishes, adjust quantities, and personalize cuisine preferences.' },
    { icon: <DollarSign className="text-tan" size={24} />, title: 'Smart Budget Recommendations', description: 'Enter your budget, and the platform intelligently curates menu options that maximize value without compromising on quality.' },
    { icon: <Users className="text-tan" size={24} />, title: 'Flexible Pax Selection', description: 'Easily adjust the number of guests, and the system auto-optimizes portions and pricing.' },
    { icon: <ShieldCheck className="text-tan" size={24} />, title: 'Seamless Online Payments', description: 'Secure, fast checkout with multiple payment options. Real-Time Pricing Transparency with no hidden costs.' },
    { icon: <HeartHandshake className="text-tan" size={24} />, title: 'End-to-End Convenience', description: 'From planning to payment, everything happens in one streamlined flow—no back-and-forth calls or manual coordination.' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#4A0000] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-tan/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#2D0000]/60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-tan">
            <Sparkles size={12} /> About our experience
          </div>
          <h1 className="text-4xl font-playfair font-bold sm:text-5xl md:text-6xl">Your Complete Catering Solution, Simplified.</h1>
          <p className="mt-5 text-base leading-8 text-gray-300 sm:text-lg">Planning a party, corporate event or daily meal service should be exciting—not stressful. Cater Raja is a smart, end-to-end catering platform designed to make ordering food for any occasion seamless, customizable, and efficient.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[32px] border border-white/10 bg-[#2D0000] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">Our promise</p>
              <h2 className="mt-3 text-3xl font-playfair font-bold text-white sm:text-4xl">Complete control—from menu creation to budget planning—all in one place.</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400 sm:text-base">Whether you're hosting an intimate house party, organizing a corporate gathering, or setting up recurring meal plans, our platform gives you complete control over your catering needs.</p>
            </div>
            <div className="rounded-[24px] border border-tan/20 bg-tan/10 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">Real-Time Pricing Transparency</h3>
              <p className="mt-3 text-sm leading-7 text-gray-200">No hidden costs—see live pricing updates as you customize your menu. Enter your budget, and we intelligently curate options.</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                See what is included <ArrowRight size={16} className="text-tan" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-[24px] border border-white/10 bg-[#2D0000] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
