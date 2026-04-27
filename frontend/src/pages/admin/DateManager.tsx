import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

import { Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';

interface AvailableDate {
  _id: string;
  date: string;
}

const DateManager = () => {
  const [dates, setDates] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState('');
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/available-dates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDates(data);
    } catch (err) {
      console.error('Failed to fetch dates');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/available-dates`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ date: newDate })
      });

      if (response.ok) {
        setNewDate('');
        fetchDates();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add date');
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleBulkAddDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkStartDate || !bulkEndDate) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/available-dates/bulk`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ startDate: bulkStartDate, endDate: bulkEndDate })
      });

      if (response.ok) {
        setBulkStartDate('');
        setBulkEndDate('');
        fetchDates();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add bulk dates');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this available date?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/api/admin/available-dates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchDates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected dates?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/available-dates/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (response.ok) {
        setSelectedIds([]);
        fetchDates();
      } else {
        alert('Failed to delete selected dates');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === dates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dates.map(d => d._id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Delivery Dates</h1>
        <p className="text-gray-400">Manage which dates are available for selection in the booking flow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-charcoal border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={20} className="text-tan" /> Add Single Date
          </h2>
          <form onSubmit={handleAddDate} className="flex flex-col gap-4">
            <div className="relative z-10 w-full">
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tan transition-all min-h-[50px] cursor-pointer"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button 
              type="submit"
              className="bg-tan text-richBlack w-full py-3 rounded-lg font-bold hover:bg-tan/90 transition-all"
            >
              Add Date
            </button>
          </form>
        </div>

        <div className="bg-charcoal border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CalendarIcon size={20} className="text-tan" /> Bulk Add Dates
          </h2>
          <form onSubmit={handleBulkAddDate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 relative z-10 w-full">
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tan transition-all text-sm min-h-[50px] cursor-pointer"
                  value={bulkStartDate}
                  onChange={(e) => setBulkStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-1 relative z-10 w-full">
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-tan transition-all text-sm min-h-[50px] cursor-pointer"
                  value={bulkEndDate}
                  onChange={(e) => setBulkEndDate(e.target.value)}
                  min={bulkStartDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="bg-white/10 text-white border border-white/10 w-full py-3 rounded-lg font-bold hover:bg-white/20 transition-all"
            >
              Bulk Create Dates
            </button>
          </form>
        </div>
      </div>

      <div className="bg-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-bold">Manage Dates</h2>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-white/20 bg-white/5 text-tan focus:ring-tan cursor-pointer"
                  checked={selectedIds.length === dates.length && dates.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Available Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading available dates...</td></tr>
            ) : dates.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">No dates configured yet.</td></tr>
            ) : (
              dates.map(d => (
                <tr key={d._id} className={`hover:bg-white/5 transition-colors group ${selectedIds.includes(d._id) ? 'bg-tan/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-white/5 text-tan focus:ring-tan cursor-pointer"
                      checked={selectedIds.includes(d._id)}
                      onChange={() => toggleSelect(d._id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <CalendarIcon size={18} className="text-gray-500" />
                    {new Date(d.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteDate(d._id)} 
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DateManager;
