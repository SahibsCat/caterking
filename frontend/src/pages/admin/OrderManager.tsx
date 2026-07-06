import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

import { User as UserIcon, Calendar, MapPin, Info, FileSpreadsheet, ChevronDown, ChevronUp, Share2, Map } from 'lucide-react';
import { formatAED } from '../../utils/currency';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from '../../components/Toast';

interface Order {
  _id: string;
  orderId: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress: {
      flatVilla: string;
      street: string;
      area: string;
      landmark?: string;
    };
  };
  eventDetails: {
    guestCount: number;
    date: string;
    venue: string;
    occasion: string;
    foodPreference?: 'Veg' | 'Non-Veg' | 'Mixed';
  };
  pricing: {
    total: number;
  };
  status: 'pending' | 'confirmed' | 'unfulfilled' | 'preparing delivery' | 'delivery' | 'fulfilled' | 'cancelled';
  paymentIntentId?: string;
  selectedMenu?: {
    itemId: string;
    name: string;
    category: string;
    calculatedWeight: number;
  }[];
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  // Custom Confirmation Modals State
  const [confirmStatusChange, setConfirmStatusChange] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = `${API_BASE_URL}/api/admin/orders`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      toast.error('Failed to fetch orders list');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrders(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStatusChangeRequest = (id: string, status: string) => {
    setConfirmStatusChange({ id, status });
  };

  const executeStatusChange = async () => {
    if (!confirmStatusChange) return;
    const { id, status } = confirmStatusChange;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        toast.success(`Order marked as ${status}`);
        setConfirmStatusChange(null);
        fetchOrders();
      } else {
        toast.error('Failed to update order status');
      }
    } catch (err) {
      toast.error('Connection error while updating status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!startDate && !endDate) return true;
    const orderDate = new Date(order.eventDetails.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return orderDate >= start && orderDate <= end;
  });

  // Calculate status counts for Kanban-style summary
  const getStatusCount = (status: string) => {
    return orders.filter(o => o.status === status).length;
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Event Date', 'Venue', 'Guests', 'Occasion', 'Food Preference', 'Total Price', 'Status', 'Delivery Address'];
    
    const rows = filteredOrders.map(o => {
      let addressStr = 'N/A';
      const addr = o.customerDetails?.deliveryAddress;

      if (addr) {
        if (typeof addr === 'object') {
          addressStr = `${addr.flatVilla} ${addr.street} ${addr.area}`;
        } else {
          addressStr = String(addr);
        }
      }

      return [
        o.orderId,
        o.customerDetails?.name || 'N/A',
        o.customerDetails?.email || 'N/A',
        o.customerDetails?.phone || 'N/A',
        new Date(o.eventDetails.date).toLocaleDateString(),
        o.eventDetails.venue,
        o.eventDetails.guestCount,
        o.eventDetails.occasion,
        o.eventDetails.foodPreference || 'Mixed',
        o.pricing.total,
        o.status,
        addressStr.replace(/,/g, '')
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders list exported to CSV');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled': return 'text-green-400 bg-green-400/10 border-green-500/20';
      case 'unfulfilled': return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
      case 'preparing delivery': return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
      case 'delivery': return 'text-purple-400 bg-purple-400/10 border-purple-500/20';
      case 'pending': return 'text-orange-400 bg-orange-400/10 border-orange-500/20';
      case 'confirmed': return 'text-teal-400 bg-teal-400/10 border-teal-500/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-400/10 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Order & Booking Manager</h1>
          <p className="text-gray-400 text-sm">Review, dispatch, fulfill or cancel customer catering contracts.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          <FileSpreadsheet size={16} /> Export CSV
        </button>
      </div>

      {/* Status Pipeline Kanban Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {['pending', 'confirmed', 'unfulfilled', 'preparing delivery', 'delivery', 'fulfilled', 'cancelled'].map((status) => {
          const count = getStatusCount(status);
          return (
            <div 
              key={status} 
              className={`bg-[#2D0000] border border-white/10 rounded-xl p-3 text-center transition-all ${
                count > 0 && status === 'pending' ? 'shadow-[0_0_12px_rgba(249,115,22,0.1)] border-orange-500/30' : ''
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate mb-1">{status}</div>
              <div className={`text-xl font-bold font-playfair ${
                count > 0 ? getStatusColor(status).split(' ')[0] : 'text-gray-600'
              }`}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Filters Form */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-end justify-between shadow-md">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Event Start Date</label>
            <input 
              type="date" 
              className="w-full sm:w-44 bg-[#4A0000]/40 border border-white/10 rounded-xl px-3.5 py-2.5 outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Event End Date</label>
            <input 
              type="date" 
              className="w-full sm:w-44 bg-[#4A0000]/40 border border-white/10 rounded-xl px-3.5 py-2.5 outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-4 mb-3 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
        <div className="text-xs font-bold text-tan bg-tan/5 border border-tan/15 px-4 py-2.5 rounded-xl uppercase tracking-wider">
          Showing {filteredOrders.length} bookings
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-gray-500 italic">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading database orders...
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500 italic border-2 border-dashed border-white/5 rounded-2xl">
            No booking contracts found matching selected parameters.
          </div>
        ) : (
          filteredOrders.map(order => {
            const isExpanded = expandedOrders.includes(order._id);
            return (
              <div 
                key={order._id} 
                className="bg-[#2D0000] border border-white/10 rounded-2xl p-5 md:p-6 hover:border-tan/30 transition-all shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono text-tan bg-tan/10 px-3 py-1 rounded-full uppercase border border-tan/20">
                        {order.orderId}
                      </span>
                      <span className={`badge border uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.paymentIntentId && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Stripe Paid
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      {/* Customer Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 shrink-0">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{order.customerDetails?.name || 'Guest customer'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.customerDetails?.email}</p>
                          <p className="text-xs text-gray-400">{order.customerDetails?.phone}</p>
                        </div>
                      </div>

                      {/* Date & Booking Details */}
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 shrink-0">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {new Date(order.eventDetails.date).toLocaleDateString(undefined, { 
                              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.eventDetails.guestCount} Guests • {order.eventDetails.occasion}</p>
                          {order.eventDetails.foodPreference && (
                            <span className={`inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                              order.eventDetails.foodPreference === 'Veg' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              order.eventDetails.foodPreference === 'Non-Veg' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                order.eventDetails.foodPreference === 'Veg' ? 'bg-green-500' :
                                order.eventDetails.foodPreference === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-500'
                              }`} />
                              {order.eventDetails.foodPreference} Pref
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 shrink-0">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-200">{order.eventDetails.venue} Region</p>
                          <div className="flex flex-col gap-1 w-full">
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                              {typeof order.customerDetails?.deliveryAddress === 'object' ? (
                                `${order.customerDetails.deliveryAddress.flatVilla}, ${order.customerDetails.deliveryAddress.street}, ${order.customerDetails.deliveryAddress.area}${order.customerDetails.deliveryAddress.landmark ? ` (Near ${order.customerDetails.deliveryAddress.landmark})` : ''}`
                              ) : (
                                order.customerDetails?.deliveryAddress
                              )}
                            </p>
                            {order.customerDetails?.deliveryAddress && (
                              <a href={`https://maps.google.com/?q=${encodeURIComponent(typeof order.customerDetails.deliveryAddress === 'object' ? `${order.customerDetails.deliveryAddress.flatVilla}, ${order.customerDetails.deliveryAddress.street}, ${order.customerDetails.deliveryAddress.area}` : order.customerDetails.deliveryAddress)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/20 w-fit">
                                <Map size={10} /> View on Map
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row md:flex-col justify-between md:justify-start gap-3 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Price</p>
                      <p className="text-xl font-bold text-tan mt-0.5 font-playfair">{formatAED(order.pricing.total)}</p>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto w-40 sm:w-auto">
                      <a href={`https://wa.me/${order.customerDetails?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customerDetails?.name}, this is Cater Raja regarding your order ${order.orderId}.`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20 flex items-center justify-center gap-1.5">
                        <Share2 size={12} /> Contact on WhatsApp
                      </a>
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChangeRequest(order._id, 'unfulfilled')}
                          className="btn btn-sm bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === 'unfulfilled' && (
                        <button 
                          onClick={() => handleStatusChangeRequest(order._id, 'preparing delivery')}
                          className="btn btn-sm bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20"
                        >
                          Prepare Delivery
                        </button>
                      )}
                      {order.status === 'preparing delivery' && (
                        <button 
                          onClick={() => handleStatusChangeRequest(order._id, 'delivery')}
                          className="btn btn-sm bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/20"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'delivery' && (
                        <button 
                          onClick={() => handleStatusChangeRequest(order._id, 'fulfilled')}
                          className="btn btn-sm bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                      {order.status !== 'fulfilled' && order.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleStatusChangeRequest(order._id, 'cancelled')}
                          className="btn btn-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expand / Collapse Button */}
                <div className="border-t border-white/5 mt-4 pt-3 flex justify-between items-center">
                  <button 
                    onClick={() => toggleExpand(order._id)}
                    className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 font-semibold"
                  >
                    {isExpanded ? (
                      <>Hide selected items <ChevronUp size={14} /></>
                    ) : (
                      <>View selected items ({order.selectedMenu?.length || 0}) <ChevronDown size={14} /></>
                    )}
                  </button>
                  {isExpanded && order.selectedMenu && order.selectedMenu.length > 0 && (
                    <span className="text-[10px] text-gray-400">Portions optimized for {order.eventDetails.guestCount} guests</span>
                  )}
                </div>

                {/* Expanded Section showing dishes (Replaces dead layout) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.selectedMenu && order.selectedMenu.length > 0 ? (
                          order.selectedMenu.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-black/25 text-xs">
                              <div>
                                <p className="font-semibold text-gray-200">{item.name}</p>
                                <p className="text-gray-500 text-[10px] mt-0.5">{item.category}</p>
                              </div>
                              <span className="text-tan font-bold">{item.calculatedWeight.toFixed(2)} kg</span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-4 text-xs text-gray-500 italic flex items-center justify-center gap-1">
                            <Info size={12} /> No specific menu selections recorded for this booking template.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Action confirmation dialog */}
      <ConfirmModal 
        isOpen={confirmStatusChange !== null}
        title="Change Order Status"
        message={`Are you sure you want to transition this booking contract to state "${confirmStatusChange?.status}"? This will trigger notification updates in the audit trail.`}
        confirmLabel="Execute Update"
        onConfirm={executeStatusChange}
        onCancel={() => setConfirmStatusChange(null)}
      />
    </div>
  );
};

export default OrderManager;
