import { useEffect, useState } from 'react';
import { User, Calendar, Phone, Mail, MapPin, Download } from 'lucide-react';

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // The API handles date filtering on the server if query params are provided
      let url = 'http://localhost:5000/api/admin/leads';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads');
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
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Customer Leads</h1>
          <p className="text-gray-400">Captured from initial popup and booking flow</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-tan text-richBlack px-6 py-2 rounded-full font-bold hover:scale-105 transition-all flex items-center gap-2"
        >
          <Download size={18} />
          Export to CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-charcoal p-6 rounded-xl border border-white/5 items-end">
        <div className="flex flex-col gap-2 relative">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">From Date</label>
          <div className="relative">
            <input 
              type="date" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-tan transition-all text-sm w-48 text-white"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">To Date</label>
          <div className="relative">
            <input 
              type="date" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-tan transition-all text-sm w-48 text-white"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button 
          onClick={() => { setStartDate(''); setEndDate(''); }}
          className="mb-2 text-xs text-gray-400 hover:text-white underline underline-offset-4"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading customers...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 bg-charcoal rounded-3xl border border-white/5">
            <User size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">No customer records found</p>
          </div>
        ) : (
          leads.map(lead => (
            <div key={lead._id} className="bg-charcoal border border-white/10 rounded-2xl p-6 hover:border-tan/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-tan/10 flex items-center justify-center text-tan">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{lead.name}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">{lead.source?.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Phone size={16} className="text-tan/60" />
                      <span className="text-sm font-medium">{lead.mobile}</span>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Mail size={16} className="text-tan/60" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{lead.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={16} className="text-tan/60" />
                      <span className="text-sm font-medium">{new Date(lead.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {lead.address && (
                    <div className="flex items-center gap-3 text-gray-400 md:col-span-1 lg:col-span-1">
                      <MapPin size={16} className="text-tan/60 shrink-0" />
                      <span className="text-sm font-medium line-clamp-2">
                        {typeof lead.address === 'string' ? lead.address : 
                          [lead.address.flatVilla, lead.address.street, lead.address.area].filter(Boolean).join(', ')
                        }
                      </span>
                    </div>
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

export default CustomerManager;
