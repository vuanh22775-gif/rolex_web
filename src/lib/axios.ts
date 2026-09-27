import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(undefined, (error) => {
  const url = String(error.config?.url || '');
  const isSessionEndpoint = url.endsWith('/auth/check') || url.endsWith('/auth/login') || url.includes('/profile/password');
  if (error.response?.status === 401 && !isSessionEndpoint && window.location.pathname.startsWith('/admin')) {
    window.location.reload();
  }
  return Promise.reject(error);
});