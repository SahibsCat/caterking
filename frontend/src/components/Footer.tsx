import { Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-richBlack border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.jpg" alt="Cater Raja" className="h-12 w-12 object-contain rounded-full border border-tan/30 bg-richBlack" />
            <span className="text-2xl font-playfair font-bold text-tan">Cater <span className="text-white">Raja</span></span>
          </div>
          <p className="text-gray-400 max-w-md leading-relaxed mb-6">
            Elevating your events with unparalleled culinary experiences. Authorized catering partner in Dubai and Sharjah.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://pin.it/6AgeqpkGk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#E60023] hover:border-[#E60023]/50 hover:bg-white/5 transition-all duration-300"
              title="Pinterest"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.13 0 3.77-2.25 3.77-5.5 0-2.88-2.07-4.9-5.03-4.9-3.43 0-5.44 2.57-5.44 5.23 0 1.04.4 2.15.9 2.75.1.12.11.23.08.35-.09.37-.29 1.19-.33 1.36-.05.22-.18.27-.41.16-1.53-.71-2.48-2.95-2.48-4.75 0-3.87 2.81-7.43 8.11-7.43 4.26 0 7.57 3.03 7.57 7.09 0 4.23-2.67 7.64-6.37 7.64-1.24 0-2.42-.65-2.82-1.4l-.77 2.92c-.28 1.06-1.03 2.39-1.54 3.23C9.07 23.88 10.5 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
              </svg>
            </a>
            <a 
              href="https://x.com/caterraja" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300"
              title="X (formerly Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://www.facebook.com/profile.php?id=61591015079197" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-white/5 transition-all duration-300"
              title="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/caterraja/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-white/5 transition-all duration-300"
              title="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Support Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/policies#privacy-policy" className="hover:text-tan transition-colors">Privacy Policy</Link></li>
            <li><Link to="/policies#cancellation-policy" className="hover:text-tan transition-colors">Cancellation & Modification Policy</Link></li>
            <li><Link to="/policies#terms-of-service" className="hover:text-tan transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/policies#shipping-policy" className="hover:text-tan transition-colors">Shipping & Delivery Policy</Link></li>
            <li><Link to="/policies#refund-policy" className="hover:text-tan transition-colors">Refund policy</Link></li>
            <li><Link to="/policies#terms-of-service" className="hover:text-tan transition-colors">Terms of service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-tan mt-1 shrink-0" />
              <div>
                <p>054 3344555 (Mobile)</p>
                <p>04 886 0089 (Landline)</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-tan shrink-0" />
              <p>Mail ID : info@caterraja.com</p>
            </li>
            <li className="flex items-start gap-3">
              <Globe size={18} className="text-tan mt-1 shrink-0" />
              <p className="text-sm">Warehouse No 4, Al Qusais Fourth, Plot No. 247-187, Dubai, UAE</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        © 2026 Cater Raja. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
