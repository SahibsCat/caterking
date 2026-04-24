import re

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'r') as f:
    text = f.read()

# Replace the specific block
old_block = """  const handleDownloadCSV = () => {
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag,packages,occasions\\n";
    const sampleRows = [
      "Chicken Tikka","Starters",35,0.05,"Non-Veg","Standard|Premium|Elite","All
",
      "Paneer Tikka","Starters",30,0.05,"Veg","Standard|Premium|Elite","All
",
      "Mutton Seekh Kebab","Starters",45,0.05,"Non-Veg","Premium|Elite","Wedding Event|Corporate Event
",
      "Caesar Salad","Salads",25,0.1,"Veg","Standard|Premium|Elite","All
",
      "Russian Salad","Salads",28,0.1,"Veg","Premium|Elite","All
",
      "Butter Chicken","Curry & Masala",45,0.1,"Non-Veg","Standard|Premium|Elite","All
",
      "Mutton Rogan Josh","Curry & Masala",55,0.1,"Non-Veg","Premium|Elite","All
",
      "Paneer Butter Masala","Curry & Masala",40,0.1,"Veg","Standard|Premium|Elite","All
",
      "Dal Makhani","Main Course",30,0.1,"Veg","Standard|Premium|Elite","All
",
      "Jeera Rice","Rice",20,0.1,"Veg","Standard|Premium|Elite","All
",
      "Chicken Biryani","Rice",50,0.1,"Non-Veg","Premium|Elite","All
",
      "Mutton Biryani","Rice",60,0.1,"Non-Veg","Elite","Wedding Event
",
      "Assorted Naan","Breads",15,0.05,"Veg","Standard|Premium|Elite","All
",
      "Tandoori Roti","Breads",10,0.05,"Veg","Standard|Premium|Elite","All
",
      "Sweet Corn Soup","Soup",20,0.05,"Veg","Standard|Premium|Elite","All
",
      "Hot & Sour Soup","Soup",22,0.05,"Veg","Premium|Elite","All
",
      "Penne Alfredo","Pasta",35,0.1,"Veg","Premium|Elite","All
",
      "Gulab Jamun","Desserts",25,0.03,"Veg","Standard|Premium|Elite","All
",
      "Rasmalai","Desserts",35,0.05,"Veg","Premium|Elite","All
",
      "Gajar Ka Halwa","Desserts",30,0.05,"Veg","Elite","Wedding Event
",
      "Samosa","Snacks",15,0.05,"Veg","Standard|Premium|Elite","House Party|Kitty Party
",
      "Mango Lassi","Beverages",18,0.05,"Veg","Premium|Elite","All
",
      "Mint Lemonade","Beverages",15,0.05,"Veg","Standard|Premium|Elite","All
",
      "Raita","Accompaniments",10,0.05,"Veg","Standard|Premium|Elite","All
",
      "Papad","Accompaniments",5,0.01,"Veg","Standard|Premium|Elite","All
"
    ].join("");"""

new_block = """  const handleDownloadCSV = () => {
    const headers = "name,category,base_price,weight_ratio_per_10_guests,dietary_tag,packages,occasions\\n";
    const sampleRows = [
      '"Chicken Tikka","Starters",35,0.05,"Non-Veg","Standard|Premium|Elite","All"\\n',
      '"Paneer Tikka","Starters",30,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Mutton Seekh Kebab","Starters",45,0.05,"Non-Veg","Premium|Elite","Wedding Event|Corporate Event"\\n',
      '"Caesar Salad","Salads",25,0.1,"Veg","Standard|Premium|Elite","All"\\n',
      '"Russian Salad","Salads",28,0.1,"Veg","Premium|Elite","All"\\n',
      '"Butter Chicken","Curry & Masala",45,0.1,"Non-Veg","Standard|Premium|Elite","All"\\n',
      '"Mutton Rogan Josh","Curry & Masala",55,0.1,"Non-Veg","Premium|Elite","All"\\n',
      '"Paneer Butter Masala","Curry & Masala",40,0.1,"Veg","Standard|Premium|Elite","All"\\n',
      '"Dal Makhani","Main Course",30,0.1,"Veg","Standard|Premium|Elite","All"\\n',
      '"Jeera Rice","Rice",20,0.1,"Veg","Standard|Premium|Elite","All"\\n',
      '"Chicken Biryani","Rice",50,0.1,"Non-Veg","Premium|Elite","All"\\n',
      '"Mutton Biryani","Rice",60,0.1,"Non-Veg","Elite","Wedding Event"\\n',
      '"Assorted Naan","Breads",15,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Tandoori Roti","Breads",10,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Sweet Corn Soup","Soup",20,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Hot & Sour Soup","Soup",22,0.05,"Veg","Premium|Elite","All"\\n',
      '"Penne Alfredo","Pasta",35,0.1,"Veg","Premium|Elite","All"\\n',
      '"Gulab Jamun","Desserts",25,0.03,"Veg","Standard|Premium|Elite","All"\\n',
      '"Rasmalai","Desserts",35,0.05,"Veg","Premium|Elite","All"\\n',
      '"Gajar Ka Halwa","Desserts",30,0.05,"Veg","Elite","Wedding Event"\\n',
      '"Samosa","Snacks",15,0.05,"Veg","Standard|Premium|Elite","House Party|Kitty Party"\\n',
      '"Mango Lassi","Beverages",18,0.05,"Veg","Premium|Elite","All"\\n',
      '"Mint Lemonade","Beverages",15,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Raita","Accompaniments",10,0.05,"Veg","Standard|Premium|Elite","All"\\n',
      '"Papad","Accompaniments",5,0.01,"Veg","Standard|Premium|Elite","All"\\n'
    ].join("");"""

text = text.replace(old_block, new_block)

with open('/home/arz/sahibscatering/frontend/src/pages/admin/MenuManager.tsx', 'w') as f:
    f.write(text)

