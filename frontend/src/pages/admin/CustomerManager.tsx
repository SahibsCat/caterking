import { useEffect, useState } from 'react';
import { User, Calendar, Phone, Mail, MapPin, Download, Search } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { motion } from 'framer-motion';
import { toast } from '../../components/Toast';

interface Lead {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string | {
    flatVilla: string;
    street: string;
    area: string;
    landmark?: string;
  };
  source: string;
  createdAt: string;
}

const CustomerManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let url = `${API_BASE_URL}/api/admin/leads`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      toast.error('Failed to load customer profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [startDate, endDate]);

  const exportToCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'Address', 'Source', 'Date Captured'];
    const formatAddr = (address: any) => {
      if (!address) return 'N/A';
      if (typeof address === 'string') return address;
      return [address.flatVilla, address.street, address.area, address.landmark].filter(Boolean).join(', ');
    };

    const rows = leads.map(l => [
      l.name,
      l.mobile,
      l.email || 'N/A',
      formatAddr(l.address),
      l.source,
      new Date(l.createdAt).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Leads list exported to CSV');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.mobile.includes(search) || 
    (l.email && l.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Customer Leads</h1>
          <p className="text-gray-400 text-sm">Review contact data captured from landing page lead capture and standard checkout routes.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="btn btn-secondary btn-sm flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Date Filter & Search Panel */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-end justify-between shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          <div className="relative flex-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 ml-1">Search Leads</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search name, phone, email..."
                className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-tan/30 focus:outline-none transition-all placeholder:text-gray-600 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">From Date</label>
            <input 
              type="date" 
              className="w-full sm:w-44 bg-[#4A0000]/40 border border-white/10 rounded-xl px-3.5 py-2.5 outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-sm cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">To Date</label>
            <input 
              type="date" 
              className="w-full sm:w-44 bg-[#4A0000]/40 border border-white/10 rounded-xl px-3.5 py-2.5 outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-sm cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-4 mb-3 font-semibold self-start sm:self-end"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Leads List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 text-gray-500 italic">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading customer profiles...
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 bg-[#2D0000] border border-white/10 rounded-2xl shadow-xl flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4 border border-white/10">
              <User size={24} />
            </div>
            <p className="text-gray-500 text-sm font-semibold">No lead records matching selected filters</p>
          </div>
        ) : (
          filteredLeads.map((lead, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.04, 0.4) }}
              key={lead._id} 
              className="bg-[#2D0000] border border-white/10 rounded-2xl p-5 hover:border-tan/30 transition-all shadow-md group"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-tan/10 flex items-center justify-center text-tan border border-tan/10 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-white truncate">{lead.name}</h3>
                    <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded">
                      Source: {lead.source?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5 text-sm">
                  {/* Contact Fields */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-gray-300">
                      <Phone size={14} className="text-tan/60 shrink-0" />
                      <span className="font-medium text-xs text-gray-300">{lead.mobile}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2.5 text-gray-300">
                        <Mail size={14} className="text-tan/60 shrink-0" />
                        <span className="font-medium text-xs text-gray-300 truncate max-w-[180px]">{lead.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5 col-span-1">
                    {lead.address ? (
                      <div className="flex items-start gap-2.5 text-gray-300">
                        <MapPin size={14} className="text-tan/60 shrink-0 mt-0.5" />
                        <span className="font-medium text-xs text-gray-300 line-clamp-2">
                          {typeof lead.address === 'string' ? lead.address : 
                            [lead.address.flatVilla, lead.address.street, lead.address.area].filter(Boolean).join(', ')
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 italic">No address provided</span>
                    )}
                  </div>

                  {/* Creation Time */}
                  <div className="space-y-1.5 lg:text-right">
                    <div className="flex items-center lg:justify-end gap-2 text-gray-500">
                      <Calendar size={14} className="text-tan/40 shrink-0" />
                      <span className="font-semibold text-xs text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerManager;
