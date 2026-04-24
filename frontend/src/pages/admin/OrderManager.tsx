import { useEffect, useState } from 'react';
import { ShoppingBag, User as UserIcon, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

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
}

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchOrders();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!startDate && !endDate) return true;
    const orderDate = new Date(order.eventDetails.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return orderDate >= start && orderDate <= end;
  });

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Event Date', 'Venue', 'Guests', 'Occasion', 'Food Preference', 'Total Price', 'Status', 'Delivery Address'];
    const rows = filteredOrders.map(o => [
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
      typeof o.customerDetails?.deliveryAddress === 'object' 
        ? `${o.customerDetails.deliveryAddress.flatVilla} ${o.customerDetails.deliveryAddress.street} ${o.customerDetails.deliveryAddress.area}`.replace(/,/g, '')
        : (o.customerDetails?.deliveryAddress || 'N/A').replace(/,/g, '')
    ]);

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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled': return 'text-green-400 bg-green-400/10';
      case 'unfulfilled': return 'text-yellow-400 bg-yellow-400/10';
      case 'preparing delivery': return 'text-blue-400 bg-blue-400/10';
      case 'delivery': return 'text-purple-400 bg-purple-400/10';
      case 'pending': return 'text-orange-400 bg-orange-400/10';
      case 'confirmed': return 'text-teal-400 bg-teal-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400">Track and manage customer bookings</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-tan text-richBlack px-6 py-2 rounded-full font-bold hover:scale-105 transition-all"
        >
          Export to CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-charcoal p-4 rounded-xl border border-white/5">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Start Date</label>
          <input 
            type="date" 
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-tan transition-colors text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">End Date</label>
          <input 
            type="date" 
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-tan transition-colors text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setStartDate(''); setEndDate(''); }}
          className="mt-auto mb-1 text-xs text-gray-400 hover:text-white underline underline-offset-4"
        >
          Reset Filters
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No orders found</div>
        ) : (
          filteredOrders.map(order => (
            <div key={order._id} className="bg-charcoal border border-white/10 rounded-2xl p-6 hover:border-tan/30 transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-tan bg-tan/10 px-3 py-1 rounded-full uppercase">
                      {order.orderId}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.paymentIntentId && (
                      <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold">PAID</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <UserIcon size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold">{order.customerDetails?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{order.customerDetails?.email} | {order.customerDetails?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm font-semibold">{new Date(order.eventDetails.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{order.eventDetails.guestCount} Guests • {order.eventDetails.occasion}</p>
                        {order.eventDetails.foodPreference && (
                          <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.eventDetails.foodPreference === 'Veg' ? 'bg-green-500/15 text-green-400' :
                            order.eventDetails.foodPreference === 'Non-Veg' ? 'bg-red-500/15 text-red-400' :
                            'bg-yellow-500/15 text-yellow-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.eventDetails.foodPreference === 'Veg' ? 'bg-green-500' :
                              order.eventDetails.foodPreference === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            {order.eventDetails.foodPreference}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 md:col-span-2">
                      <MapPin size={18} className="text-gray-500" />
                      <div>
                        <p className="text-sm">{order.eventDetails.venue}</p>
                        <p className="text-xs text-gray-500 italic">
                          {typeof order.customerDetails?.deliveryAddress === 'object' ? (
                            `${order.customerDetails.deliveryAddress.flatVilla}, ${order.customerDetails.deliveryAddress.street}, ${order.customerDetails.deliveryAddress.area}${order.customerDetails.deliveryAddress.landmark ? ` (Near ${order.customerDetails.deliveryAddress.landmark})` : ''}`
                          ) : (
                            order.customerDetails?.deliveryAddress
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <ShoppingBag size={18} className="text-gray-500" />
                      <p className="text-sm font-bold">AED {order.pricing.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'unfulfilled')}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all text-sm font-bold"
                    >
                      <CheckCircle size={16} />
                      Confirm Order
                    </button>
                  )}
                  {order.status === 'unfulfilled' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'preparing delivery')}
                      className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-bold"
                    >
                      Preparing Delivery
                    </button>
                  )}
                  {order.status === 'preparing delivery' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'delivery')}
                      className="flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-all text-sm font-bold"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'delivery' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'fulfilled')}
                      className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all text-sm font-bold"
                    >
                      Mark Fulfilled
                    </button>
                  )}
                  {order.status !== 'fulfilled' && order.status !== 'cancelled' && (
                    <button 
                      onClick={() => updateStatus(order._id, 'cancelled')}
                      className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all text-sm font-bold"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManager;
