import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { formatAED } from '../../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from '../../components/Toast';

interface MealPack {
  _id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  items: string[];
  is_active: boolean;
}

const PackageManager = () => {
  const [packs, setPacks] = useState<MealPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Custom Modal Confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Adult',
    description: '',
    price: 0,
    items: '', 
    is_active: true
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/packages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPacks(data);
    } catch (err) {
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && editingId ? `${API_BASE_URL}/api/admin/packages/${editingId}` : `${API_BASE_URL}/api/admin/packages`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        items: formData.items.split(',').map(i => i.trim()).filter(i => i)
      };

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setIsAdding(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', type: 'Adult', description: '', price: 0, items: '', is_active: true });
        toast.success(isEditing ? 'Package updated successfully' : 'Package created successfully');
        fetchPacks();
      } else {
        toast.error('Failed to save package changes');
      }
    } catch (err) {
      toast.error('Error submitting package');
    }
  };

  const handleEdit = (pack: MealPack) => {
    setFormData({
      name: pack.name, 
      type: pack.type, 
      description: pack.description || '', 
      price: pack.price, 
      items: pack.items ? pack.items.join(', ') : '', 
      is_active: pack.is_active
    });
    setEditingId(pack._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/packages/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Package deleted');
        setConfirmDeleteId(null);
        fetchPacks();
      } else {
        toast.error('Failed to delete package');
      }
    } catch (err) {
      toast.error('Error executing delete action');
    }
  };

  const handleToggleActive = async (pack: MealPack) => {
    try {
      const token = localStorage.getItem('adminToken');
      const updatedStatus = !pack.is_active;
      const response = await fetch(`${API_BASE_URL}/api/admin/packages/${pack._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pack, is_active: updatedStatus })
      });
      if (response.ok) {
        toast.success(`Package marked ${updatedStatus ? 'active' : 'inactive'}`);
        fetchPacks();
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const executeBulkDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/packages/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (response.ok) {
        toast.success(`${selectedIds.length} packages deleted`);
        setSelectedIds([]);
        setConfirmBulkDelete(false);
        fetchPacks();
      } else {
        toast.error('Bulk deletion failed');
      }
    } catch (err) {
      toast.error('Error executing bulk delete');
    }
  };

  const handleBulkStatus = async (is_active: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/packages/bulk-toggle`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ids: selectedIds, is_active })
      });
      if (response.ok) {
        toast.success(`Marked ${selectedIds.length} items as ${is_active ? 'active' : 'inactive'}`);
        setSelectedIds([]);
        fetchPacks();
      } else {
        toast.error('Failed to bulk toggle status');
      }
    } catch (err) {
      toast.error('Error bulk toggling status');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === packs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(packs.map(p => p._id));
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Info Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Package Management</h1>
          <p className="text-gray-400 text-sm">Configure multi-course package layouts, pricing parameters, and client templates.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
              <button 
                onClick={() => handleBulkStatus(true)}
                className="btn btn-sm bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20"
              >
                Activate ({selectedIds.length})
              </button>
              <button 
                onClick={() => handleBulkStatus(false)}
                className="btn btn-sm bg-gray-500/10 text-gray-400 hover:bg-white/5 border border-white/10"
              >
                Deactivate
              </button>
              <button 
                onClick={() => setConfirmBulkDelete(true)}
                className="btn btn-sm bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20"
              >
                Delete
              </button>
            </div>
          )}
          <button 
            onClick={() => {
              setFormData({ name: '', type: 'Adult', description: '', price: 0, items: '', is_active: true });
              setIsEditing(false); setEditingId(null); setIsAdding(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Create Package Layout
          </button>
        </div>
      </div>

      {/* Add / Edit Package Modal Drawer */}
      <AnimatePresence>
        {isAdding && (
          <div className="modal-overlay" onClick={() => setIsAdding(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-xl p-8"
            >
              <h2 className="text-2xl font-bold font-playfair mb-6">{isEditing ? 'Edit Package Layout' : 'Create Package Layout'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Package Name</label>
                  <input 
                    type="text" required
                    className="input-field"
                    placeholder="e.g. Standard Vegetarian Meal Pack"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Description Summary</label>
                  <textarea 
                    className="input-field min-h-20"
                    placeholder="Enter short description explaining course options..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Target Audience Type</label>
                    <select 
                      className="input-field"
                      value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Adult" className="bg-[#0A0A0A]">Adult</option>
                      <option value="Snack" className="bg-[#0A0A0A]">Snack</option>
                      <option value="Kids" className="bg-[#0A0A0A]">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Base Price (AED/pax)</label>
                    <input 
                      type="number" required min="0"
                      className="input-field"
                      placeholder="0.00"
                      value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Included Items (Comma-Separated)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Butter Chicken, Jeera Rice, Gulab Jamun"
                    className="input-field"
                    value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-500 mt-1 italic">Type catalog names separated by commas to link them.</p>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Package changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Packages Table Container */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse admin-table">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer" 
                    checked={selectedIds.length === packs.length && packs.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Package Name</th>
                <th className="px-6 py-4">Target Type</th>
                <th className="px-6 py-4">Price (AED)</th>
                <th className="px-6 py-4">Course Inclusions</th>
                <th className="px-6 py-4">Active Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500 italic">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading package list...
                    </div>
                  </td>
                </tr>
              ) : packs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500 italic">
                    No custom packages found in catalog databases.
                  </td>
                </tr>
              ) : (
                packs.map(pack => (
                  <tr key={pack._id} className={`transition-colors hover:bg-white/5 ${selectedIds.includes(pack._id) ? 'bg-white/5' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer" 
                        checked={selectedIds.includes(pack._id)}
                        onChange={() => toggleSelect(pack._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>
                        {pack.name}
                        {pack.description && <p className="text-xs text-gray-500 font-normal mt-0.5 max-w-xs truncate">{pack.description}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getAudienceBadgeStyle(pack.type)}`}>
                        {pack.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-tan">{formatAED(pack.price)}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 max-w-[240px] truncate">
                      {pack.items && pack.items.length > 0 ? (
                        <span className="flex items-center gap-1">
                          <Tag size={12} className="text-tan shrink-0" />
                          {pack.items.join(', ')}
                        </span>
                      ) : (
                        <span className="text-gray-600 italic">No inclusions</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <button 
                          onClick={() => handleToggleActive(pack)}
                          className={`relative inline-flex h-5.5 w-10.5 items-center rounded-full transition-colors cursor-pointer ${
                            pack.is_active ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            pack.is_active ? 'translate-x-5.5' : 'translate-x-1'
                          }`} />
                        </button>
                        <span className="text-xs text-gray-500 font-semibold uppercase">{pack.is_active ? 'Active' : 'Muted'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(pack)} 
                          className="btn btn-icon bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          title="Edit Package"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(pack._id)} 
                          className="btn btn-icon bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Delete Package"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation dialogues */}
      <ConfirmModal 
        isOpen={confirmDeleteId !== null}
        title="Delete Package"
        message="Are you sure you want to permanently delete this package template? Users will no longer be able to select this format during checkouts."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmModal 
        isOpen={confirmBulkDelete}
        title={`Delete ${selectedIds.length} Packages`}
        message={`Are you sure you want to permanently delete all ${selectedIds.length} selected packages? This action is irreversible.`}
        onConfirm={executeBulkDelete}
        onCancel={() => setConfirmBulkDelete(false)}
      />
    </div>
  );
};

export default PackageManager;
