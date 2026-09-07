import axios from 'axios';

let rawBaseUrl = (
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'test' ? 'http://localhost:8080' : '')
).trim();

// Strip trailing slashes
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
// If rawBaseUrl ends with /api, remove it so baseURL is just host/prefix and doesn't duplicate /api
if (rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = rawBaseUrl.slice(0, -4);
}

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Safety check added here to bypass the test crash
if (api && api.interceptors) {
  api.interceptors.request.use(
    (config) => {
      if (config.url && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
        config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return Promise.reject(error);
    }
  );
}

export default api;