import { useState, useEffect } from 'react';
import { ShoppingBag, PhoneCall } from 'lucide-react';

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
      const res = await fetch('http://localhost:5000/api/available-dates');
      const data = await res.json();
      setAvailableDates(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPackItems = async (id: number, type: string, pkg: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/meal-box-menu?type=${type}&package=${pkg}`);
      if (res.ok) {
        const data = await res.json();
        setPackItems(prev => ({ ...prev, [id]: data.items.map((i: any) => ({ name: i.itemId.name, dietary_tag: i.itemId.dietary_tag || 'Mixed' })) }));
      } else {
        setPackItems(prev => ({ ...prev, [id]: [] }));
      }
    } catch (err) {
      console.error(err);
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

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setIsQuickOrderOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Error placing order');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-playfair font-bold mb-4">Meal <span className="text-tan">Packs</span></h1>
        <p className="text-gray-400">Chef-curated boxes for every occasion. Delivered fresh.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {mealPacksData.map((pack) => {
          const currentPackage = selectedPackages[pack.id];
          const currentPrice = pack.prices[currentPackage];

          return (
            <div key={pack.id} className="glass-card overflow-hidden transition-all hover:scale-[1.02] flex flex-col">
              <div className="h-64 relative">
                <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-tan text-richBlack px-3 py-1 rounded-full text-xs font-bold">
                  {pack.type.toUpperCase()}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-playfair font-bold">{pack.name}</h3>
                  <div className="text-tan font-bold text-xl">AED {currentPrice}</div>
                </div>

                {/* Package Selector */}
                <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                  {(['Standard', 'Premium', 'Elite'] as PackageType[]).map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() => handlePackageChange(pack.id, pkg)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        currentPackage === pkg 
                          ? 'bg-tan text-richBlack scale-105 shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {pkg}
                    </button>
                  ))}
                </div>

                {/* Food Preference Selector */}
                <div className="flex bg-white/5 rounded-lg p-1 mb-6">
                  {(['Veg', 'Non-Veg', 'Mixed'] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setSelectedFoodPrefs(prev => ({ ...prev, [pack.id]: pref }))}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        selectedFoodPrefs[pack.id] === pref 
                          ? 'bg-tan text-richBlack scale-105 shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        pref === 'Veg' ? 'bg-green-600' : pref === 'Non-Veg' ? 'bg-red-600' : 'bg-yellow-600'
                      } ${selectedFoodPrefs[pack.id] === pref ? 'shadow-[0_0_4px_currentColor]' : ''}`} />
                      {pref}
                    </button>
                  ))}
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {(() => {
                    const pref = selectedFoodPrefs[pack.id];
                    const filtered = packItems[pack.id]?.filter(item => {
                      if (pref === 'Mixed') return true;
                      return item.dietary_tag === pref;
                    }) || [];
                    return filtered.length > 0 ? (
                      filtered.map((item) => (
                        <li key={item.name} className="text-sm text-gray-400 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.dietary_tag === 'Veg' ? 'bg-green-500' : item.dietary_tag === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          {item.name}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 italic">
                        {packItems[pack.id]?.length > 0 ? `No ${pref} items in this pack` : 'No items configured in admin'}
                      </li>
                    );
                  })()}
                  {currentPackage === 'Premium' && packItems[pack.id]?.length > 0 && (
                    <li className="text-sm text-tan flex items-center gap-2 font-semibold">
                      <div className="w-1.5 h-1.5 bg-tan rounded-full" /> + Premium Add-On
                    </li>
                  )}
                  {currentPackage === 'Elite' && (
                    <li className="text-sm text-tan flex items-center gap-2 font-semibold">
                      <div className="w-1.5 h-1.5 bg-tan rounded-full" /> + Elite Add-On & Drink
                    </li>
                  )}
                </ul>

                <button 
                  onClick={() => handleQuickOrderClick(pack)}
                  className="w-full bg-white/5 border border-white/10 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-tan hover:text-richBlack transition-all mt-auto"
                >
                  <ShoppingBag size={18} /> Quick Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Daily Option Section */}
      <div className="glass-card p-10 md:p-16 text-center max-w-4xl mx-auto flex flex-col items-center border-tan/20">
        <h2 className="text-4xl font-playfair font-bold mb-4">Need Reliable Daily Corporate Catering?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
          We provide consistent, high-quality daily meal services tailored to your team’s needs. Flexible menus, on-time delivery, and cost-effective plans designed for long-term partnerships.
        </p>
        <button className="bg-tan text-richBlack px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <PhoneCall size={20} />
          Contact us today for customized bulk pricing
        </button>
      </div>

      {/* Quick Order Modal */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-[1100] flex items-start md:items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto pt-32 md:pt-4">
          <div className="glass-card p-8 md:p-12 max-w-md w-full border-tan/30 relative my-8 shadow-2xl">
            <button 
              onClick={() => setIsQuickOrderOpen(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-3xl font-playfair font-bold mb-2">Quick Order</h3>
            <p className="text-gray-400 mb-6">{selectedPackForOrder?.name}</p>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-400 mb-2 text-[10px] uppercase tracking-widest font-bold">Delivery Date</label>
                  <select 
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan transition-colors text-white text-sm ${
                        errors.includes('date') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.date}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, date: e.target.value});
                        setErrors(errors.filter(err => err !== 'date'));
                    }}
                  >
                    <option value="" className="bg-[#0A0A0A]">Select Date</option>
                    {availableDates
                      .filter(d => {
                        const dateObj = new Date(d.date);
                        const today = new Date();
                        const diffHrs = (dateObj.getTime() - today.getTime()) / (1000 * 60 * 60);
                        return diffHrs >= 24;
                      })
                      .map(d => (
                        <option key={d._id} value={d.date.split('T')[0]} className="bg-[#0A0A0A]">
                          {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </option>
                      ))
                    }
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-400 mb-2 text-[10px] uppercase tracking-widest font-bold">Quantity (Min 5)</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuickOrderData({...quickOrderData, quantity: Math.max(5, quickOrderData.quantity - 1)})}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-white/5 border border-white/10 p-2 rounded-lg text-center font-bold">
                      {quickOrderData.quantity}
                    </div>
                    <button 
                      onClick={() => setQuickOrderData({...quickOrderData, quantity: quickOrderData.quantity + 1})}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-2 pt-4 border-t border-white/5">
                  <h4 className="text-tan text-xs uppercase font-bold tracking-widest mb-4">Contact Details</h4>
                </div>

                <div className="col-span-2">
                  <input 
                    type="text"
                    placeholder="Full Name"
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan text-sm transition-all ${
                        errors.includes('name') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.name}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, name: e.target.value});
                        setErrors(errors.filter(err => err !== 'name'));
                    }}
                  />
                </div>
                <div>
                  <input 
                    type="tel"
                    placeholder="Mobile"
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan text-sm transition-all ${
                        errors.includes('mobile') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.mobile}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, mobile: e.target.value});
                        setErrors(errors.filter(err => err !== 'mobile'));
                    }}
                  />
                </div>
                <div>
                  <input 
                    type="email"
                    placeholder="Email"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-tan text-sm"
                    value={quickOrderData.email}
                    onChange={(e) => setQuickOrderData({...quickOrderData, email: e.target.value})}
                  />
                </div>

                <div className="col-span-2 pt-2">
                  <h4 className="text-tan text-xs uppercase font-bold tracking-widest mb-4">Delivery Address</h4>
                </div>

                <div>
                  <input 
                    type="text"
                    placeholder="Villa / Flat No"
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan text-sm transition-all ${
                        errors.includes('flatVilla') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.flatVilla}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, flatVilla: e.target.value});
                        setErrors(errors.filter(err => err !== 'flatVilla'));
                    }}
                  />
                </div>
                <div>
                  <input 
                    type="text"
                    placeholder="Street Name"
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan text-sm transition-all ${
                        errors.includes('street') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.street}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, street: e.target.value});
                        setErrors(errors.filter(err => err !== 'street'));
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    type="text"
                    placeholder="Area / Community"
                    className={`w-full bg-white/5 border p-3 rounded-lg outline-none focus:border-tan text-sm transition-all ${
                        errors.includes('area') ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/10'
                    }`}
                    value={quickOrderData.area}
                    onChange={(e) => {
                        setQuickOrderData({...quickOrderData, area: e.target.value});
                        setErrors(errors.filter(err => err !== 'area'));
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    type="text"
                    placeholder="Landmark (Optional)"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none focus:border-tan text-sm"
                    value={quickOrderData.landmark}
                    onChange={(e) => setQuickOrderData({...quickOrderData, landmark: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Total Price</span>
                  <span className="text-2xl font-bold text-white">
                    AED {selectedPackForOrder?.prices?.[selectedPackages?.[selectedPackForOrder?.id]] * quickOrderData.quantity}
                  </span>
                </div>
                <button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-tan text-richBlack py-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg text-lg"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPacks;
