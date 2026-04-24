import re

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'r') as f:
    text = f.read()

# 1. State
text = text.replace(
    "const [isAdding, setIsAdding] = useState(false);",
    """const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isBulkAdding, setIsBulkAdding] = useState(false);"""
)

# 2. handleAddItem -> handle functions
handle_functions = """const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing && editingId ? `http://localhost:5000/api/admin/menu/${editingId}` : 'http://localhost:5000/api/admin/menu';
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
        setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', is_active: true });
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name, category: item.category, base_price: item.base_price,
      weight_ratio_per_10_guests: (item as any).weight_ratio_per_10_guests || 1,
      dietary_tag: item.dietary_tag, is_active: item.is_active
    });
    setEditingId(item._id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const handleDownloadCSV = () => {
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag\\n";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_format.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) return alert('File is empty or only has headers');
      
      const bulkItems = lines.slice(1).map(line => {
        const [name, category, base_price, weight_ratio, dietary_tag] = line.split(',');
        return {
          name: name?.strip() if hasattr(name, 'strip') else name?.trim(),
          category: category?.trim() || 'Main Course',
          base_price: Number(base_price) || 0,
          weight_ratio_per_10_guests: Number(weight_ratio) || 1,
          dietary_tag: dietary_tag?.trim() || 'Veg',
          is_active: true
        };
      });

      try {
        const token = localStorage.getItem('adminToken');
        await fetch('http://localhost:5000/api/admin/menu/bulk', {
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
  };"""

text = re.sub(r"const handleAddItem = async \(e: React.FormEvent\) => \{.*?\n  \};\n+", handle_functions + "\n\n", text, flags=re.DOTALL)

# Python bug: JS `.trim()` used in template string inside Python literal. We need to fix the Python literal above `name?.strip() if hasattr(...)`
# Let's fix that JS array mapping
text = text.replace("name?.strip() if hasattr(name, 'strip') else name?.trim()", "name ? name.trim() : ''")

# 3. Buttons Top
buttons_old = """<button 
          onClick={() => setIsAdding(true)}
          className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-tan/90 transition-all"
        >
          <Plus size={20} />
          Add Item
        </button>"""

buttons_new = """<div className="flex gap-3">
          <button 
            onClick={() => setIsBulkAdding(true)}
            className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/20 transition-all"
          >
            Bulk Add
          </button>
          <button 
            onClick={() => {
              setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', is_active: true });
              setIsEditing(false); setEditingId(null); setIsAdding(true);
            }}
            className="bg-tan text-richBlack px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-tan/90 transition-all"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>"""

text = text.replace(buttons_old, buttons_new)

# 4. Bulk Add UI
bulk_ui = """
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
"""

text = text.replace("{isAdding && (", bulk_ui + "\n      {isAdding && (")

# 5. Modal Title and submit
text = text.replace("<h2 className=\"text-2xl font-bold font-playfair mb-6\">Add New Menu Item</h2>", "{isEditing ? <h2 className=\"text-2xl font-bold font-playfair mb-6\">Edit Menu Item</h2> : <h2 className=\"text-2xl font-bold font-playfair mb-6\">Add New Menu Item</h2>}")
text = text.replace("<form onSubmit={handleAddItem}", "<form onSubmit={handleSubmit}")

# 6. Buttons in rows (Edit / Delete)
edit_btn = """<button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>"""
text = text.replace(edit_btn, """<button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>""")

del_btn = """<button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                        <Trash2 size={16} />
                      </button>"""
text = text.replace(del_btn, """<button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                        <Trash2 size={16} />
                      </button>""")

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'w') as f:
    f.write(text)

print("Done")
