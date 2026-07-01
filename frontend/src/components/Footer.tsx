import { Mail, Phone, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#2D0000] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#4A0000] via-[#2D0000] to-[#4A0000] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <img src="/logo.jpg" alt="Cater Raja" className="h-12 w-12 rounded-full border border-tan/30 bg-richBlack object-contain" />
                <div>
                  <p className="font-playfair text-2xl font-bold text-tan">Cater Raja</p>
                  <p className="text-sm text-white/60">Premium catering for modern events</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-gray-300">
                From elegant private dining to large corporate gatherings, we create polished catering experiences that are effortless to book and enjoyable to host.
              </p>
              <Link to="/book" className="mt-6 inline-flex items-center gap-2 rounded-full bg-tan px-5 py-3 text-sm font-semibold text-richBlack transition-all hover:-translate-y-0.5 hover:bg-tan/90">
                Plan your event <ArrowRight size={16} />
              </Link>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-semibold text-white">Quick links</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to="/policies#privacy-policy" className="transition-colors hover:text-tan">Privacy Policy</Link></li>
                <li><Link to="/policies#cancellation-policy" className="transition-colors hover:text-tan">Cancellation & Modification Policy</Link></li>
                <li><Link to="/policies#terms-of-service" className="transition-colors hover:text-tan">Terms & Conditions</Link></li>
                <li><Link to="/policies#shipping-policy" className="transition-colors hover:text-tan">Shipping & Delivery Policy</Link></li>
                <li><Link to="/policies#refund-policy" className="transition-colors hover:text-tan">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-semibold text-white">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-tan" />
                  <div>
                    <p>054 3344555</p>
                    <p>04 886 0089</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-tan" />
                  <p>info@caterraja.com</p>
                </li>
                <li className="flex items-start gap-3">
                  <Globe size={18} className="mt-0.5 shrink-0 text-tan" />
                  <p>Warehouse No 4, Al Qusais Fourth, Dubai, UAE</p>
                </li>
              </ul>
              
              <h4 className="mt-8 mb-5 text-lg font-semibold text-white">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="https://x.com/caterraja" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-[#1DA1F2] hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61591015079197" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-[#4267B2] hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/caterraja/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-[#E1306C] hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://pin.it/6AgeqpkGk" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-[#E60023] hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.72-.359-1.782c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.145 0 7.365 2.951 7.365 6.891 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373 0 0-.599 2.282-.743 2.84-.269 1.045-.995 2.353-1.485 3.151 1.144.354 2.347.541 3.585.541 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
            © 2026 Cater Raja. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
