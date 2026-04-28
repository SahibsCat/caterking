const PROD_URL = 'https://caterking.onrender.com';
const DEV_URL = 'http://localhost:5000';

const rawUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_URL : DEV_URL);
export const API_BASE_URL = rawUrl.split('#')[0].replace(/\/+$/, '');
