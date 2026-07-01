import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Info, Sparkles, Star, Loader2, ShieldCheck, ChefHat } from 'lucide-react';
import { formatAED } from '../utils/currency';
import SuccessModal from '../components/SuccessModal';
import { toast } from '../components/Toast';
import Calendar from '../components/Calendar';

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

const steps = ['Plan', 'Details'];
const packageOptions = [
  { name: 'Standard', price: 120, description: 'Balanced selections for relaxed gatherings and everyday celebrations.' },
  { name: 'Premium', price: 180, description: 'Elevated menu variety with refined presentation for special events.' },
  { name: 'Signature', price: 250, description: 'Chef-led premium experience for high-impact occasions.' },
];

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
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successReferenceId, setSuccessReferenceId] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBookingData = async () => {
      setIsDataLoading(true);
      try {
        const [datesResponse, menuResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/available-dates`),
          fetch(`${API_BASE_URL}/api/menu`)
        ]);

        if (!datesResponse.ok || !menuResponse.ok) {
          throw new Error('Failed to load booking data');
        }

        const datesData = await datesResponse.json();
        const menuData = await menuResponse.json();

        if (!isMounted) return;

        setAvailableDates(datesData);
        const mapped = menuData.map((d: any) => ({
          ...d,
          id: d._id,
          dietary: d.dietary_tag,
          weight_ratio: d.weight_ratio_per_10_guests,
          packages: d.packages || [],
          occasions: d.occasions || [],
          is_active: d.is_active !== undefined ? d.is_active : true
        }));
        setMenuItems(mapped);
      } catch {
        if (isMounted) {
          toast.error('Booking details are still loading. Please refresh if needed.');
        }
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    };

    loadBookingData();
    return () => {
      isMounted = false;
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const [bookingPromptStep, setBookingPromptStep] = useState(0);
  const [formData, setFormData] = useState<IFormData>({
    name: localStorage.getItem('leadName') || '',
    mobile: localStorage.getItem('leadMobile') || '',
    venue: 'Dubai',
    date: '',
    guests: 10,
    package: '',
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
  const [isMenuChoiceOpen, setIsMenuChoiceOpen] = useState(false);
  const [isMenuCustomizerOpen, setIsMenuCustomizerOpen] = useState(false);
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

  const totalEstimate = useMemo(() => calculateTotalPrice() * 1.05, [calculateTotalPrice, formData.guests, formData.package, formData.selectedItems, isCustomizing]);
  const selectedMenuCount = useMemo(() => formData.selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0), [formData.selectedItems]);

  const confirmReplacement = (newItem: MenuItem) => {
    if (!itemToReplace) return;
    setFormData(prev => ({
        ...prev,
        selectedItems: prev.selectedItems.map(i => i.id === itemToReplace.id ? { ...newItem, quantity: 1 } : i)
    }));
    setIsReplaceModalOpen(false);
    setItemToReplace(null);
    toast.success(`Replaced with ${newItem.name}`);
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

  const openBookingPrompt = () => {
    setBookingPromptStep(0);
    setShowBookingPrompt(true);
  };

  const goToNextBookingPrompt = () => {
    if (bookingPromptStep === 0) {
      if (!formData.venue) {
        toast.error('Please choose a venue');
        return;
      }
      if (!formData.guests || formData.guests < 10) {
        toast.error('Please choose at least 10 guests');
        return;
      }
      setBookingPromptStep(1);
      return;
    }

    if (bookingPromptStep === 1) {
      if (!formData.date) {
        toast.error('Please pick a date');
        return;
      }
      if (!formData.occasion) {
        toast.error('Please select an occasion');
        return;
      }
      setBookingPromptStep(2);
      return;
    }

    if (bookingPromptStep === 2) {
      if (!formData.serviceType) {
        toast.error('Please select a service type');
        return;
      }
      if (!formData.foodPreference) {
        toast.error('Please select a food preference');
        return;
      }
      if (!formData.package) {
        toast.error('Please choose a package first');
        return;
      }
      setShowBookingPrompt(false);
      setIsMenuChoiceOpen(true);
      return;
    }

    setShowBookingPrompt(false);
    setIsMenuChoiceOpen(true);
  };

  const handleContinue = () => {
    nextStep();
  };

  const nextStep = () => {
    const newErrors: string[] = [];
    
    if (currentStep === 0) {
      if (!formData.date) newErrors.push('date');
      if (!formData.venue) newErrors.push('venue');
      if (!formData.guests || formData.guests < 10) newErrors.push('guests');
      if (!formData.occasion) newErrors.push('occasion');
      if (!formData.serviceType) newErrors.push('serviceType');
      if (!formData.foodPreference) newErrors.push('foodPreference');
      if (!formData.package) newErrors.push('package');
    } else if (currentStep === 1) {
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
      toast.error('Please resolve validation errors to proceed');
      return;
    }

    setErrors([]);
    setCurrentStep((prev: number) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep((prev: number) => Math.max(prev - 1, 0));

  const handleCompleteBooking = async () => {
    const finalErrors: string[] = [];
    
    if (!formData.date) finalErrors.push('date');
    if (!formData.venue) finalErrors.push('venue');
    if (!formData.guests || formData.guests < 10) finalErrors.push('guests');
    if (!formData.occasion) finalErrors.push('occasion');
    if (!formData.serviceType) finalErrors.push('serviceType');
    
    if (!formData.package) finalErrors.push('package');
    
    if (!formData.name.trim()) finalErrors.push('name');
    if (!formData.mobile.trim()) finalErrors.push('mobile');
    if (!formData.email.trim()) finalErrors.push('email');
    if (!formData.address.flatVilla.trim()) finalErrors.push('address_flat');
    if (!formData.address.street.trim()) finalErrors.push('address_street');
    if (!formData.address.area.trim()) finalErrors.push('address_area');

    if (finalErrors.length > 0) {
      setErrors(finalErrors);
      if (['date', 'venue', 'guests', 'occasion', 'serviceType'].some(e => finalErrors.includes(e))) setCurrentStep(0);
      else if (finalErrors.includes('package')) setCurrentStep(0);
      else setCurrentStep(1);
      scrollToError();
      toast.error('Required fields are missing or invalid');
      return;
    }

    try {
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
        userId: '60d0fe4f5311236168a109ca',
        eventDetails: {
          venue: formData.venue,
          date: formData.date,
          guestCount: formData.guests,
          occasion: formData.occasion,
          foodPreference: formData.foodPreference,
          serviceType: formData.serviceType
        },
        packageId: '60d0fe4f5311236168a109ca',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        setSuccessReferenceId(orderPayload.orderId);
        setSuccessMessage(`We will review your request and contact you within 24 hours at ${formData.mobile} to finalize the details and confirm the booking.`);
        setSuccessModalOpen(true);
      } else {
        toast.error('Failed to register catering booking');
      }
    } catch (err) {
      toast.error('Network failure completing checkouts');
    }
  };

  const handleModalClose = () => {
    setSuccessModalOpen(false);
    window.location.href = '#/';
  };

  const [showInclusionPopup, setShowInclusionPopup] = useState(false);

  return (
    <div className="min-h-screen w-full px-3 pb-10 pt-4 sm:px-4 sm:pt-6 lg:px-6 lg:pt-8 max-w-6xl mx-auto relative animate-fade-in">
      <AnimatePresence>
        {isReplaceModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setIsReplaceModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-2xl p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold font-playfair text-white">Replace {itemToReplace?.category} Selection</h3>
                  <p className="text-xs text-gray-400 mt-1">Swap your current choice with another available option.</p>
                </div>
                <button onClick={() => setIsReplaceModalOpen(false)} className="text-gray-500 hover:text-white p-1">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems
                  .filter(i => i.is_active && i.category === itemToReplace?.category)
                  .filter(i => !i.packages || i.packages.length === 0 || i.packages.includes(formData.package))
                  .map(item => (
                    <div
                      key={item.id}
                      onClick={() => confirmReplacement(item)}
                      className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-tan hover:bg-white/10 cursor-pointer transition-all flex items-center gap-3"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.dietary === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-semibold text-sm text-gray-200">{item.name}</span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuCustomizerOpen && (
          <div className="modal-overlay" style={{ zIndex: 9995 }} onClick={() => setIsMenuCustomizerOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-3xl p-6 sm:p-8 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold font-playfair text-white">Customize your menu</h3>
                  <p className="mt-1 text-sm text-gray-400">Adjust portions, review weight and price impact, and continue when you are happy.</p>
                </div>
                <button onClick={() => setIsMenuCustomizerOpen(false)} className="rounded-full border border-white/10 p-2 text-gray-400 transition-colors hover:text-white">✕</button>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] h-[60vh]">
                <div className="space-y-3 overflow-y-auto pr-2">
                  {Array.from(new Set(menuItems.map(i => i.category))).map(cat => (
                    <div key={cat} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">{cat}</h4>
                      <div className="mt-3 space-y-2">
                        {menuItems.filter(i => i.is_active).filter(i => !i.packages || i.packages.length === 0 || i.packages.includes(formData.package)).filter(i => i.category === cat).filter(i => formData.foodPreference === 'Mixed' ? true : i.dietary === formData.foodPreference).map(item => {
                          const selectedItem = formData.selectedItems.find((si: MenuItem) => si.id === item.id);
                          const quantity = selectedItem?.quantity || 0;
                          return (
                            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                <p className="mt-1 text-[11px] text-gray-400">{formatAED(item.base_price)} / portion • {item.weight_ratio}kg per 10 guests</p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-tan">{item.dietary}</p>
                              </div>
                              <div className="flex items-center gap-2 rounded-lg bg-white/5 p-1">
                                <button type="button" onClick={() => { const current = selectedItem?.quantity || 0; if (current <= 1) { setFormData({ ...formData, selectedItems: formData.selectedItems.filter(i => i.id !== item.id) }); if (!isCustomizing) setIsCustomizing(true); } else { setFormData({ ...formData, selectedItems: formData.selectedItems.map(i => i.id === item.id ? { ...i, quantity: current - 1 } : i) }); if (!isCustomizing) setIsCustomizing(true); } }} className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-lg font-bold text-white">−</button>
                                <span className="w-5 text-center text-sm font-semibold text-white">{quantity}</span>
                                <button type="button" onClick={() => { if (selectedItem) { setFormData({ ...formData, selectedItems: formData.selectedItems.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i) }); } else { setFormData({ ...formData, selectedItems: [...formData.selectedItems, { ...item, quantity: 1 }] }); } if (!isCustomizing) setIsCustomizing(true); }} className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-lg font-bold text-white">+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 h-fit sticky top-0 flex flex-col max-h-full">
                  <div className="flex-1 overflow-y-auto pr-2">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-tan">Selected menu</h4>
                  <div className="mt-4 space-y-3 text-sm">
                    {formData.selectedItems.length > 0 ? formData.selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-[11px] text-gray-400">x{item.quantity || 1}</p>
                        </div>
                        <p className="font-semibold text-white">{formatAED((item.base_price || 0) * (item.quantity || 1) * formData.guests / 10)}</p>
                      </div>
                    )) : <p className="text-sm text-gray-500">Pick one or more dishes to build your menu.</p>}
                  </div>
                  </div>
                  <div className="mt-5 rounded-xl border border-tan/20 bg-tan/10 p-4 shrink-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-tan">Estimated menu weight</p>
                    <p className="mt-2 text-xl font-bold text-white">~{((formData.guests / 10) * formData.selectedItems.reduce((acc, i) => acc + (i.weight_ratio || 1) * (i.quantity || 1), 0)).toFixed(1)} kg</p>
                    <p className="mt-1 text-xs text-gray-400">This helps us tailor portions for your guest count.</p>
                  </div>
                  <button type="button" onClick={() => { if (formData.selectedItems.length === 0) { toast.error('Choose at least one item before continuing'); return; } setIsMenuCustomizerOpen(false); setIsCustomizing(true); setCurrentStep(1); }} className="mt-5 w-full rounded-xl bg-tan px-4 py-3 text-sm font-semibold text-richBlack transition-colors hover:bg-tan/90 shrink-0">Confirm menu & continue</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuChoiceOpen && (
          <div className="modal-overlay" style={{ zIndex: 9995 }} onClick={() => setIsMenuChoiceOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-md p-6 sm:p-8 text-center max-h-[90dvh] overflow-y-auto"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-tan/20 bg-tan/10">
                <ChefHat className="text-tan" size={24} />
              </div>
              <h3 className="mt-4 text-2xl font-bold font-playfair text-white">Continue with this menu?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">Choose to customize the menu or keep the default selection for this package and move on to your details.</p>
              <div className="mt-6 flex flex-col gap-3">
                <button type="button" onClick={() => { setIsMenuChoiceOpen(false); setIsMenuCustomizerOpen(true); }} className="rounded-xl bg-tan px-4 py-3 text-sm font-semibold text-richBlack transition-colors hover:bg-tan/90">Customize menu</button>
                <button type="button" onClick={() => { setIsMenuChoiceOpen(false); setIsCustomizing(false); setCurrentStep(1); }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">Keep default and continue</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInclusionPopup && (
          <div className="modal-overlay" style={{ zIndex: 9994 }} onClick={() => setShowInclusionPopup(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-md p-8 text-center"
            >
              <div className="bg-tan/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-tan/20">
                <Info className="text-tan" size={24} />
              </div>
              <h3 className="text-2xl font-bold font-playfair text-white mb-2">Standard Inclusions</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                For standard delivery catering, premium disposable cutlery, napkins, and serving spoons are included at no extra cost.
              </p>
              <button onClick={() => setShowInclusionPopup(false)} className="w-full btn btn-primary py-3.5 rounded-xl cursor-pointer">
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingPrompt && (
          <div className="modal-overlay" style={{ zIndex: 9996 }} onClick={() => setShowBookingPrompt(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-2xl p-6 sm:p-8 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-tan">Booking prompt {bookingPromptStep + 1} / 3</p>
                  <h3 className="mt-2 text-2xl font-playfair font-bold text-white">
                    {bookingPromptStep === 0 && 'Where and how many?'}
                    {bookingPromptStep === 1 && 'When and for what?'}
                    {bookingPromptStep === 2 && 'How would you like it served?'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300">
                    {bookingPromptStep === 0 && 'Choose your service area and guest count to begin the booking.'}
                    {bookingPromptStep === 1 && 'Select a date and event style to tailor your booking.'}
                    {bookingPromptStep === 2 && 'Choose the service style, package, and food preference that fits your event.'}
                  </p>
                </div>
                <button type="button" onClick={() => setShowBookingPrompt(false)} className="rounded-full border border-white/10 p-2 text-gray-400 transition-colors hover:text-white">✕</button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                {bookingPromptStep === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Venue</label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {['Dubai', 'Sharjah'].map(option => (
                          <button key={option} type="button" onClick={() => setFormData(prev => ({ ...prev, venue: option }))} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${formData.venue === option ? 'border-tan bg-tan/10 text-tan' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Guest count</label>
                      <input type="number" min="10" step="10" value={formData.guests} onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) || 10 }))} className="input-field" />
                      <p className="text-xs text-gray-500">Minimum booking size is 10 guests.</p>
                    </div>
                  </div>
                )}

                {bookingPromptStep === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Preferred date</label>
                      <div className="w-full">
                        <Calendar 
                          availableDates={availableDates.map(d => d.date)} 
                          selectedDate={formData.date} 
                          onSelect={(d) => setFormData(prev => ({ ...prev, date: d }))} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Occasion</label>
                      <select value={formData.occasion} onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))} className="input-field">
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Private Gathering">Private Gathering</option>
                      </select>
                    </div>
                  </div>
                )}

                {bookingPromptStep === 2 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Service style</label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {(['Delivery', 'Delivery + Service', 'Buffet'] as const).map(option => (
                          <button key={option} type="button" onClick={() => setFormData(prev => ({ ...prev, serviceType: option }))} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${formData.serviceType === option ? 'border-tan bg-tan/10 text-tan' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Food preference</label>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {(['Veg', 'Non-Veg', 'Mixed'] as const).map(option => (
                          <button key={option} type="button" onClick={() => setFormData(prev => ({ ...prev, foodPreference: option }))} className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${formData.foodPreference === option ? 'border-tan bg-tan/10 text-tan' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                            {formData.foodPreference === option && <Check size={14} />} {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Package</label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {packageOptions.map(option => (
                          <button key={option.name} type="button" onClick={() => setFormData(prev => ({ ...prev, package: option.name }))} className={`rounded-2xl border px-3 py-3 text-left transition-all ${formData.package === option.name ? 'border-tan bg-tan/10 text-tan' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold">{option.name}</span>
                              <span className="text-[11px] font-semibold text-tan">AED {option.price}/guest</span>
                            </div>
                            <p className="mt-2 text-[11px] leading-5 text-gray-400">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-tan">Available menu preview</p>
                        <p className="text-[11px] text-gray-400">{formData.package ? `${formData.package} package` : 'Select a package'}</p>
                      </div>
                      <div className="mt-3 space-y-2">
                        {formData.selectedItems.length > 0 ? formData.selectedItems.slice(0, 4).map(item => (
                          <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                            <div>
                              <p className="text-sm font-semibold text-white">{item.name}</p>
                              <p className="text-[11px] text-gray-400">{item.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-tan">x{item.quantity || 1}</p>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemToReplace(item); setIsReplaceModalOpen(true); }} className="text-[10px] text-gray-400 hover:text-tan underline ml-2">Replace</button>
                            </div>
                          </div>
                        )) : <p className="text-sm text-gray-500">The suggested menu will appear here once your package is selected.</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button type="button" onClick={() => bookingPromptStep > 0 ? setBookingPromptStep(prev => prev - 1) : setShowBookingPrompt(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                  {bookingPromptStep > 0 ? 'Back' : 'Cancel'}
                </button>
                <button type="button" onClick={goToNextBookingPrompt} className="rounded-xl bg-tan px-4 py-2.5 text-sm font-semibold text-richBlack transition-colors hover:bg-tan/90">
                  {bookingPromptStep === 2 ? 'Continue to menu' : 'Next'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(201,160,92,0.18),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.06),_transparent_55%),#2D0000] p-5 sm:p-7 lg:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-tan/20 bg-tan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-tan">
              <Sparkles size={12} /> Curated catering in just three simple steps
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-playfair font-bold text-white">Plan your event with clarity and confidence.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300">
              The booking flow is now simplified so you can move from ideas to a polished catering request without the usual friction.
            </p>
          </div>
          <div className="rounded-2xl border border-tan/20 bg-black/20 p-4 min-w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Estimated total</p>
            <div className="mt-2 text-3xl font-bold text-tan">{formatAED(totalEstimate)}</div>
            <p className="mt-1 text-xs text-gray-400">For {formData.guests} guests • {selectedMenuCount} selected portions</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <button key={step} type="button" onClick={() => setCurrentStep(index)} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all ${isActive ? 'border-tan bg-tan/10 text-tan' : isPast ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-black/10 text-gray-300'}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${isActive ? 'bg-tan text-richBlack' : 'bg-white/10 text-white'}`}>
                    {isPast ? <Check size={12} /> : index + 1}
                  </span>
                  {step}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="rounded-[28px] border border-white/10 bg-[#2D0000] p-5 sm:p-8 shadow-2xl"
          >
            {isDataLoading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-tan" />
                <div>
                  <h3 className="text-xl font-playfair font-semibold text-white">Preparing your booking experience</h3>
                  <p className="mt-2 text-sm text-gray-400">We are loading the latest menu and availability options for you.</p>
                </div>
              </div>
            ) : currentStep === 0 ? (
              <div className="space-y-7">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-white">Plan your booking</h2>
                    <p className="text-sm text-gray-400">We will guide you through the details one prompt at a time.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Step 1 of 2</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <h3 className="text-lg font-playfair font-semibold text-white">Start with the essentials</h3>
                  <p className="mt-2 text-sm text-gray-400">Each selection opens a small popup so the booking feels simple and calm.</p>
                  <button type="button" onClick={openBookingPrompt} className="mt-5 rounded-xl bg-tan px-5 py-3 text-sm font-semibold text-richBlack transition-colors hover:bg-tan/90">Start booking</button>
                </div>
              </div>
            ) : currentStep === 1 ? (
              <div className="space-y-7">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-white">Contact details</h2>
                    <p className="text-sm text-gray-400">Share your details so the team can confirm everything smoothly.</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Step 2 of 3</div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Full name</label>
                    <input type="text" placeholder="Enter full name" className={`input-field ${errors.includes('name') || errors.includes('name_format') ? 'border-red-500' : ''}`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    {errors.includes('name_format') && <p className="text-red-500 text-[10px] mt-1">Name can only contain alphabet characters</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Mobile number</label>
                    <input type="tel" placeholder="054 -- --- ----" className={`input-field ${errors.includes('mobile') || errors.includes('mobile_format') ? 'border-red-500' : ''}`} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                    {errors.includes('mobile_format') && <p className="text-red-500 text-[10px] mt-1">Mobile number can only contain digits</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Email address</label>
                    <input type="email" placeholder="name@email.com" className={`input-field ${errors.includes('email') || errors.includes('email_format') ? 'border-red-500' : ''}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.includes('email_format') && <p className="text-red-500 text-[10px] mt-1">Valid email format required</p>}
                  </div>

                  <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-tan">Delivery address</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Villa / flat no</label>
                        <input type="text" placeholder="Villa 12 or Apt 402" className={`input-field ${errors.includes('address_flat') ? 'border-red-500' : ''}`} value={formData.address.flatVilla} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, flatVilla: e.target.value } })} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Street name</label>
                        <input type="text" placeholder="Enter street name" className={`input-field ${errors.includes('address_street') ? 'border-red-500' : ''}`} value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Area / community</label>
                        <input type="text" placeholder="Marina, Al Barsha" className={`input-field ${errors.includes('address_area') ? 'border-red-500' : ''}`} value={formData.address.area} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, area: e.target.value } })} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 ml-1">Landmark</label>
                        <input type="text" placeholder="Near building or park" className="input-field" value={formData.address.landmark} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, landmark: e.target.value } })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-2 text-tan">
                    <Star size={16} />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">Ready to confirm</h3>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Service</p>
                      <p className="mt-1 text-sm font-semibold text-white">{formData.serviceType}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Package</p>
                      <p className="mt-1 text-sm font-semibold text-white">{formData.package}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Final estimate</p>
                      <p className="text-2xl font-bold text-tan">{formatAED(totalEstimate)}</p>
                    </div>
                    <button onClick={handleCompleteBooking} className="btn btn-primary px-7 py-3.5 rounded-xl cursor-pointer">Submit booking request</button>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-[#2D0000] p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-tan">
              <ShieldCheck size={16} />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">Your booking summary</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Date</p>
                <p className="mt-1 text-white">{formData.date ? new Date(formData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Choose a date'}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Guests</p>
                <p className="mt-1 text-white">{formData.guests} people</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Package</p>
                <p className="mt-1 text-white">{formData.package}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Service</p>
                <p className="mt-1 text-white">{formData.serviceType}</p>
              </div>
              <div className="rounded-xl border border-tan/20 bg-tan/10 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-tan">Next step</p>
                <p className="mt-1 text-sm text-white">We review your request and confirm the final details within one business day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {currentStep === 0 ? (
          <button onClick={openBookingPrompt} className="flex items-center justify-center gap-2 btn btn-primary px-6 py-3.5 rounded-xl text-xs font-semibold">
            Start booking <ChevronRight size={16} />
          </button>
        ) : (
          <>
            <button onClick={prevStep} className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-semibold transition-all btn btn-secondary">
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={currentStep === steps.length - 1 ? handleCompleteBooking : handleContinue} className="flex items-center justify-center gap-2 btn btn-primary px-6 py-3.5 rounded-xl text-xs font-semibold">
              {currentStep === steps.length - 1 ? 'Submit booking request' : 'Continue'} <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <SuccessModal 
        isOpen={successModalOpen} 
        title="Booking Request Submitted" 
        message={successMessage} 
        referenceId={successReferenceId}
        onClose={handleModalClose}
        actionLabel="View Dashboard"
        onAction={() => window.location.href = '#/account'}
      >
        <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-gray-300 space-y-2">
            <p className="flex justify-between border-b border-white/5 pb-1 mb-1">
              <span>Date</span>
              <span className="font-semibold text-white">{new Date(formData.date).toLocaleDateString()}</span>
            </p>
            <p className="flex justify-between border-b border-white/5 pb-1 mb-1">
              <span>Guests</span>
              <span className="font-semibold text-white">{formData.guests}</span>
            </p>
            <p className="flex justify-between">
              <span>Estimated Total</span>
              <span className="font-semibold text-tan">{formatAED(totalEstimate)}</span>
            </p>
        </div>
      </SuccessModal>
    </div>
  );
};

export default BookingFlow;
