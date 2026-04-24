import json

items = [
  { "name": 'Chicken Tikka', "category": 'Starters', "base_price": 35, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Non-Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Paneer Tikka', "category": 'Starters', "base_price": 30, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Mutton Seekh Kebab', "category": 'Starters', "base_price": 45, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Non-Veg', "packages": ['Premium', 'Elite'], "occasions": ['Wedding Event', 'Corporate Event'], "is_active": True },
  { "name": 'Caesar Salad', "category": 'Salads', "base_price": 25, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Russian Salad', "category": 'Salads', "base_price": 28, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Butter Chicken', "category": 'Curry & Masala', "base_price": 45, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Non-Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Mutton Rogan Josh', "category": 'Curry & Masala', "base_price": 55, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Non-Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Paneer Butter Masala', "category": 'Curry & Masala', "base_price": 40, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Dal Makhani', "category": 'Main Course', "base_price": 30, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Jeera Rice', "category": 'Rice', "base_price": 20, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Chicken Biryani', "category": 'Rice', "base_price": 50, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Non-Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Mutton Biryani', "category": 'Rice', "base_price": 60, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Non-Veg', "packages": ['Elite'], "occasions": ['Wedding Event'], "is_active": True },
  { "name": 'Assorted Naan', "category": 'Breads', "base_price": 15, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Tandoori Roti', "category": 'Breads', "base_price": 10, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Sweet Corn Soup', "category": 'Soup', "base_price": 20, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Hot & Sour Soup', "category": 'Soup', "base_price": 22, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Penne Alfredo', "category": 'Pasta', "base_price": 35, "weight_ratio_per_10_guests": 0.1, "dietary_tag": 'Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Gulab Jamun', "category": 'Desserts', "base_price": 25, "weight_ratio_per_10_guests": 0.03, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Rasmalai', "category": 'Desserts', "base_price": 35, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Gajar Ka Halwa', "category": 'Desserts', "base_price": 30, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Elite'], "occasions": ['Wedding Event'], "is_active": True },
  { "name": 'Samosa', "category": 'Snacks', "base_price": 15, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['House Party', 'Kitty Party'], "is_active": True },
  { "name": 'Mango Lassi', "category": 'Beverages', "base_price": 18, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Mint Lemonade', "category": 'Beverages', "base_price": 15, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Raita', "category": 'Accompaniments', "base_price": 10, "weight_ratio_per_10_guests": 0.05, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True },
  { "name": 'Papad', "category": 'Accompaniments', "base_price": 5, "weight_ratio_per_10_guests": 0.01, "dietary_tag": 'Veg', "packages": ['Standard', 'Premium', 'Elite'], "occasions": ['All'], "is_active": True }
]

rows = [f'"{r["name"]}","{r["category"]}",{r["base_price"]},{r["weight_ratio_per_10_guests"]},"{r["dietary_tag"]}","{"|".join(r["packages"])}","{"|".join(r["occasions"])}\\n"' for r in items]
js_rows = ",\n      ".join(rows)

import re
with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'r') as f:
    text = f.read()

new_dl = f"""  const handleDownloadCSV = () => {{
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag,packages,occasions\\\\n";
    const sampleRows = [
      {js_rows}
    ].join("");
    const blob = new Blob([headers + sampleRows], {{ type: 'text/csv' }});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sahibs_menu_comprehensive_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }};"""

text = re.sub(r"  const handleDownloadCSV = \(\) => \{.+?URL\.revokeObjectURL\(url\);\n  \};", new_dl, text, flags=re.DOTALL)

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'w') as f:
    f.write(text)

print("Done")
