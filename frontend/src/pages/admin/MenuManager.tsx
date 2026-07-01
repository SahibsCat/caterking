import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

import { Plus, Edit2, Trash2, Search, Filter, Layers, Download } from 'lucide-react';
import { formatAED } from '../../utils/currency';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from '../../components/Toast';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  base_price: number;
  dietary_tag: string;
  packages: string[];
  occasions: string[];
  is_active: boolean;
}

const ALL_CATEGORIES = ['Starters', 'Salads', 'Main Course', 'Rice', 'Breads', 'Desserts', 'Soup', 'Curry & Masala', 'Pasta', 'Snacks', 'Beverages', 'Accompaniments'];
const ALL_PACKAGES = ['Standard', 'Premium', 'Elite'];
const ALL_OCCASIONS = ['Birthday Party', 'House Party', 'Kids Party', 'Pre Wedding Event', 'Wedding Event', 'Baby Shower', 'Dinners / Guests', 'Kitty Party', 'Housewarming', 'Corporate Event', 'Get Together', 'Other'];

const MenuManager = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Custom Modals State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    base_price: 0,
    weight_ratio_per_10_guests: 1,
    dietary_tag: 'Veg',
    packages: [] as string[],
    occasions: [] as string[],
    is_active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/menu`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setItems(data);
    } catch (err) {
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && editingId ? `${API_BASE_URL}/api/admin/menu/${editingId}` : `${API_BASE_URL}/api/admin/menu`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAdding(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', packages: [], occasions: [], is_active: true });
        toast.success(isEditing ? 'Menu item updated' : 'Menu item created');
        fetchItems();
      } else {
        toast.error('Error saving menu item');
      }
    } catch (err) {
      toast.error('Failed to submit item');
    }
  };

  const handleToggleActive = async (item: MenuItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      const updatedStatus = !item.is_active;
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: updatedStatus })
      });
      if (response.ok) {
        toast.success(`Item marked as ${updatedStatus ? 'active' : 'inactive'}`);
        fetchItems();
      }
    } catch (err) { 
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name, category: item.category, base_price: item.base_price,
      weight_ratio_per_10_guests: (item as any).weight_ratio_per_10_guests || 1,
      dietary_tag: item.dietary_tag, packages: item.packages || [], occasions: item.occasions || [], is_active: item.is_active
    });
    setEditingId(item._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Menu item deleted');
        setConfirmDeleteId(null);
        fetchItems();
      } else {
        toast.error('Error deleting item');
      }
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const executeBulkDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (response.ok) {
        toast.success(`${selectedIds.length} items deleted successfully`);
        setSelectedIds([]);
        setConfirmBulkDelete(false);
        fetchItems();
      } else {
        toast.error('Error performing bulk delete');
      }
    } catch (err) {
      toast.error('Failed to complete bulk delete');
    }
  };

  const handleBulkStatus = async (is_active: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/menu/bulk-toggle`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ids: selectedIds, is_active })
      });
      if (response.ok) {
        toast.success(`Updated ${selectedIds.length} items status`);
        setSelectedIds([]);
        fetchItems();
      } else {
        toast.error('Error updating items status');
      }
    } catch (err) {
      toast.error('Failed to bulk toggle status');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i._id));
    }
  };

  const handleDownloadCSV = () => {
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag,packages,occasions\n";
    const sampleRows = [
      '"Chicken Tikka","Starters",35,0.05,"Non-Veg","Standard|Premium|Elite","All"\n',
      '"Paneer Tikka","Starters",30,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Mutton Seekh Kebab","Starters",45,0.05,"Non-Veg","Premium|Elite","Wedding Event|Corporate Event"\n'
    ].join("");
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cater_king_menu_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) return toast.error('File is empty or only has headers');
      
      const bulkItems = lines.slice(1).map(line => {
        const cols: string[] = [];
        let inQuote = false;
        let p = 0;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQuote = !inQuote;
          else if (line[i] === ',' && !inQuote) {
            cols.push(line.slice(p, i));
            p = i + 1;
          }
        }
        cols.push(line.slice(p));
        const parsed = cols.map(c => c.replace(/^"|"$|^'|'$/g, '').trim());
        const [name, category, base_price, weight_ratio, dietary_tag, packages, occasions] = parsed;

        return {
          name: name ? name : '',
          category: category || 'Main Course',
          base_price: Number(base_price) || 0,
          weight_ratio_per_10_guests: Number(weight_ratio) || 1,
          dietary_tag: dietary_tag || 'Veg',
          packages: packages ? packages.split('|').map(p => p.trim()) : [],
          occasions: occasions ? occasions.split('|').map(o => o.trim()) : [],
          is_active: true
        };
      });

      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/menu/bulk`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkItems)
        });
        if (response.ok) {
          toast.success('Bulk items uploaded successfully');
          setIsBulkAdding(false);
          fetchItems();
        } else {
          toast.error('Bulk upload failed');
        }
      } catch (err) {
        toast.error('Error during bulk upload');
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  // Helper to color-code categories
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Starters': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Main Course': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Desserts': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Salads': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Beverages': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-gray-500/10 text-gray-300 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Menu Management</h1>
          <p className="text-gray-400 text-sm">Configure standard catalog items, dietary tags, and bulk configurations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
            onClick={() => setIsBulkAdding(true)}
            className="btn btn-secondary btn-sm"
          >
            Bulk Add
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', packages: [], occasions: [], is_active: true });
              setIsEditing(false); setEditingId(null); setIsAdding(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Add Catalog Item
          </button>
        </div>
      </div>

      {/* CSV Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkAdding && (
          <div className="modal-overlay" onClick={() => setIsBulkAdding(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-md p-8 text-center"
            >
              <div className="bg-tan/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-tan/20">
                <Layers className="text-tan" size={24} />
              </div>
              <h2 className="text-2xl font-bold font-playfair mb-2">Bulk Menu Upload</h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Upload multiple items simultaneously via a standard formatting spreadsheet (.csv).</p>
              
              <div className="space-y-4 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">1. Download and format</p>
                  <button onClick={handleDownloadCSV} className="w-full btn btn-secondary btn-sm flex items-center justify-center gap-2">
                    <Download size={14} /> Download CSV Template
                  </button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">2. Upload file</p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-tan file:text-richBlack file:cursor-pointer" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setIsBulkAdding(false)} className="text-gray-500 hover:text-white font-semibold text-sm transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Modal Drawer */}
      <AnimatePresence>
        {isAdding && (
          <div className="modal-overlay" onClick={() => setIsAdding(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold font-playfair mb-6">{isEditing ? 'Edit Catalog Item' : 'New Catalog Item'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Item Name</label>
                  <input 
                    type="text" required
                    className="input-field"
                    placeholder="e.g. Garlic Herb Paneer"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                    <select 
                      className="input-field"
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {ALL_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-charcoal">{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Dietary Tag</label>
                    <select 
                      className="input-field"
                      value={formData.dietary_tag} onChange={e => setFormData({...formData, dietary_tag: e.target.value})}
                    >
                      <option value="Veg" className="bg-charcoal">Veg</option>
                      <option value="Non-Veg" className="bg-charcoal">Non-Veg</option>
                      <option value="Mixed" className="bg-charcoal">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Base Price (AED)</label>
                    <input 
                      type="number" required min="0"
                      className="input-field"
                      placeholder="0.00"
                      value={formData.base_price} onChange={e => setFormData({...formData, base_price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Weight (kg/10 guests)</label>
                    <input 
                      type="number" required min="0" step="0.01"
                      className="input-field"
                      placeholder="1.0"
                      value={formData.weight_ratio_per_10_guests} onChange={e => setFormData({...formData, weight_ratio_per_10_guests: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Include in Packages</label>
                    <div className="space-y-2.5">
                      {ALL_PACKAGES.map(pkg => (
                        <label key={pkg} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={formData.packages.includes(pkg)}
                            onChange={e => {
                              const newPkgs = e.target.checked 
                                ? [...formData.packages, pkg] 
                                : formData.packages.filter(p => p !== pkg);
                              setFormData({...formData, packages: newPkgs});
                            }}
                            className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded focus:ring-0 text-tan"
                          />
                          <span className="text-gray-300 font-medium">{pkg}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Suitable Occasions</label>
                    <div className="space-y-2 h-32 overflow-y-auto pr-1 custom-scrollbar">
                      {ALL_OCCASIONS.map(occ => (
                        <label key={occ} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={formData.occasions.includes(occ)}
                            onChange={e => {
                              const newOcc = e.target.checked 
                                ? [...formData.occasions, occ] 
                                : formData.occasions.filter(o => o !== occ);
                              setFormData({...formData, occasions: newOcc});
                            }}
                            className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded focus:ring-0 text-tan"
                          />
                          <span className="text-gray-300 font-medium text-xs">{occ}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Item Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filters, Categories and Search */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search catalog items..."
            className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-tan/30 focus:outline-none transition-all placeholder:text-gray-600 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Filter className="text-gray-500 w-5 h-5 hidden sm:block" />
          <select 
            className="w-full sm:w-48 bg-[#4A0000]/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat} className="bg-charcoal">{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Items Table container */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse admin-table">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer" 
                    checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Weight Ratio</th>
                <th className="px-6 py-4">Dietary</th>
                <th className="px-6 py-4">Active Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-500 italic">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading catalog items...
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-500 italic">
                    No catalog items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item._id} className={`transition-colors hover:bg-white/5 ${selectedIds.includes(item._id) ? 'bg-white/5' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4.5 h-4.5 bg-white/5 border border-white/10 rounded text-tan focus:ring-0 cursor-pointer" 
                        checked={selectedIds.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`badge border ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-tan">{formatAED(item.base_price)}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{((item as any).weight_ratio_per_10_guests || 1).toFixed(2)}kg <span className="text-gray-600">/ 10 pax</span></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        item.dietary_tag === 'Veg' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dietary_tag === 'Veg' ? 'bg-green-400' : 'bg-red-400'}`} />
                        {item.dietary_tag}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <button 
                          onClick={() => handleToggleActive(item)}
                          className={`relative inline-flex h-5.5 w-10.5 items-center rounded-full transition-colors cursor-pointer ${
                            item.is_active ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            item.is_active ? 'translate-x-5.5' : 'translate-x-1'
                          }`} />
                        </button>
                        <span className="text-xs text-gray-500 font-semibold uppercase">{item.is_active ? 'Active' : 'Muted'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="btn btn-icon bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          title="Edit Item"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(item._id)} 
                          className="btn btn-icon bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Delete Item"
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

      {/* Confirmation Dialogs */}
      <ConfirmModal 
        isOpen={confirmDeleteId !== null}
        title="Delete Menu Item"
        message="Are you sure you want to permanently delete this catalog item? This will remove it from all suggested menus and categories."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmModal 
        isOpen={confirmBulkDelete}
        title={`Delete ${selectedIds.length} Items`}
        message={`Are you sure you want to permanently delete all ${selectedIds.length} selected items? This action is irreversible.`}
        onConfirm={executeBulkDelete}
        onCancel={() => setConfirmBulkDelete(false)}
      />
    </div>
  );
};

export default MenuManager;
