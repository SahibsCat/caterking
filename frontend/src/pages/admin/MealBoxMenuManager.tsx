import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { motion, AnimatePresence } from 'framer-motion';

import { Plus, Edit2, Trash2, Search, Layers, Download, UtensilsCrossed } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import { toast } from '../../components/Toast';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
}

interface MealBoxMenu {
  _id: string;
  boxType: 'Adult' | 'Kids' | 'Snack';
  package: string;
  items: {
    itemId: MenuItem;
    defaultQuantity: number;
  }[];
}

const ALL_PACKAGES = ['Standard', 'Premium', 'Elite'];
const ALL_BOX_TYPES = ['Adult', 'Kids', 'Snack'];

const MealBoxMenuManager = () => {
  const [menus, setMenus] = useState<MealBoxMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  // Confirmation Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    boxType: 'Adult' as 'Adult' | 'Kids' | 'Snack',
    package: 'Standard' as 'Standard' | 'Premium' | 'Elite',
    items: [] as { itemId: string, defaultQuantity: number }[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [menusRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/meal-box-menus`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/admin/menu`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setMenus(await menusRes.json());
      setMenuItems(await itemsRes.json());
    } catch (err) {
      toast.error('Failed to load meal box presets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && editingId ? `${API_BASE_URL}/api/admin/meal-box-menus/${editingId}` : `${API_BASE_URL}/api/admin/meal-box-menus`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsAdding(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ boxType: 'Adult', package: 'Standard', items: [] });
        toast.success(isEditing ? 'Meal box config updated' : 'Meal box config created');
        fetchData();
      } else {
        toast.error('Failed to save meal box template');
      }
    } catch (err) {
      toast.error('Error submitting meal box config');
    }
  };

  const handleEdit = (menu: MealBoxMenu) => {
    setFormData({
      boxType: menu.boxType,
      package: menu.package as any,
      items: menu.items.map(i => ({ itemId: i.itemId._id, defaultQuantity: i.defaultQuantity }))
    });
    setEditingId(menu._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/meal-box-menus/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Meal box config deleted');
        setConfirmDeleteId(null);
        fetchData();
      } else {
        toast.error('Failed to delete meal box config');
      }
    } catch (err) {
      toast.error('Error executing delete action');
    }
  };

  const toggleItem = (itemId: string) => {
    setFormData(prev => {
      const exists = prev.items.find(i => i.itemId === itemId);
      if (exists) {
        return { ...prev, items: prev.items.filter(i => i.itemId !== itemId) };
      }
      return { ...prev, items: [...prev.items, { itemId, defaultQuantity: 1 }] };
    });
  };

  const updateQuantity = (itemId: string, q: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.itemId === itemId ? { ...i, defaultQuantity: Math.max(1, q) } : i)
    }));
  };

  const handleDownloadCSV = () => {
    const headers = "boxType,package,dishes\n";
    const sampleRows = [
      '"Adult","Standard","Butter Chicken|Biryani|Jeera Rice|Gulab Jamun"\n',
      '"Kids","Premium","Chicken Strips|Fruit Salad|Pasta"\n'
    ].join("");
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal_box_menus_template.csv';
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
      if (lines.length <= 1) return toast.error('CSV data appears empty');
      
      const bulkData = lines.slice(1).map(line => {
        const cols = [];
        let inQuote = false, p = 0;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQuote = !inQuote;
          else if (line[i] === ',' && !inQuote) { cols.push(line.slice(p, i)); p = i + 1; }
        }
        cols.push(line.slice(p));
        const [boxType, pkg, dishes] = cols.map(c => c.replace(/^"|"$/g, '').trim());
        return {
          boxType,
          package: pkg,
          dishes: dishes.split('|').map(d => d.trim())
        };
      });

      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/meal-box-menus/bulk`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkData)
        });
        if (response.ok) {
          toast.success('Bulk box templates uploaded');
          setIsBulkAdding(false);
          fetchData();
        } else {
          toast.error('Bulk generation failed');
        }
      } catch (err) {
        toast.error('Error during bulk generation');
      }
    };
    reader.readAsText(file);
  };

  const filteredMenus = menus.filter(m => 
    m.boxType.toLowerCase().includes(search.toLowerCase()) || 
    m.package.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-1.5">Meal Box Menus</h1>
          <p className="text-gray-400 text-sm font-medium">Link specific Meal Box sizes and age groups to preset catalog course layouts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBulkAdding(true)} 
            className="btn btn-secondary btn-sm"
          >
            Bulk Config
          </button>
          <button 
            onClick={() => {
              setFormData({ boxType: 'Adult', package: 'Standard', items: [] });
              setIsEditing(false); setIsAdding(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Create Presets
          </button>
        </div>
      </div>

      {/* CSV Bulk Template Modal */}
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
              <h2 className="text-2xl font-bold font-playfair mb-2 text-white">Bulk Template Upload</h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">Import complex preset box layouts by spreadsheet format.</p>
              
              <div className="space-y-4 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">1. Download blueprint</p>
                  <button onClick={handleDownloadCSV} className="w-full btn btn-secondary btn-sm flex items-center justify-center gap-2">
                    <Download size={14} /> Download Template
                  </button>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">2. Upload file</p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-tan file:text-richBlack file:cursor-pointer" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setIsBulkAdding(false)} className="text-gray-500 hover:text-white font-semibold text-sm transition-colors">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit/Create Modal Drawer */}
      <AnimatePresence>
        {isAdding && (
          <div className="modal-overlay" onClick={() => setIsAdding(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="modal-box max-w-4xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold font-playfair mb-6 text-white">{isEditing ? 'Modify Meal Box Template' : 'New Meal Box Template'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Box Audience Type</label>
                    <select className="input-field" value={formData.boxType} onChange={e => setFormData({...formData, boxType: e.target.value as any})}>
                      {ALL_BOX_TYPES.map(type => <option key={type} value={type} className="bg-[#0A0A0A]">{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Preset Package Level</label>
                    <select className="input-field" value={formData.package} onChange={e => setFormData({...formData, package: e.target.value as any})}>
                      {ALL_PACKAGES.map(pkg => <option key={pkg} value={pkg} className="bg-[#0A0A0A]">{pkg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                  {/* Select Catalog Panel */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Available Menu Catalog</label>
                      <div className="relative w-40">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="text" placeholder="Filter list..." className="w-full bg-[#4A0000]/40 border border-white/10 rounded-lg py-1 pl-7 pr-2 text-xs focus:ring-1 focus:ring-tan/30 focus:outline-none" value={itemSearch} onChange={e => setItemSearch(e.target.value)} />
                      </div>
                    </div>
                    <div className="h-64 overflow-y-auto space-y-1.5 border border-white/10 rounded-xl p-3 bg-black/20 custom-scrollbar">
                      {menuItems.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase())).map(item => {
                        const isSelected = formData.items.find(fi => fi.itemId === item._id);
                        return (
                          <div 
                            key={item._id} onClick={() => toggleItem(item._id)}
                            className={`p-2.5 rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                              isSelected ? 'bg-tan/10 border border-tan/20 text-white' : 'hover:bg-white/5 border border-transparent text-gray-400'
                            }`}
                          >
                            <span className="text-xs font-medium">{item.name}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Items Panel */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Selected Course Config ({formData.items.length})</label>
                    <div className="h-64 overflow-y-auto space-y-2 border border-white/10 rounded-xl p-3 bg-black/20 custom-scrollbar">
                      {formData.items.map((fi) => {
                        const item = menuItems.find(i => i._id === fi.itemId);
                        if (!item) return null;
                        return (
                          <div key={fi.itemId} className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                            <span className="text-xs font-medium text-gray-200 flex-1 truncate">{item.name}</span>
                            <div className="flex items-center gap-2">
                               <input 
                                type="number" min="1" className="w-12 bg-black/30 border border-white/10 rounded-lg text-center text-xs p-1 focus:outline-none"
                                value={fi.defaultQuantity} onChange={e => updateQuantity(fi.itemId, parseInt(e.target.value))}
                                title="Default Portion Count"
                               />
                               <button type="button" onClick={() => toggleItem(fi.itemId)} className="text-red-400 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                            </div>
                          </div>
                        );
                      })}
                      {formData.items.length === 0 && (
                        <div className="text-gray-500 text-center py-16 text-xs italic flex items-center justify-center gap-1">
                          <UtensilsCrossed size={14} /> Click items on the left to include.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Template Configuration</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter and Search */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text" placeholder="Search templates by audience type or package..."
            className="w-full bg-[#4A0000]/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-tan/30 focus:outline-none transition-all placeholder:text-gray-600 text-sm"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Presets Table */}
      <div className="bg-[#2D0000] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse admin-table">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Box Type</th>
                <th className="px-6 py-4">Package Level</th>
                <th className="px-6 py-4">Default Course Config</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500 italic">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-tan animate-ping" /> Loading meal box templates...
                    </div>
                  </td>
                </tr>
              ) : filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-500 italic">
                    No custom meal box presets matched your query.
                  </td>
                </tr>
              ) : (
                filteredMenus.map(menu => (
                  <tr key={menu._id} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4">
                      <span className={`badge ${getAudienceBadgeStyle(menu.boxType)}`}>
                        {menu.boxType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-tan/10 border border-tan/20 px-2.5 py-1 rounded-md text-xs text-tan font-bold uppercase tracking-wider">
                        {menu.package}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 max-w-md truncate">
                      {menu.items && menu.items.length > 0 ? (
                        menu.items.map(i => i.itemId?.name).join(', ')
                      ) : (
                        <span className="text-gray-600 italic">Empty Configuration</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(menu)} 
                          className="btn btn-icon bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          title="Edit Meal Box Config"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(menu._id)} 
                          className="btn btn-icon bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Delete Config"
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

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmDeleteId !== null}
        title="Delete Meal Box Preset"
        message="Are you sure you want to delete this meal box preset config? Users requesting this combination will default to empty choice sets."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default MealBoxMenuManager;
