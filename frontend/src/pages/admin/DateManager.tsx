import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

import { Calendar as CalendarIcon, Trash2, Plus, CalendarRange } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from '../../components/Toast';

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

  // Confirmation Modals State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

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
      // Sort dates by calendar date ascending
      const sorted = Array.isArray(data) 
        ? [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        : [];
      setDates(sorted);
    } catch (err) {
      toast.error('Failed to load active delivery calendar');
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
        toast.success('Available date created successfully');
        fetchDates();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create date');
      }
    } catch (err) {
      toast.error('Error adding date');
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
        toast.success('Calendar date range generated');
        fetchDates();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to generate date ranges');
      }
    } catch (err) {
      toast.error('Error generating date range');
    }
  };

  const executeDeleteDate = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/available-dates/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Calendar date removed');
        setConfirmDeleteId(null);
        fetchDates();
      } else {
        toast.error('Failed to remove date');
      }
    } catch (err) {
      toast.error('Error deleting calendar date');
    }
  };

  const executeBulkDelete = async () => {
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
        toast.success(`${selectedIds.length} dates removed from calendar`);
        setSelectedIds([]);
        setConfirmBulkDelete(false);
        fetchDates();
      } else {
        toast.error('Failed to delete selected dates');
      }
    } catch (err) {
      toast.error('Error completing bulk removal');
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Delivery Calendar</h1>
        <p className="text-gray-400 text-sm">Configure open slots and dates suitable for catering contracts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Date Add */}
        <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-playfair mb-4 flex items-center gap-2 text-white">
              <Plus size={18} className="text-tan" /> Open Single Slot
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">Authorize a single specific date in the booking flow calendar.</p>
          </div>
          <form onSubmit={handleAddDate} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 ml-1">Select Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-sm cursor-pointer"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button 
              type="submit"
              className="w-full btn btn-primary py-3.5"
            >
              Add Single Date
            </button>
          </form>
        </div>

        {/* Bulk Add Dates */}
        <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-playfair mb-4 flex items-center gap-2 text-white">
              <CalendarRange size={18} className="text-tan" /> Auto-Generate Range
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">Batch authorize all sequential dates within a custom range.</p>
          </div>
          <form onSubmit={handleBulkAddDate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 ml-1">Start Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-xs cursor-pointer"
                  value={bulkStartDate}
                  onChange={(e) => setBulkStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 ml-1">End Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-tan focus:ring-2 focus:ring-tan/15 transition-all text-xs cursor-pointer"
                  value={bulkEndDate}
                  onChange={(e) => setBulkEndDate(e.target.value)}
                  min={bulkStartDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full btn btn-secondary py-3.5"
            >
              Generate Range
            </button>
          </form>
        </div>
      </div>

      {/* Available Dates List */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold font-playfair text-white">Active Calendar Slots</h2>
            <p className="text-gray-400 text-xs mt-0.5">List of open booking dates</p>
          </div>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setConfirmBulkDelete(true)}
              className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Remove Selected ({selectedIds.length})
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse admin-table">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer"
                    checked={selectedIds.length === dates.length && dates.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Configured Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-500 italic">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading calendar database...
                    </div>
                  </td>
                </tr>
              ) : dates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-gray-500 italic">
                    No active dates open. Clients will not be able to schedule bookings!
                  </td>
                </tr>
              ) : (
                dates.map(d => (
                  <tr key={d._id} className={`transition-colors hover:bg-white/5 ${selectedIds.includes(d._id) ? 'bg-white/5' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer"
                        checked={selectedIds.includes(d._id)}
                        onChange={() => toggleSelect(d._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <span className="flex items-center gap-2.5">
                        <CalendarIcon size={16} className="text-tan shrink-0" />
                        {new Date(d.date).toLocaleDateString(undefined, { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setConfirmDeleteId(d._id)} 
                        className="btn btn-icon bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        title="Remove Date"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal 
        isOpen={confirmDeleteId !== null}
        title="Remove Available Date"
        message="Are you sure you want to close this calendar date? Users will no longer be able to submit booking inquiries on this date."
        onConfirm={executeDeleteDate}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmModal 
        isOpen={confirmBulkDelete}
        title={`Remove ${selectedIds.length} Dates`}
        message={`Are you sure you want to permanently remove all ${selectedIds.length} selected calendar dates? Users will not be able to select these slots.`}
        onConfirm={executeBulkDelete}
        onCancel={() => setConfirmBulkDelete(false)}
      />
    </div>
  );
};

export default DateManager;
