const rawUrl = import.meta.env.VITE_API_URL || 'https://caterking.onrender.com';
export const API_BASE_URL = rawUrl.split('#')[0].replace(/\/+$/, '');
