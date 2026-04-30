import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto bg-richBlack border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-tan mb-8">About Us</h1>
        
        <div className="space-y-6 text-gray-300 font-inter leading-relaxed">
          <p className="text-xl">
            <strong>Cater King – Your Complete Catering Solution, Simplified</strong>
          </p>
          <p>
            Planning a party, corporate event or daily meal service should be exciting—not stressful. Cater king is a smart, end-to-end catering platform designed to make ordering food for any occasion seamless, customizable, and efficient.
          </p>
          <p>
            Whether you're hosting an intimate house party, organizing a corporate gathering, or setting up recurring meal plans, our platform gives you complete control—from menu creation to budget planning—all in one place.
          </p>

          <h2 className="text-2xl font-playfair text-white mt-8 mb-4">Key Features</h2>
          
          <ul className="space-y-4">
            <li>
              <strong className="text-tan">Occasion-Based Ordering:</strong> Choose your event type—house parties, office events, celebrations, or meal subscriptions—and get tailored menu suggestions instantly.
            </li>
            <li>
              <strong className="text-tan">Dynamic Menu Customization:</strong> Build your menu your way:
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-400">
                <li>Add or remove dishes</li>
                <li>Adjust quantities</li>
                <li>Personalize cuisine preferences</li>
              </ul>
            </li>
            <li>
              <strong className="text-tan">Smart Budget-Based Recommendations:</strong> Enter your budget, and the platform intelligently curates menu options that maximize value without compromising on quality.
            </li>
            <li>
              <strong className="text-tan">Real-Time Pricing Transparency:</strong> No hidden costs—see live pricing updates as you customize your menu.
            </li>
            <li>
              <strong className="text-tan">Flexible Pax Selection:</strong> Easily adjust the number of guests, and the system auto-optimizes portions and pricing.
            </li>
            <li>
              <strong className="text-tan">Seamless Online Payments:</strong> Secure, fast checkout with multiple payment options.
            </li>
            <li>
              <strong className="text-tan">End-to-End Convenience:</strong> From planning to payment, everything happens in one streamlined flow—no back-and-forth calls or manual coordination.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
