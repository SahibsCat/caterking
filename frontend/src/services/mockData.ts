export interface MenuItem {
  id: string;
  name: string;
  category: 'Main Course' | 'Starter' | 'Dessert';
  base_price: number;
  weight_ratio: number;
  dietary: 'Veg' | 'Non-Veg';
}

export const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Butter Chicken', category: 'Main Course', base_price: 45, weight_ratio: 0.1, dietary: 'Non-Veg' },
  { id: '2', name: 'Paneer Butter Masala', category: 'Main Course', base_price: 40, weight_ratio: 0.1, dietary: 'Veg' },
  { id: '3', name: 'Chicken Tikka', category: 'Starter', base_price: 35, weight_ratio: 0.05, dietary: 'Non-Veg' },
  { id: '4', name: 'Veg Samosa', category: 'Starter', base_price: 20, weight_ratio: 0.05, dietary: 'Veg' },
  { id: '5', name: 'Gulab Jamun', category: 'Dessert', base_price: 25, weight_ratio: 0.03, dietary: 'Veg' },
  { id: '6', name: 'Mutton Biryani', category: 'Main Course', base_price: 55, weight_ratio: 0.1, dietary: 'Non-Veg' },
];
