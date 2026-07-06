import { Mail, Phone, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#2D0000] py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl sm:rounded-[32px] border border-white/10 bg-gradient-to-br from-[#4A0000] via-[#2D0000] to-[#4A0000] p-5 sm:p-8 lg:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
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
                    <a href="tel:0543344555" className="hover:text-tan transition-colors block">054 3344555</a>
                    <a href="tel:048860089" className="hover:text-tan transition-colors block">04 886 0089</a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-tan" />
                  <a href="mailto:info@caterraja.com" className="hover:text-tan transition-colors">info@caterraja.com</a>
                </li>
                <li className="flex items-start gap-3">
                  <Globe size={18} className="mt-0.5 shrink-0 text-tan" />
                  <a href="https://maps.google.com/?q=Warehouse+No+4,+Al+Qusais+Fourth,+Dubai,+UAE" target="_blank" rel="noopener noreferrer" className="hover:text-tan transition-colors">
                    Warehouse No 4, Al Qusais Fourth, Dubai, UAE
                  </a>
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
                <a href="https://www.instagram.com/caterraja/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://www.youtube.com/@CaterRajaDubai" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:-translate-y-1 hover:bg-[#FF0000] hover:text-white" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
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
