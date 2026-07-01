import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

import { ShoppingBag, PhoneCall, Sparkles, Check } from 'lucide-react';
import { formatAED } from '../utils/currency';
import SuccessModal from '../components/SuccessModal';
import { toast } from '../components/Toast';
import Calendar from '../components/Calendar';

const mealPacksData = [
  { 
    id: 1, 
    name: 'Adult Meal Box', 
    type: 'Adult', 
    prices: { Standard: 45, Premium: 65, Elite: 85 },
    items: ['Butter Chicken', 'Biryani', 'Raita', 'Gulab Jamun'], 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' 
  },
  { 
    id: 2, 
    name: 'Kids Meal Box', 
    type: 'Kids', 
    prices: { Standard: 30, Premium: 45, Elite: 60 },
    items: ['Chicken Strips', 'Fruit Salad', 'Juice Box'], 
    image: 'https://plus.unsplash.com/premium_photo-1700061779409-9b5c2e09cb5c?q=80&w=841&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
  },
  { 
    id: 3, 
    name: 'Snacks Box', 
    type: 'Snack', 
    prices: { Standard: 25, Premium: 40, Elite: 55 },
    items: ['Samosas', 'Spring Rolls', 'Chai'], 
    image: 'https://plus.unsplash.com/premium_photo-1669137055808-6534e6cb8d60?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
  },
];

type PackageType = 'Standard' | 'Premium' | 'Elite';

const MealPacks = () => {
  const [selectedPackages, setSelectedPackages] = useState<Record<number, PackageType>>({
    1: 'Standard',
    2: 'Standard',
    3: 'Standard'
  });
  const [selectedFoodPrefs, setSelectedFoodPrefs] = useState<Record<number, 'Veg' | 'Non-Veg' | 'Mixed'>>({
    1: 'Veg',
    2: 'Veg',
    3: 'Veg'
  });
  const [packItems, setPackItems] = useState<Record<number, { name: string; dietary_tag: string }[]>>({
    1: [], 2: [], 3: []
  });
  const [loadingPacks, setLoadingPacks] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true
  });

  const handlePackageChange = (id: number, pkg: PackageType) => {
    setSelectedPackages(prev => ({ ...prev, [id]: pkg }));
  };

  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [selectedPackForOrder, setSelectedPackForOrder] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<{ _id: string, date: string }[]>([]);
  const [quickOrderData, setQuickOrderData] = useState({
    date: '',
    quantity: 5,
    name: '',
    mobile: '',
    email: '',
    flatVilla: '',
    street: '',
    area: '',
    landmark: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  // Success Modal State
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const scrollToError = () => {
    setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
  };

  const fetchAvailableDates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/available-dates`);
      const data = await res.json();
      setAvailableDates(data);
    } catch (err) {
      toast.error('Failed to load available dates');
    }
  };

  const fetchPackItems = async (id: number, type: string, pkg: string) => {
    setLoadingPacks(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/meal-box-menu?type=${type}&package=${pkg}`);
      if (res.ok) {
        const data = await res.json();
        setPackItems(prev => ({ ...prev, [id]: data.items.map((i: any) => ({ name: i.itemId.name, dietary_tag: i.itemId.dietary_tag || 'Mixed' })) }));
      } else {
        setPackItems(prev => ({ ...prev, [id]: [] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPacks(prev => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    mealPacksData.forEach(pack => {
      fetchPackItems(pack.id, pack.type, selectedPackages[pack.id]);
    });
  }, [selectedPackages]);

  const handleQuickOrderClick = (pack: any) => {
    setSelectedPackForOrder({ ...pack, items: packItems[pack.id], foodPreference: selectedFoodPrefs[pack.id] });
    setIsQuickOrderOpen(true);
    fetchAvailableDates();
  };

  const handleProceedToPayment = async () => {
    const newErrors: string[] = [];
    if (!quickOrderData.date) newErrors.push('date');
    if (!quickOrderData.name.trim()) newErrors.push('name');
    if (!quickOrderData.mobile.trim()) newErrors.push('mobile');
    if (!quickOrderData.flatVilla.trim()) newErrors.push('flatVilla');
    if (!quickOrderData.street.trim()) newErrors.push('street');
    if (!quickOrderData.area.trim()) newErrors.push('area');

    if (newErrors.length > 0) {
        setErrors(newErrors);
        scrollToError();
        return;
    }

    setErrors([]);

    try {
      const orderPayload = {
        orderId: `MEAL-${Date.now()}`,
        userId: '60d0fe4f5311236168a109ca', // mock
        eventDetails: {
          venue: 'Dubai',
          date: quickOrderData.date,
          guestCount: quickOrderData.quantity,
          occasion: 'Meal Box Order',
          foodPreference: selectedPackForOrder.foodPreference,
          serviceType: 'Delivery'
        },
        packageId: '60d0fe4f5311236168a109ca', // mock
        selectedMenu: (selectedPackForOrder.items || [])
          .filter((item: any) => {
            if (selectedPackForOrder.foodPreference === 'Mixed') return true;
            return item.dietary_tag === selectedPackForOrder.foodPreference;
          })
          .map((item: any) => ({
            name: item.name,
            category: 'Meal Box',
            calculatedWeight: 0.5
          })),
        customerDetails: {
          name: quickOrderData.name,
          email: quickOrderData.email,
          phone: quickOrderData.mobile,
          deliveryAddress: {
            flatVilla: quickOrderData.flatVilla,
            street: quickOrderData.street,
            area: quickOrderData.area,
            landmark: quickOrderData.landmark
          }
        },
        pricing: {
          total: selectedPackForOrder.prices[selectedPackages[selectedPackForOrder.id]] * quickOrderData.quantity
        },
        status: 'pending'
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        setIsQuickOrderOpen(false);
        setSuccessMessage(`Your order has been captured! Standard delivery has been scheduled for ${new Date(quickOrderData.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}.`);
        setSuccessModalOpen(true);
        // Reset form
        setQuickOrderData({
          date: '',
          quantity: 5,
          name: '',
          mobile: '',
          email: '',
          flatVilla: '',
          street: '',
          area: '',
          landmark: ''
        });
      } else {
        toast.error('Failed to submit order request');
      }
    } catch (err) {
      toast.error('Network failure connecting to gateway');
    }
  };

  const getAudienceBadgeStyle = (type: string) => {
    switch (type) {
      case 'Adult': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Snack': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'Kids': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-300 border border-white/10';
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A05C]/5 rounded-full blur-3xl -z-10" />

      <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(201,160,92,0.18),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.06),_transparent_55%),#2D0000] p-7 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-tan">
            <Sparkles size={12} /> Faster meal ordering
          </div>
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white tracking-tight">
            Choose a box, pick your style, and order in <span className="text-transparent bg-clip-text bg-gradient-to-r from-tan via-[#F7E7C4] to-tan">under a minute</span>.
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-8">
            Built for quick office lunches, school boxes, and last-minute catering needs. Each option is easy to compare, simple to customize, and ready for a fast checkout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mealPacksData.map((pack) => {
          const currentPackage = selectedPackages[pack.id];
          const currentPrice = pack.prices[currentPackage];

          return (
            <motion.div key={pack.id} whileHover={{ y: -4, scale: 1.01 }} className="bg-[#2D0000] border border-white/10 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col">
              <div className="h-56 relative overflow-hidden group">
                <img src={pack.image} alt={pack.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <span className={`badge text-[10px] font-bold uppercase tracking-wider ${getAudienceBadgeStyle(pack.type)}`}>
                    {pack.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-playfair font-bold text-white leading-tight">{pack.name}</h3>
                    <div className="text-right">
                      <span className="text-tan font-bold text-lg block">{formatAED(currentPrice)}</span>
                      <span className="text-[10px] text-gray-500 block font-medium">including vat</span>
                    </div>
                  </div>

                  {/* Tier Selector */}
                  <div className="space-y-1.5 mb-4">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Package Level</label>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                      {(['Standard', 'Premium', 'Elite'] as PackageType[]).map((pkg) => (
                        <button
                          key={pkg}
                          onClick={() => handlePackageChange(pack.id, pkg)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            currentPackage === pkg 
                              ? 'bg-tan text-richBlack scale-105 shadow-md' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {currentPackage === pkg && <Check size={12} />} {pkg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preference Selector */}
                  <div className="space-y-1.5 mb-5">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Dietary Filter</label>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                      {(['Veg', 'Non-Veg', 'Mixed'] as const).map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setSelectedFoodPrefs(prev => ({ ...prev, [pack.id]: pref }))}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            selectedFoodPrefs[pack.id] === pref 
                              ? 'bg-tan text-richBlack scale-105 shadow-md' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            pref === 'Veg' ? 'bg-green-600' : pref === 'Non-Veg' ? 'bg-red-600' : 'bg-yellow-600'
                          }`} />
                          {selectedFoodPrefs[pack.id] === pref && <Check size={12} />} {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Inclusions</label>
                    <ul className="space-y-1.5 bg-black/20 p-4 rounded-2xl border border-white/5 min-h-32">
                      {(() => {
                        if (loadingPacks[pack.id]) {
                          return (
                            <li className="flex flex-col gap-2 py-2">
                                <div className="h-3 w-3/4 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-3 w-1/2 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-3 w-5/6 bg-white/10 rounded-full animate-pulse"></div>
                            </li>
                          );
                        }
                        const pref = selectedFoodPrefs[pack.id];
                        const filtered = packItems[pack.id]?.filter(item => {
                          if (pref === 'Mixed') return true;
                          return item.dietary_tag === pref;
                        }) || [];
                        return filtered.length > 0 ? (
                          filtered.map((item, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.dietary_tag === 'Veg' ? 'bg-green-500' : item.dietary_tag === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                              <span className="truncate">{item.name}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-gray-500 italic py-8 text-center">
                            No {pref} items configured for {currentPackage} tier
                          </li>
                        );
                      })()}
                      {currentPackage === 'Premium' && packItems[pack.id]?.length > 0 && (
                        <li className="text-xs text-tan flex items-center gap-2 font-semibold mt-2 pt-2 border-t border-white/5">
                          <span className="w-1.5 h-1.5 bg-tan rounded-full shrink-0 animate-pulse" />
                          + Premium Dessert / Side
                        </li>
                      )}
                      {currentPackage === 'Elite' && (
                        <li className="text-xs text-tan flex items-center gap-2 font-semibold mt-2 pt-2 border-t border-white/5">
                          <span className="w-1.5 h-1.5 bg-tan rounded-full shrink-0 animate-pulse" />
                          + Premium Dessert, Side & Soft Drink
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={() => handleQuickOrderClick(pack)}
                  className="w-full rounded-2xl bg-tan px-4 py-3 font-semibold text-richBlack transition-all hover:bg-tan/90"
                >
                  <span className="flex items-center justify-center gap-2"><ShoppingBag size={15} /> Quick order</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-[#2D0000] border border-white/10 p-8 sm:p-12 text-center max-w-4xl mx-auto rounded-[32px] border-tan/20 shadow-2xl space-y-6">
        <h2 className="text-3xl font-playfair font-bold text-white">Need Reliable Corporate Catering?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          We provide consistent, premium daily meal plan deliveries custom-designed for corporate hubs, schools, or event venues. Get flexible calendar planning and tailored invoicing.
        </p>
        <div className="flex justify-center">
          <a href="tel:0543344555" className="btn btn-secondary flex items-center gap-2.5 px-8 py-3.5 rounded-full cursor-pointer hover:scale-105 transition-transform text-white no-underline">
            <PhoneCall size={16} /> Contact For Bulk Inquiries
          </a>
        </div>
      </div>

      {/* Quick Order Modal */}
      <AnimatePresence>
        {isQuickOrderOpen && (
          <div className="modal-overlay z-[1100]" onClick={() => setIsQuickOrderOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-lg p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold font-playfair text-white">Place Quick Order</h3>
                  <p className="text-xs text-gray-400 mt-1">{selectedPackForOrder?.name} • {selectedPackForOrder?.foodPreference} Selection</p>
                </div>
                <button 
                  onClick={() => setIsQuickOrderOpen(false)}
                  className="text-gray-500 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Input */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5 ml-1">Delivery Slot Date</label>
                    <div className="w-full mt-2">
                        <Calendar 
                          availableDates={availableDates
                            .filter(d => {
                              const dateObj = new Date(d.date);
                              const today = new Date();
                              const diffHrs = (dateObj.getTime() - today.getTime()) / (1000 * 60 * 60);
                              return diffHrs >= 24;
                            })
                            .map(d => d.date)
                          }
                          selectedDate={quickOrderData.date}
                          onSelect={(d) => {
                            setQuickOrderData({...quickOrderData, date: d});
                            setErrors(errors.filter(err => err !== 'date'));
                          }}
                        />
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 ml-1">Quantity (Min 5 packs)</label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setQuickOrderData({...quickOrderData, quantity: Math.max(5, quickOrderData.quantity - 1)})}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white font-bold cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-white/5 border border-white/10 py-2.5 rounded-xl text-center text-sm font-bold text-white">
                        {quickOrderData.quantity} Units
                      </div>
                      <button 
                        type="button"
                        onClick={() => setQuickOrderData({...quickOrderData, quantity: quickOrderData.quantity + 1})}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white font-bold cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-tan">Contact Details</span>
                  </div>

                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <input 
                      type="text"
                      placeholder="Full Name"
                      className={`input-field ${errors.includes('name') ? 'border-red-500' : ''}`}
                      value={quickOrderData.name}
                      onChange={(e) => {
                          setQuickOrderData({...quickOrderData, name: e.target.value});
                          setErrors(errors.filter(err => err !== 'name'));
                      }}
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <input 
                      type="tel"
                      placeholder="Mobile No"
                      className={`input-field ${errors.includes('mobile') ? 'border-red-500' : ''}`}
                      value={quickOrderData.mobile}
                      onChange={(e) => {
                          setQuickOrderData({...quickOrderData, mobile: e.target.value});
                          setErrors(errors.filter(err => err !== 'mobile'));
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input 
                      type="email"
                      placeholder="Email Address"
                      className="input-field"
                      value={quickOrderData.email}
                      onChange={(e) => setQuickOrderData({...quickOrderData, email: e.target.value})}
                    />
                  </div>

                  {/* Address Section */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-tan">Delivery Location Address</span>
                  </div>

                  {/* Flat / Villa */}
                  <div>
                    <input 
                      type="text"
                      placeholder="Villa / Flat No"
                      className={`input-field ${errors.includes('flatVilla') ? 'border-red-500' : ''}`}
                      value={quickOrderData.flatVilla}
                      onChange={(e) => {
                          setQuickOrderData({...quickOrderData, flatVilla: e.target.value});
                          setErrors(errors.filter(err => err !== 'flatVilla'));
                      }}
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <input 
                      type="text"
                      placeholder="Street Name"
                      className={`input-field ${errors.includes('street') ? 'border-red-500' : ''}`}
                      value={quickOrderData.street}
                      onChange={(e) => {
                          setQuickOrderData({...quickOrderData, street: e.target.value});
                          setErrors(errors.filter(err => err !== 'street'));
                      }}
                    />
                  </div>

                  {/* Area */}
                  <div className="sm:col-span-2">
                    <input 
                      type="text"
                      placeholder="Area / Community (e.g. Marina, Business Bay)"
                      className={`input-field ${errors.includes('area') ? 'border-red-500' : ''}`}
                      value={quickOrderData.area}
                      onChange={(e) => {
                          setQuickOrderData({...quickOrderData, area: e.target.value});
                          setErrors(errors.filter(err => err !== 'area'));
                      }}
                    />
                  </div>

                  {/* Landmark */}
                  <div className="sm:col-span-2">
                    <input 
                      type="text"
                      placeholder="Nearby Landmark (Optional)"
                      className="input-field"
                      value={quickOrderData.landmark}
                      onChange={(e) => setQuickOrderData({...quickOrderData, landmark: e.target.value})}
                    />
                  </div>
                </div>

                {/* Confirm Block */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Order Estimate</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-tan">
                        {formatAED((selectedPackForOrder?.prices?.[selectedPackages?.[selectedPackForOrder?.id]] * quickOrderData.quantity) || 0)}
                      </span>
                      <span className="text-[10px] text-gray-500 block">including vat</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleProceedToPayment}
                    className="w-full btn btn-primary py-4 rounded-xl text-base cursor-pointer"
                  >
                    Confirm Delivery
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification Modal */}
      <SuccessModal 
        isOpen={successModalOpen}
        title="Order Captured Successfully"
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
};

export default MealPacks;
