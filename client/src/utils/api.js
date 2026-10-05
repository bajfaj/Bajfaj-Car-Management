export const API_URL = import.meta.env.VITE_API_URL || '';

export function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  
  // if API_URL is set use it, else use relative url (vite proxy)
  const finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  
  return fetch(finalUrl, { ...options, headers }).then(res => {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    return res;
  });
}