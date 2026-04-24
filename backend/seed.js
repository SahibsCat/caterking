db = db.getSiblingDB('sahibs_catering');

db.menuitems.drop();
db.menuitems.insertMany([
  {
    name: 'Chicken Tikka',
    description: 'Succulent pieces of chicken marinated in yogurt and spices, grilled to perfection.',
    base_price: 450,
    weight_ratio_per_10_guests: 1.5,
    dietary_tag: 'Non-Veg',
    category: 'Starters',
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Paneer Tikka',
    description: 'Fresh cottage cheese cubes marinated in tandoori spices and grilled.',
    base_price: 350,
    weight_ratio_per_10_guests: 1.5,
    dietary_tag: 'Veg',
    category: 'Starters',
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mutton Biryani',
    description: 'Traditional slow-cooked basmati rice with tender mutton and aromatic spices.',
    base_price: 850,
    weight_ratio_per_10_guests: 2.5,
    dietary_tag: 'Non-Veg',
    category: 'Main Course',
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dal Makhani',
    description: 'Classic black lentils slow-cooked overnight with creamy butter and spices.',
    base_price: 300,
    weight_ratio_per_10_guests: 2.0,
    dietary_tag: 'Veg',
    category: 'Main Course',
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft, melt-in-your-mouth milk dumplings soaked in rose-scented syrup.',
    base_price: 200,
    weight_ratio_per_10_guests: 1.0,
    dietary_tag: 'Veg',
    category: 'Desserts',
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

db.packages.drop();
db.packages.insertMany([
  {
    name: 'Standard',
    base_price_per_guest: 800,
    max_main_course: 2,
    max_starters: 2,
    max_desserts: 1,
    inclusions: ['Basic Crockery', 'Service Staff'],
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Premium',
    base_price_per_guest: 1200,
    max_main_course: 4,
    max_starters: 4,
    max_desserts: 2,
    inclusions: ['Premium Crockery', 'Service Staff', 'Uniformed Servers', 'Water Bottles'],
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Elite',
    base_price_per_guest: 1800,
    max_main_course: 6,
    max_starters: 6,
    max_desserts: 3,
    inclusions: ['Luxury Crockery', 'Gourmet Service Staff', 'Welcome Drinks', 'Live Station'],
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database seeded successfully!');
