import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

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
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Adult',
    description: '',
    price: 0,
    items: '', // We'll parse this as comma-separated string for simplicity in the UI
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
      console.error('Failed to fetch packs');
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
        fetchPacks();
      }
    } catch (err) {
      console.error(err);
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pack?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPacks();
    } catch (err) { console.error(err); }
  };

  const handleToggleActive = async (pack: MealPack) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/api/admin/packages/${pack._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pack, is_active: !pack.is_active })
      });
      fetchPacks();
    } catch (err) { console.error(err); }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} packages?`)) return;
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
        setSelectedIds([]);
        fetchPacks();
      }
    } catch (err) { console.error(err); }
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
        setSelectedIds([]);
        fetchPacks();
      }
    } catch (err) { console.error(err); }
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Package Management</h1>
          <p className="text-gray-400">Manage Meal Packs & Quick Bookings</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <div className="flex gap-2 mr-4 border-r border-white/10 pr-4">
              <button 
                onClick={() => handleBulkStatus(true)}
                className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg font-bold hover:bg-green-500/20 transition-all text-sm"
              >
                Activate ({selectedIds.length})
              </button>
              <button 
                onClick={() => handleBulkStatus(false)}
                className="bg-gray-500/10 text-gray-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-500/20 transition-all text-sm"
              >
                Deactivate
              </button>
              <button 
                onClick={handleBulkDelete}
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500/20 transition-all text-sm"
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
            className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-tan/90 transition-all"
          >
            <Plus size={20} />
            Create Package
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-2xl w-full max-w-xl shadow-xl">
            {isEditing ? <h2 className="text-2xl font-bold font-playfair mb-6">Edit Package</h2> : <h2 className="text-2xl font-bold font-playfair mb-6">Create New Package</h2>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Package Name</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Target Audience Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Adult" className="bg-[#0A0A0A]">Adult</option>
                    <option value="Snack" className="bg-[#0A0A0A]">Snack</option>
                    <option value="Kids" className="bg-[#0A0A0A]">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Price (AED)</label>
                  <input 
                    type="number" required min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Items Included (comma-separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Butter Chicken, Jeera Rice, Gulab Jamun"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold hover:bg-tan/90">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Packages Table */}
      <div className="bg-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-6">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded" 
                  checked={selectedIds.length === packs.length && packs.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Package Name</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Items</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading packages...</td></tr>
            ) : packs.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No packages found</td></tr>
            ) : (
              packs.map(pack => (
                <tr key={pack._id} className={`hover:bg-white/5 transition-colors group ${selectedIds.includes(pack._id) ? 'bg-white/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 bg-white/5 border border-white/10 rounded" 
                      checked={selectedIds.includes(pack._id)}
                      onChange={() => toggleSelect(pack._id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{pack.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs">{pack.type}</span>
                  </td>
                  <td className="px-6 py-4">AED {pack.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-[200px] truncate">
                    {pack.items.join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(pack)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pack.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pack.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-2 text-sm text-gray-400">{pack.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(pack)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(pack._id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                        <Trash2 size={16} />
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
  );
};

export default PackageManager;
