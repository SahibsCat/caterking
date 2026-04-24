import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Layers, Download } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
}

interface OccasionMenu {
  _id: string;
  occasion: string;
  package: string;
  items: {
    itemId: MenuItem;
    defaultQuantity: number;
  }[];
  basePrice?: number;
}

const ALL_PACKAGES = ['Standard', 'Premium', 'Elite'];
const ALL_OCCASIONS = ['Birthday Party', 'House Party', 'Kids Party', 'Pre Wedding Event', 'Wedding Event', 'Baby Shower', 'Dinners / Guests', 'Kitty Party', 'Housewarming', 'Corporate Event', 'Get Together', 'Other'];

const OccasionMenuManager = () => {
  const [menus, setMenus] = useState<OccasionMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

  const [formData, setFormData] = useState({
    occasion: 'Birthday Party',
    package: 'Standard',
    items: [] as { itemId: string, defaultQuantity: number }[],
    basePrice: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [menusRes, itemsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/occasion-menus', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/admin/menu', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setMenus(await menusRes.json());
      setMenuItems(await itemsRes.json());
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && editingId ? `http://localhost:5000/api/admin/occasion-menus/${editingId}` : 'http://localhost:5000/api/admin/occasion-menus';
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
        setFormData({ occasion: 'Birthday Party', package: 'Standard', items: [], basePrice: 0 });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (menu: OccasionMenu) => {
    setFormData({
      occasion: menu.occasion,
      package: menu.package,
      items: menu.items.map(i => ({ itemId: i.itemId._id, defaultQuantity: i.defaultQuantity })),
      basePrice: menu.basePrice || 0
    });
    setEditingId(menu._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu group?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/occasion-menus/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { console.error(err); }
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
    const headers = "occasion,package,dishes,basePrice\n";
    const sampleRows = [
      '"Birthday Party","Standard","Chicken Tikka|Dal Makhani|Jeera Rice|Gulab Jamun",120\n',
      '"Wedding Event","Premium","Mutton Seekh Kebab|Butter Chicken|Biryani|Rasmalai",180\n'
    ].join("");
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'occasion_menus_template.csv';
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
      if (lines.length <= 1) return alert('File is empty');
      
      const bulkData = lines.slice(1).map(line => {
        const cols = [];
        let inQuote = false, p = 0;
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') inQuote = !inQuote;
          else if (line[i] === ',' && !inQuote) { cols.push(line.slice(p, i)); p = i + 1; }
        }
        cols.push(line.slice(p));
        const [occ, pkg, dishes, price] = cols.map(c => c.replace(/^"|"$/g, '').trim());
        return {
          occasion: occ,
          package: pkg,
          dishes: dishes.split('|').map(d => d.trim()),
          basePrice: Number(price) || 0
        };
      });

      try {
        const token = localStorage.getItem('adminToken');
        await fetch('http://localhost:5000/api/admin/occasion-menus/bulk', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkData)
        });
        setIsBulkAdding(false);
        fetchData();
      } catch (err) { console.error(err); }
    };
    reader.readAsText(file);
  };

  const filteredMenus = menus.filter(m => 
    m.occasion.toLowerCase().includes(search.toLowerCase()) || 
    m.package.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Occasion Menus</h1>
          <p className="text-gray-400">Group dishes for specific occasions and packages</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsBulkAdding(true)} className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
            <Layers size={20} /> Bulk Menu
          </button>
          <button 
            onClick={() => {
              setFormData({ occasion: 'Birthday Party', package: 'Standard', items: [], basePrice: 0 });
              setIsEditing(false); setIsAdding(true);
            }}
            className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-tan/90 transition-all"
          >
            <Plus size={20} /> Create Menu
          </button>
        </div>
      </div>

      {isBulkAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-2xl w-full max-w-md shadow-xl text-center">
            <h2 className="text-2xl font-bold font-playfair mb-6">Bulk Add Occasion Menus</h2>
            <div className="space-y-6 text-left">
              <div>
                <p className="text-gray-400 mb-2 text-sm">1. Download and fill the CSV template</p>
                <button onClick={handleDownloadCSV} className="w-full bg-white/10 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/20">
                  <Download size={18} /> Download
                </button>
              </div>
              <div>
                <p className="text-gray-400 mb-2 text-sm">2. Upload the filled CSV</p>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white" />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setIsBulkAdding(false)} className="px-5 py-2 text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold font-playfair mb-6">{isEditing ? 'Edit Occasion Menu' : 'New Occasion Menu'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-400 mb-1">Occasion</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" value={formData.occasion} onChange={e => setFormData({...formData, occasion: e.target.value})}>
                    {ALL_OCCASIONS.map(occ => <option key={occ} value={occ} className="bg-[#0A0A0A]">{occ}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Package</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" value={formData.package} onChange={e => setFormData({...formData, package: e.target.value})}>
                    {ALL_PACKAGES.map(pkg => <option key={pkg} value={pkg} className="bg-[#0A0A0A]">{pkg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Base Price (Optional)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Select Dishes</h3>
                    <div className="relative w-40">
                      <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-lg py-1 pl-7 pr-2 text-xs" value={itemSearch} onChange={e => setItemSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="h-64 overflow-y-auto space-y-2 border border-white/10 rounded-xl p-3 bg-black/20">
                    {menuItems.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase())).map(item => (
                      <div 
                        key={item._id} onClick={() => toggleItem(item._id)}
                        className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                          formData.items.find(fi => fi.itemId === item._id) ? 'bg-tan/10 border border-tan/30' : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-sm">{item.name}</span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">Menu Selection ({formData.items.length})</h3>
                  <div className="h-64 overflow-y-auto space-y-3 border border-white/10 rounded-xl p-3 bg-black/20">
                    {formData.items.map((fi) => {
                      const item = menuItems.find(i => i._id === fi.itemId);
                      if (!item) return null;
                      return (
                        <div key={fi.itemId} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                          <span className="text-sm flex-1 truncate">{item.name}</span>
                          <div className="flex items-center gap-2">
                             <input 
                              type="number" min="1" className="w-12 bg-black/30 border border-white/10 rounded text-center text-sm p-1"
                              value={fi.defaultQuantity} onChange={e => updateQuantity(fi.itemId, parseInt(e.target.value))}
                             />
                             <button type="button" onClick={() => toggleItem(fi.itemId)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                    {formData.items.length === 0 && <div className="text-gray-500 text-center py-12 text-sm italic">No dishes selected yet</div>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold hover:bg-tan/90">Save Menu Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text" placeholder="Search menus..."
            className="w-full bg-charcoal border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-tan focus:outline-none"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-charcoal border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Occasion</th>
              <th className="px-6 py-4 font-semibold">Package</th>
              <th className="px-6 py-4 font-semibold">Dishes</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading menus...</td></tr>
            ) : filteredMenus.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No menus defined</td></tr>
            ) : (
              filteredMenus.map(menu => (
                <tr key={menu._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium">{menu.occasion}</td>
                  <td className="px-6 py-4">
                    <span className="bg-tan/10 px-2 py-1 rounded text-xs text-tan">{menu.package}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                    {menu.items.map(i => i.itemId?.name).join(', ')}
                  </td>
                  <td className="px-6 py-4">{menu.basePrice ? `AED ${menu.basePrice}` : 'Default'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(menu)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(menu._id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
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

export default OccasionMenuManager;
