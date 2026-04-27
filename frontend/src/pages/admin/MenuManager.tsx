import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';

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
      console.error('Failed to fetch menu items');
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
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleToggleActive = async (item: MenuItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/api/admin/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: !item.is_active })
      });
      fetchItems();
    } catch (err) { console.error(err); }
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_BASE_URL}/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;
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
        setSelectedIds([]);
        fetchItems();
      }
    } catch (err) { console.error(err); }
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
        setSelectedIds([]);
        fetchItems();
      }
    } catch (err) { console.error(err); }
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
      '"Mutton Seekh Kebab","Starters",45,0.05,"Non-Veg","Premium|Elite","Wedding Event|Corporate Event"\n',
      '"Caesar Salad","Salads",25,0.1,"Veg","Standard|Premium|Elite","All"\n',
      '"Russian Salad","Salads",28,0.1,"Veg","Premium|Elite","All"\n',
      '"Butter Chicken","Curry & Masala",45,0.1,"Non-Veg","Standard|Premium|Elite","All"\n',
      '"Mutton Rogan Josh","Curry & Masala",55,0.1,"Non-Veg","Premium|Elite","All"\n',
      '"Paneer Butter Masala","Curry & Masala",40,0.1,"Veg","Standard|Premium|Elite","All"\n',
      '"Dal Makhani","Main Course",30,0.1,"Veg","Standard|Premium|Elite","All"\n',
      '"Jeera Rice","Rice",20,0.1,"Veg","Standard|Premium|Elite","All"\n',
      '"Chicken Biryani","Rice",50,0.1,"Non-Veg","Premium|Elite","All"\n',
      '"Mutton Biryani","Rice",60,0.1,"Non-Veg","Elite","Wedding Event"\n',
      '"Assorted Naan","Breads",15,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Tandoori Roti","Breads",10,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Sweet Corn Soup","Soup",20,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Hot & Sour Soup","Soup",22,0.05,"Veg","Premium|Elite","All"\n',
      '"Penne Alfredo","Pasta",35,0.1,"Veg","Premium|Elite","All"\n',
      '"Gulab Jamun","Desserts",25,0.03,"Veg","Standard|Premium|Elite","All"\n',
      '"Rasmalai","Desserts",35,0.05,"Veg","Premium|Elite","All"\n',
      '"Gajar Ka Halwa","Desserts",30,0.05,"Veg","Elite","Wedding Event"\n',
      '"Samosa","Snacks",15,0.05,"Veg","Standard|Premium|Elite","House Party|Kitty Party"\n',
      '"Mango Lassi","Beverages",18,0.05,"Veg","Premium|Elite","All"\n',
      '"Mint Lemonade","Beverages",15,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Raita","Accompaniments",10,0.05,"Veg","Standard|Premium|Elite","All"\n',
      '"Papad","Accompaniments",5,0.01,"Veg","Standard|Premium|Elite","All"\n'
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
      if (lines.length <= 1) return alert('File is empty or only has headers');
      
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
        await fetch(`${API_BASE_URL}/api/admin/menu/bulk`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkItems)
        });
        setIsBulkAdding(false);
        fetchItems();
      } catch (err) {
        console.error(err);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Menu Management</h1>
          <p className="text-gray-400">Manage Catering & Meal Pack items</p>
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
            onClick={() => setIsBulkAdding(true)}
            className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/20 transition-all"
          >
            Bulk Add
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', packages: [], occasions: [], is_active: true });
              setIsEditing(false); setEditingId(null); setIsAdding(true);
            }}
            className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-tan/90 transition-all"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>
      </div>

      
      {isBulkAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-2xl w-full max-w-md shadow-xl text-center">
            <h2 className="text-2xl font-bold font-playfair mb-6">Bulk Add Menu Items</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 mb-2 text-sm">Step 1: Download the CSV template</p>
                <button onClick={handleDownloadCSV} className="w-full bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all">Download Template</button>
              </div>
              <div>
                <p className="text-gray-400 mb-2 text-sm">Step 2: Upload filled CSV</p>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button type="button" onClick={() => setIsBulkAdding(false)} className="px-5 py-2 text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-2xl w-full max-w-xl shadow-xl">
            {isEditing ? <h2 className="text-2xl font-bold font-playfair mb-6">Edit Menu Item</h2> : <h2 className="text-2xl font-bold font-playfair mb-6">Add New Menu Item</h2>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Item Name</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {ALL_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-charcoal">{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Dietary Tag</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.dietary_tag} onChange={e => setFormData({...formData, dietary_tag: e.target.value})}
                  >
                    <option value="Veg" className="bg-charcoal">Veg</option>
                    <option value="Non-Veg" className="bg-charcoal">Non-Veg</option>
                    <option value="Mixed" className="bg-charcoal">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Base Price (AED)</label>
                  <input 
                    type="number" required min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.base_price} onChange={e => setFormData({...formData, base_price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Weight/10 Guests</label>
                  <input 
                    type="number" required min="0" step="0.1"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.weight_ratio_per_10_guests} onChange={e => setFormData({...formData, weight_ratio_per_10_guests: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Packages</label>
                  <div className="space-y-2">
                    {ALL_PACKAGES.map(pkg => (
                      <label key={pkg} className="flex items-center gap-2 text-white">
                        <input 
                          type="checkbox" 
                          checked={formData.packages.includes(pkg)}
                          onChange={e => {
                            const newPkgs = e.target.checked 
                              ? [...formData.packages, pkg] 
                              : formData.packages.filter(p => p !== pkg);
                            setFormData({...formData, packages: newPkgs});
                          }}
                          className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        />
                        {pkg}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Occasions</label>
                  <div className="space-y-2 h-32 overflow-y-auto">
                    {ALL_OCCASIONS.map(occ => (
                      <label key={occ} className="flex items-center gap-2 text-white text-sm">
                        <input 
                          type="checkbox" 
                          checked={formData.occasions.includes(occ)}
                          onChange={e => {
                            const newOcc = e.target.checked 
                              ? [...formData.occasions, occ] 
                              : formData.occasions.filter(o => o !== occ);
                            setFormData({...formData, occasions: newOcc});
                          }}
                          className="w-4 h-4 bg-white/5 border border-white/10 rounded"
                        />
                        {occ}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold hover:bg-tan/90">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full bg-charcoal border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-tan focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <select 
            className="bg-charcoal border border-white/10 rounded-lg py-2 px-4 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat} className="bg-[#0A0A0A]">{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-white/5 border border-white/10 rounded" 
                  checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Item Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Base Price</th>
              <th className="px-6 py-4 font-semibold">Dietary</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading items...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No items found</td></tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item._id} className={`hover:bg-white/5 transition-colors group ${selectedIds.includes(item._id) ? 'bg-white/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 bg-white/5 border border-white/10 rounded" 
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">AED {item.base_price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs ${item.dietary_tag === 'Veg' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.dietary_tag}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleActive(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-2 text-sm text-gray-400">{item.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
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

export default MenuManager;
