import { useState } from 'react';
import { API_BASE_URL } from '../config';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Info } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  dietary: 'Veg' | 'Non-Veg' | 'Mixed';
  weight_ratio: number;
  base_price: number;
  packages: string[];
  occasions: string[];
  is_active: boolean;
  quantity?: number;
}
import { useEffect, useMemo } from 'react';

const steps = ['Details', 'Package', 'Menu', 'Contact', 'Review'];

interface IFormData {
  name: string;
  mobile: string;
  venue: string;
  date: string;
  guests: number;
  package: string;
  occasion: string;
  serviceType: 'Delivery' | 'Delivery + Service' | 'Buffet';
  foodPreference: 'Veg' | 'Non-Veg' | 'Mixed';
  email: string;
  address: {
    flatVilla: string;
    street: string;
    area: string;
    landmark?: string;
  };
  selectedItems: MenuItem[];
  totalPrice?: number;
}

const BookingFlow = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [availableDates, setAvailableDates] = useState<{ _id: string, date: string }[]>([]);
  
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/available-dates`)
      .then(res => res.json())
      .then(data => setAvailableDates(data))
      .catch(console.error);

    fetch(`${API_BASE_URL}/api/menu`)
      .then(res => res.json())
      .then(data => {
                const mapped = data.map((d: any) => ({
          ...d,
          id: d._id,
          dietary: d.dietary_tag,
          weight_ratio: d.weight_ratio_per_10_guests,
          packages: d.packages || [],
          occasions: d.occasions || [],
          is_active: d.is_active !== undefined ? d.is_active : true
        }));
        setMenuItems(mapped);
      })
      .catch(console.error);
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IFormData>({
    name: localStorage.getItem('leadName') || '',
    mobile: localStorage.getItem('leadMobile') || '',
    venue: 'Dubai',
    date: '',
    guests: 10,
    package: 'Standard',
    occasion: 'Birthday Party',
    serviceType: 'Delivery',
    foodPreference: 'Mixed',
    email: '',
    address: {
      flatVilla: '',
      street: '',
      area: '',
      landmark: ''
    },
    selectedItems: [],
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [itemToReplace, setItemToReplace] = useState<MenuItem | null>(null);

  // Fetch Default Menu for Occasion/Package
  useEffect(() => {
    if (formData.occasion && formData.package) {
      fetch(`${API_BASE_URL}/api/occasion-menu?occasion=${formData.occasion}&package=${formData.package}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && !isCustomizing) {
            const mappedItems = data.items.map((i: any) => ({
              ...i.itemId,
              id: i.itemId._id,
              dietary: i.itemId.dietary_tag,
              weight_ratio: i.itemId.weight_ratio_per_10_guests,
              quantity: i.defaultQuantity || 1
            }));
            setFormData(prev => ({ ...prev, selectedItems: mappedItems }));
          }
        })
        .catch(() => {});
    }
  }, [formData.occasion, formData.package]);

  const calculateTotalPrice = () => {
    const pkgBasePrice = formData.package === 'Standard' ? 120 : formData.package === 'Premium' ? 180 : 250;
    let total = pkgBasePrice * formData.guests;
    
    if (isCustomizing) {
        total = formData.selectedItems.reduce((acc, item) => acc + (item.base_price * (item.quantity || 1) * formData.guests / 10), 0);
    }
    return total;
  };

  const categorizedRecommended = useMemo(() => {
    if (!formData.selectedItems) return {};
    return formData.selectedItems.reduce((acc: any, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
  }, [formData.selectedItems]);

  const handleReplaceItem = (oldItem: MenuItem) => {
    setItemToReplace(oldItem);
    setIsReplaceModalOpen(true);
  };

  const confirmReplacement = (newItem: MenuItem) => {
    if (!itemToReplace) return;
    setFormData(prev => ({
        ...prev,
        selectedItems: prev.selectedItems.map(i => i.id === itemToReplace.id ? { ...newItem, quantity: 1 } : i)
    }));
    setIsReplaceModalOpen(false);
    setItemToReplace(null);
  };

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const scrollToError = () => {
    setTimeout(() => {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const nextStep = () => {
    const newErrors: string[] = [];
    
    // Check Current Step Validation
    if (currentStep === 0) {
      if (!formData.date) newErrors.push('date');
      if (!formData.venue) newErrors.push('venue');
      if (!formData.guests || formData.guests < 10) newErrors.push('guests');
      if (!formData.occasion) newErrors.push('occasion');
      if (!formData.serviceType) newErrors.push('serviceType');
      if (!formData.foodPreference) newErrors.push('foodPreference');
    } else if (currentStep === 1) {
      if (!formData.package) newErrors.push('package');
    } else if (currentStep === 2) {
      if (formData.selectedItems.length === 0) newErrors.push('menu');
    } else if (currentStep === 3) {
      if (!formData.name.trim()) newErrors.push('name');
      else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) newErrors.push('name_format');
      
      if (!formData.mobile.trim()) newErrors.push('mobile');
      else if (!/^\d+$/.test(formData.mobile.trim())) newErrors.push('mobile_format');
      
      if (!formData.email.trim()) newErrors.push('email');
      else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) newErrors.push('email_format');
      
      if (!formData.address.flatVilla.trim()) newErrors.push('address_flat');
      if (!formData.address.street.trim()) newErrors.push('address_street');
      if (!formData.address.area.trim()) newErrors.push('address_area');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      scrollToError();
      return;
    }

    setErrors([]);
    setCurrentStep((prev: number) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep((prev: number) => Math.max(prev - 1, 0));

    const handleCompleteBooking = async () => {
    // Final Validation Check across ALL steps
    const finalErrors: string[] = [];
    
    // Step 0
    if (!formData.date) finalErrors.push('date');
    if (!formData.venue) finalErrors.push('venue');
    if (!formData.guests || formData.guests < 10) finalErrors.push('guests');
    if (!formData.occasion) finalErrors.push('occasion');
    if (!formData.serviceType) finalErrors.push('serviceType');
    
    // Step 1 & 2
    if (!formData.package) finalErrors.push('package');
    if (formData.selectedItems.length === 0) finalErrors.push('menu');
    
    // Step 3
    if (!formData.name.trim()) finalErrors.push('name');
    if (!formData.mobile.trim()) finalErrors.push('mobile');
    if (!formData.email.trim()) finalErrors.push('email');
    if (!formData.address.flatVilla.trim()) finalErrors.push('address_flat');
    if (!formData.address.street.trim()) finalErrors.push('address_street');
    if (!formData.address.area.trim()) finalErrors.push('address_area');

    if (finalErrors.length > 0) {
      setErrors(finalErrors);
      // Jump to the first step with an error
      if (['date', 'venue', 'guests', 'occasion', 'serviceType'].some(e => finalErrors.includes(e))) setCurrentStep(0);
      else if (finalErrors.includes('package')) setCurrentStep(1);
      else if (finalErrors.includes('menu')) setCurrentStep(2);
      else setCurrentStep(3);
      scrollToError();
      return;
    }

    try {
      // Create a Lead as well when booking is confirmed
      fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          source: 'booking_flow'
        })
      }).catch(err => console.error('Error auto-creating lead:', err));

      const orderPayload = {
        orderId: `ORD-${Date.now()}`,
        userId: '60d0fe4f5311236168a109ca', // mock user ID for now since we don't have login, or we should use real ID
        eventDetails: {
          venue: formData.venue,
          date: formData.date,
          guestCount: formData.guests,
          occasion: formData.occasion,
          foodPreference: formData.foodPreference,
          serviceType: formData.serviceType
        },
        packageId: '60d0fe4f5311236168a109ca', // also mock
        selectedMenu: formData.selectedItems.map(i => ({
          itemId: i.id,
          name: i.name,
          category: i.category,
          calculatedWeight: formData.guests / 10 * i.weight_ratio
        })),
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          deliveryAddress: formData.address
        },
        additionalChoices: [],
        pricing: {
          total: ((formData.package === 'Standard' ? 120 : formData.package === 'Premium' ? 180 : 250) * formData.guests) * 1.05
        },
        status: 'pending'
      };
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        alert('Booking successfully placed!');
        window.location.href = '/';
      } else {
        alert('Error placing booking');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [showInclusionPopup, setShowInclusionPopup] = useState(false);

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto relative">
      {/* Replacement Modal */}
      <AnimatePresence>
        {isReplaceModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-10 max-w-2xl w-full border-tan/30 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-playfair font-bold">Replace {itemToReplace?.category}</h3>
                <button onClick={() => setIsReplaceModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              <p className="text-gray-400 mb-8 font-inter">Swap your current selection with another available dish in the same category.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems
                    .filter(i => i.is_active && i.category === itemToReplace?.category)
                    .filter(i => !i.packages || i.packages.length === 0 || i.packages.includes(formData.package))
                    .map(item => (
                        <div 
                            key={item.id}
                            onClick={() => confirmReplacement(item)}
                            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-tan cursor-pointer transition-all flex items-center gap-3"
                        >
                            <div className={`w-2 h-2 rounded-full ${item.dietary === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                    ))
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inclusion Popup */}
      <AnimatePresence>
        {showInclusionPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-richBlack/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-10 max-w-md text-center border-tan/30"
            >
              <Info className="text-tan mx-auto mb-6" size={48} />
              <h3 className="text-2xl font-playfair font-bold mb-4">Standard Inclusions</h3>
              <p className="text-gray-400 mb-8">
                For 'Only Delivery' orders, we provide premium disposable cutlery, napkins, and serving spoons as standard.
              </p>
              <button 
                onClick={() => setShowInclusionPopup(false)}
                className="w-full bg-tan text-richBlack py-4 rounded-full font-bold hover:scale-105 transition-all"
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-tan -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, index) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${
              index <= currentStep ? 'bg-tan text-richBlack' : 'bg-richBlack border-2 border-white/20 text-white/40'
            }`}>
              {index < currentStep ? <Check size={20} /> : index + 1}
            </div>
            <span className={`mt-2 text-sm font-semibold ${index <= currentStep ? 'text-tan' : 'text-white/40'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8 md:p-12 min-h-[500px]"
        >
          {currentStep === 0 && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <h2 className="text-4xl font-playfair font-bold text-tan">Event Details</h2>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    Step 1 of 5
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden group hover:border-tan/20 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tan/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-tan/10 transition-all" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Venue Location</label>
                    <div className="relative group">
                      <select 
                        className={`w-full bg-richBlack/50 border p-4 rounded-2xl focus:border-tan outline-none transition-all appearance-none cursor-pointer ${
                          errors.includes('venue') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 group-hover:border-white/20'
                        }`}
                        value={formData.venue}
                        onChange={(e) => {
                          setFormData({...formData, venue: e.target.value});
                          setErrors(errors.filter(e => e !== 'venue'));
                        }}
                      >
                        <option value="Dubai" className="bg-[#0A0A0A]">Dubai</option>
                        <option value="Sharjah" className="bg-[#0A0A0A]">Sharjah</option>
                        <option value="Ajman" className="bg-[#0A0A0A]">Ajman</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronRight size={20} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Guest Count <span className="text-gray-600 font-normal lowercase tracking-normal">(Min: 10, Step: 5)</span></label>
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => {
                          const newVal = Math.max(10, formData.guests - 5);
                          setFormData({...formData, guests: newVal});
                        }}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-tan hover:text-richBlack hover:border-tan transition-all text-2xl font-light shadow-lg"
                      >
                        -
                      </button>
                      <div className={`flex-1 bg-white/5 border p-4 rounded-2xl text-center font-playfair font-bold text-2xl shadow-inner ${
                        errors.includes('guests') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'
                      }`}>
                        {formData.guests} <span className="text-sm font-inter text-gray-500 font-normal uppercase tracking-widest">Guests</span>
                      </div>
                      <button 
                        onClick={() => {
                          setFormData({...formData, guests: formData.guests + 5});
                        }}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-tan hover:text-richBlack hover:border-tan transition-all text-2xl font-light shadow-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Event Date</label>
                    <div className="relative group">
                      <select 
                        className={`w-full bg-richBlack/50 border p-4 rounded-2xl focus:border-tan outline-none transition-all appearance-none cursor-pointer ${
                          errors.includes('date') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 group-hover:border-white/20'
                        }`}
                        value={formData.date}
                        onChange={(e) => {
                          setFormData({...formData, date: e.target.value});
                          setErrors(errors.filter(e => e !== 'date'));
                        }}
                      >
                        <option value="" className="bg-[#0A0A0A]">Select Available Date</option>
                        {availableDates
                          .filter(d => {
                            const dateObj = new Date(d.date);
                            const today = new Date();
                            const diffMs = dateObj.getTime() - today.getTime();
                            const diffHrs = diffMs / (1000 * 60 * 60);
                            
                            const requiredHrs = formData.serviceType === 'Delivery' ? 24 : 48;
                            return diffHrs >= requiredHrs;
                          })
                          .map(d => (
                            <option key={d._id} value={d.date.split('T')[0]} className="bg-[#0A0A0A]">
                              {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </option>
                          ))
                        }
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronRight size={20} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Occasion Type</label>
                    <div className="relative group">
                      <select 
                        className={`w-full bg-richBlack/50 border p-4 rounded-2xl focus:border-tan outline-none transition-all appearance-none cursor-pointer ${
                          errors.includes('occasion') ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 group-hover:border-white/20'
                        }`}
                        value={formData.occasion}
                        onChange={(e) => {
                          setFormData({...formData, occasion: e.target.value});
                          setErrors(errors.filter(e => e !== 'occasion'));
                        }}
                      >
                        {['Birthday Party', 'House Party', 'Kids Party', 'Wedding Event', 'Baby Shower', 'Corporate Event', 'Kitty Party', 'Housewarming', 'Other'].map(opt => (
                          <option key={opt} value={opt} className="bg-richBlack">{opt}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronRight size={20} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Service Type</label>
                    <div className="flex flex-col gap-3">
                      {[
                        { id: 'Delivery', label: 'Only Delivery', notice: '24hrs notice' },
                        { id: 'Delivery + Service', label: 'Delivery + Service', notice: '48hrs notice' },
                        { id: 'Buffet', label: 'Complete Buffet', notice: '48hrs notice' }
                      ].map(type => (
                        <div 
                          key={type.id}
                          onClick={() => {
                            setFormData({...formData, serviceType: type.id as any});
                            setErrors(errors.filter(e => e !== 'serviceType'));
                          }}
                          className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex justify-between items-center relative group/item overflow-hidden ${
                            formData.serviceType === type.id ? 'border-tan bg-tan/10' : 
                            errors.includes('serviceType') ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          {formData.serviceType === type.id && (
                            <motion.div layoutId="service-bg" className="absolute left-0 w-1 h-full bg-tan" />
                          )}
                          <span className={`font-semibold transition-colors ${formData.serviceType === type.id ? 'text-tan' : 'text-gray-300'}`}>{type.label}</span>
                          <span className="text-[10px] text-tan/40 uppercase tracking-tighter group-hover/item:text-tan/60 transition-colors">{type.notice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Food Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Veg', 'Non-Veg', 'Mixed'].map(pref => (
                        <div 
                          key={pref}
                          onClick={() => {
                            setFormData({...formData, foodPreference: pref as any});
                            setErrors(errors.filter(e => e !== 'foodPreference'));
                          }}
                          className={`p-4 rounded-2xl cursor-pointer border-2 text-center transition-all flex flex-col items-center justify-center gap-2 group/pref relative overflow-hidden ${
                            formData.foodPreference === pref ? 'border-tan bg-tan/10' : 
                            errors.includes('foodPreference') ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${pref === 'Veg' ? 'bg-green-500' : pref === 'Non-Veg' ? 'bg-red-500' : 'bg-tan'} shadow-[0_0_10px_rgba(212,175,55,0.3)]`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${formData.foodPreference === pref ? 'text-tan' : 'text-gray-400'}`}>{pref}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-tan/5 rounded-2xl border border-tan/10 mt-4">
                        <p className="text-[10px] text-tan/60 italic leading-relaxed">
                            <Info size={10} className="inline mr-1" /> Choosing "Mixed" allows you to combine both Vegetarian and Non-Vegetarian dishes in your final selection.
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-4xl font-playfair font-bold mb-8 text-tan">Choose Your Package</h2>
              <div className="text-gray-400 mb-8">- to customize your menu click next.</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {['Standard', 'Premium', 'Elite'].map((pkg) => (
                  <div 
                    key={pkg}
                    onClick={() => {
                        setFormData({...formData, package: pkg});
                        setIsCustomizing(false);
                    }}
                    className={`p-6 rounded-2xl cursor-pointer border-2 transition-all hover:scale-105 ${
                      formData.package === pkg ? 'border-tan bg-tan/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <h3 className="text-2xl font-playfair font-bold mb-4">{pkg}</h3>
                    <ul className="text-sm text-gray-400 space-y-2 mb-6">
                      <li className="flex gap-2"><Check size={16} className="text-tan" /> {pkg === 'Standard' ? '3' : pkg === 'Premium' ? '5' : '8'} Main Courses</li>
                      <li className="flex gap-2"><Check size={16} className="text-tan" /> {pkg === 'Standard' ? '2' : '4'} Starters</li>
                      <li className="flex gap-2"><Check size={16} className="text-tan" /> 1 Dessert</li>
                    </ul>
                    <div className="text-2xl font-bold text-tan">AED {pkg === 'Standard' ? 120 : pkg === 'Premium' ? 180 : 250}<span className="text-sm font-normal text-gray-500"> / guest</span></div>
                  </div>
                ))}
              </div>

              {formData.selectedItems.length > 0 && !isCustomizing && (
                <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-playfair font-bold">Recommended Menu for {formData.occasion}</h3>
                   </div>
                   <p className="text-gray-400 -mt-6 mb-8 text-sm italic">You can replace the menu you need.</p>
                   
                   <div className="space-y-8">
                        {Object.keys(categorizedRecommended).map(cat => (
                            <div key={cat}>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-tan/60 mb-4">{cat}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categorizedRecommended[cat].map((item: MenuItem) => (
                                        <div key={item.id} className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                                            <div className={`w-2 h-2 rounded-full ${item.dietary === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{item.name}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleReplaceItem(item)}
                                                className="ml-auto bg-tan/10 text-tan text-[10px] px-3 py-1 rounded-full font-bold border border-tan/20 hover:bg-tan hover:text-richBlack transition-all"
                                            >
                                                Replace
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Summary at Top */}
              <div className="bg-white/5 p-8 rounded-2xl border border-tan/20 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div>
                  <h3 className="text-2xl font-playfair font-bold mb-2">Live Summary</h3>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>{formData.package} Package</span>
                    <span>•</span>
                    <span>{formData.guests} Guests</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase mb-1">Subtotal</div>
                  <div className="text-4xl font-playfair font-bold text-tan">AED {calculateTotalPrice()}</div>
                </div>
              </div>

              {/* Add more dishes section */}
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-400 mb-6 font-semibold italic text-sm">Want to modify quantities or add more dishes to your event?</p>
                <button 
                  onClick={() => setShowFullMenu(!showFullMenu)}
                  className="bg-tan text-richBlack px-10 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 mx-auto"
                >
                  {showFullMenu ? 'Hide Menu' : 'Customize Your Menu'}
                </button>
              </div>

              {showFullMenu && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                    <div>
                        <h2 className="text-4xl font-playfair font-bold text-tan mb-8">All Dishes</h2>
                        {errors.includes('menu') && <p className="text-red-500 text-sm mb-4">Please select at least one item from the menu.</p>}
                        <div className="space-y-8">
                        {Array.from(new Set(menuItems.map(i => i.category))).map((cat) => (
                            <div key={cat}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">{cat}</h4>
                            <div className="space-y-3">
                                {menuItems
                                .filter(i => i.is_active)
                                .filter(i => !i.packages || i.packages.length === 0 || i.packages.includes(formData.package))
                                .filter(i => i.category === cat)
                                .filter(i => {
                                    if (formData.foodPreference === 'Mixed') return true;
                                    return i.dietary === formData.foodPreference;
                                })
                                .map(item => {
                                    const selectedItem = formData.selectedItems.find((si: MenuItem) => si.id === item.id);
                                    return (
                                        <div 
                                            key={item.id}
                                            className={`p-4 rounded-xl border transition-all flex justify-between items-center ${
                                            selectedItem ? 'border-tan bg-tan/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 text-left">
                                                <div className={`w-2 h-2 rounded-full ${item.dietary === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{item.name}</span>
                                                    <span className="text-[10px] text-tan">AED {item.base_price}/unit</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                                                <button 
                                                    onClick={() => {
                                                        const current = selectedItem?.quantity || 0;
                                                        if (current <= 1) {
                                                            setFormData({...formData, selectedItems: formData.selectedItems.filter(i => i.id !== item.id)});
                                                            if (!isCustomizing) setIsCustomizing(true);
                                                        } else {
                                                            setFormData({...formData, selectedItems: formData.selectedItems.map(i => i.id === item.id ? {...i, quantity: current - 1} : i)});
                                                            if (!isCustomizing) setIsCustomizing(true);
                                                        }
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{selectedItem?.quantity || 0}</span>
                                                <button 
                                                    onClick={() => {
                                                        if (selectedItem) {
                                                            setFormData({...formData, selectedItems: formData.selectedItems.map(i => i.id === item.id ? {...i, quantity: (i.quantity || 1) + 1} : i)});
                                                        } else {
                                                            setFormData({...formData, selectedItems: [...formData.selectedItems, {...item, quantity: 1}]});
                                                        }
                                                        if (!isCustomizing) setIsCustomizing(true);
                                                    }}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-fit sticky top-32">
                        <h3 className="text-2xl font-playfair font-bold mb-6">Current Selection</h3>
                        <div className="space-y-4 mb-8">
                        {formData.selectedItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-400">{item.name} x {item.quantity}</span>
                                <span className="text-white font-semibold">AED {(item.base_price * (item.quantity || 1) * formData.guests / 10).toFixed(0)}</span>
                            </div>
                        ))}
                        {formData.selectedItems.length === 0 && <p className="text-gray-500 italic text-sm">No dishes added yet.</p>}
                        </div>
                        <div className="bg-tan/10 p-4 rounded-xl border border-tan/20 flex flex-col gap-2">
                        <div className="text-xs font-bold uppercase tracking-tighter text-tan">Weight Estimate</div>
                        <div className="text-lg font-bold">~{((formData.guests / 10) * formData.selectedItems.reduce((acc, i) => acc + (i.quantity || 1), 0) * 0.1).toFixed(1)} kg Total Food</div>
                        </div>
                    </div>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div>
              <h2 className="text-4xl font-playfair font-bold mb-8 text-tan">Contact & Delivery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Full Name *</label>
                  <input 
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                      errors.includes('name') || errors.includes('name_format') ? 'border-red-500' : 'border-white/10'
                    }`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {errors.includes('name_format') && <p className="text-red-500 text-xs mt-1">Name should only contain letters and spaces</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Mobile Number *</label>
                  <input 
                    type="tel"
                    placeholder="054 -- --- ----"
                    className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                      errors.includes('mobile') || errors.includes('mobile_format') ? 'border-red-500' : 'border-white/10'
                    }`}
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                   {errors.includes('mobile_format') && <p className="text-red-500 text-xs mt-1">Mobile number should only contain digits</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Email Address *</label>
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                      errors.includes('email') || errors.includes('email_format') ? 'border-red-500' : 'border-white/10'
                    }`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.includes('email_format') && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Flat / Villa No *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Villa 12 or Apt 402"
                      className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                        errors.includes('address_flat') ? 'border-red-500' : 'border-white/10'
                      }`}
                      value={formData.address.flatVilla}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, flatVilla: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Street Name *</label>
                    <input 
                      type="text"
                      placeholder="Enter street name"
                      className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                        errors.includes('address_street') ? 'border-red-500' : 'border-white/10'
                      }`}
                      value={formData.address.street}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Area / Community *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Marina, Al Barsha..."
                      className={`w-full bg-white/5 border p-4 rounded-xl focus:border-tan outline-none transition-colors ${
                        errors.includes('address_area') ? 'border-red-500' : 'border-white/10'
                      }`}
                      value={formData.address.area}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, area: e.target.value}})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 font-bold uppercase text-xs tracking-widest">Landmark (Optional)</label>
                    <input 
                      type="text"
                      placeholder="Near which building/park?"
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-tan outline-none transition-colors"
                      value={formData.address.landmark}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, landmark: e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-20">
              <Check className="mx-auto mb-4 text-tan" size={48} />
              <h2 className="text-4xl font-playfair font-bold mb-4">Review Your Booking</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-12">Please review your selections and event details before proceeding to payment.</p>
              
              <div className="glass-card p-8 max-w-2xl mx-auto text-left">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Venue</div>
                    <div className="font-bold">{formData.venue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Date</div>
                    <div className="font-bold">{formData.date || 'TBD'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Guests</div>
                    <div className="font-bold">{formData.guests}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Occasion</div>
                    <div className="font-bold">{formData.occasion}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Service Type</div>
                    <div className="font-bold">{formData.serviceType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Preference</div>
                    <div className="font-bold">{formData.foodPreference}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-gray-500 uppercase mb-1">Customer Details</div>
                    <div className="font-bold">{formData.name}</div>
                    <p className="text-sm text-gray-400">{formData.email} | {formData.mobile}</p>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-xs text-gray-500 uppercase mb-1">Delivery Address</div>
                    <div className="font-bold text-sm">
                      {formData.address.flatVilla}, {formData.address.street}, {formData.address.area}
                      {formData.address.landmark && <span className="block text-xs font-normal text-gray-400 mt-1">Landmark: {formData.address.landmark}</span>}
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="text-xs text-gray-500 uppercase mb-4">Selected Menu</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedItems.map((item: MenuItem) => (
                      <span key={item.id} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm">{item.name}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">Total Amount</div>
                    <div className="text-4xl font-playfair font-bold text-tan">AED {(calculateTotalPrice() * 1.05).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Includes 5% VAT</div>
                  </div>
                  <button onClick={handleCompleteBooking} className="bg-tan text-richBlack px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">
                    Checkout & Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-12">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
            currentStep === 0 ? 'opacity-0' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          onClick={nextStep}
          className="flex items-center gap-2 bg-tan text-richBlack px-8 py-4 rounded-full font-bold hover:scale-105 transition-all"
        >
          {currentStep === steps.length - 1 ? 'Complete Booking' : 'Continue'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;
