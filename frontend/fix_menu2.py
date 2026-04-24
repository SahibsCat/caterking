import re

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'r') as f:
    text = f.read()

# 1. Update MenuItem Interface
text = text.replace(
    "  dietary_tag: string;\n  is_active: boolean;\n}",
    "  dietary_tag: string;\n  packages: string[];\n  occasions: string[];\n  is_active: boolean;\n}"
)

# 2. Update formData
text = text.replace(
    "dietary_tag: 'Veg',\n    is_active: true\n  });",
    "dietary_tag: 'Veg',\n    packages: [] as string[],\n    occasions: [] as string[],\n    is_active: true\n  });"
)

# 3. Add constants
text = re.sub(
    r"const MenuManager = \(\) => \{\n  const \[items, setItems\]",
    """const ALL_CATEGORIES = ['Starters', 'Salads', 'Main Course', 'Rice', 'Breads', 'Desserts', 'Soup', 'Curry & Masala', 'Pasta', 'Snacks', 'Beverages', 'Accompaniments'];
const ALL_PACKAGES = ['Standard', 'Premium', 'Elite'];
const ALL_OCCASIONS = ['Birthday Party', 'House Party', 'Kids Party', 'Pre Wedding Event', 'Wedding Event', 'Baby Shower', 'Dinners / Guests', 'Kitty Party', 'Housewarming', 'Corporate Event', 'Get Together', 'Other'];

const MenuManager = () => {
  const [items, setItems]""",
    text
)

# 4. handleToggleActive
handleToggleActive = """
  const handleToggleActive = async (item: MenuItem) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`http://localhost:5000/api/admin/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: !item.is_active })
      });
      fetchItems();
    } catch (err) { console.error(err); }
  };
"""

text = text.replace("const handleEdit", handleToggleActive + "\n  const handleEdit")

# 5. Reset formData in handleSubmit & handleEdit
text = text.replace(
    "setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', is_active: true });",
    "setFormData({ name: '', category: 'Main Course', base_price: 0, weight_ratio_per_10_guests: 1, dietary_tag: 'Veg', packages: [], occasions: [], is_active: true });"
)
text = text.replace(
    "dietary_tag: item.dietary_tag, is_active: item.is_active\n    });",
    "dietary_tag: item.dietary_tag, packages: item.packages || [], occasions: item.occasions || [], is_active: item.is_active\n    });"
)

# 6. CSV headers and templates
download_csv = """  const handleDownloadCSV = () => {
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag,packages,occasions\\n";
    const sampleRows = [
      "Chicken Tikka,Starters,35,0.05,Non-Veg,Standard|Premium|Elite,Wedding Event|Corporate Event\\n",
      "Caesar Salad,Salads,25,0.05,Veg,Premium|Elite,House Party|Dinners / Guests\\n",
      "Butter Chicken,Curry & Masala,45,0.1,Non-Veg,Standard|Premium|Elite,Birthday Party|Get Together\\n",
      "Jeera Rice,Rice,20,0.1,Veg,Standard|Premium|Elite,All\\n",
      "Gulab Jamun,Desserts,15,0.03,Veg,Standard|Premium|Elite,All\\n"
    ].join("");
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };"""

text = re.sub(r"const handleDownloadCSV = \(\) => \{.+?URL\.revokeObjectURL\(url\);\n  \};", download_csv, text, flags=re.DOTALL)

# 7. File upload
upload_map = """      const bulkItems = lines.slice(1).map(line => {
        const [name, category, base_price, weight_ratio, dietary_tag, packages, occasions] = line.split(',');
        return {
          name: name ? name.trim() : '',
          category: category?.trim() || 'Main Course',
          base_price: Number(base_price) || 0,
          weight_ratio_per_10_guests: Number(weight_ratio) || 1,
          dietary_tag: dietary_tag?.trim() || 'Veg',
          packages: packages ? packages.split('|').map(p => p.trim()) : [],
          occasions: occasions ? occasions.split('|').map(o => o.trim()) : [],
          is_active: true
        };
      });"""

text = re.sub(r"const bulkItems = lines\.slice\(1\)\.map\(line => \{.+?\}\);", upload_map, text, flags=re.DOTALL)

# 8. Category Dropdown
cat_dropdown = """<select 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {ALL_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-charcoal">{cat}</option>)}
                  </select>"""

text = re.sub(r"<select[\s\n]+className=\"w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white\"[\s\n]+value=\{formData\.category\}.+?</select>", cat_dropdown, text, flags=re.DOTALL)

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'w') as f:
    f.write(text)

print("Done")
