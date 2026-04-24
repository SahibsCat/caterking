import { ChefHat, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-richBlack border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="text-tan w-8 h-8" />
            <span className="text-2xl font-playfair font-bold text-tan">Cater</span>
            <span className="text-2xl font-playfair font-bold">King</span>
          </div>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Elevating your events with unparalleled culinary experiences. Authorized catering partner in Dubai and Sharjah.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-6">Support Links</h4>
          <ul className="space-y-4 text-gray-400">
            <li><a href="https://sahibs.ae/policies/privacy-policy" className="hover:text-tan transition-colors">Privacy Policy</a></li>
            <li><a href="https://sahibs.ae/policies/refund-policy" className="hover:text-tan transition-colors">Cancellation & Modification Policy</a></li>
            <li><a href="https://sahibs.ae/policies/terms-of-service" className="hover:text-tan transition-colors">Terms & Conditions</a></li>
            <li><a href="https://sahibs.ae/policies/shipping-policy" className="hover:text-tan transition-colors">Shipping & Delivery Policy</a></li>
            <li><a href="https://sahibs.ae/policies/refund-policy" className="hover:text-tan transition-colors">Refund policy</a></li>
            <li><a href="https://sahibs.ae/policies/terms-of-service" className="hover:text-tan transition-colors">Terms of service</a></li>
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
              <p>hello@sahibs.ae</p>
            </li>
            <li className="flex items-start gap-3">
              <Globe size={18} className="text-tan mt-1 shrink-0" />
              <p className="text-sm">Warehouse No 4, Al Qusais Fourth, Plot No. 247-187, Dubai, UAE</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
        © 2026 Cater King. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
