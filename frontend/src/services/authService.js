import api from './api';
import { setStoredAuth, clearStoredAuth } from '../utils/jwtUtils';

export const authService = {
  /**
   * Login user with AuthRequestDto { username, password }
   */
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data && response.data.token) {
      setStoredAuth(response.data.token, response.data);
    }
    return response.data;
  },

  /**
   * Register user with RegisterDto { username, email, password, role }
   */
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data && response.data.token) {
      setStoredAuth(response.data.token, response.data);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout() {
    clearStoredAuth();
  },

  /**
   * Get all registered system users (Project Director only)
   */
  async getAllUsers() {
    const response = await api.get('/api/auth/users');
    return response.data;
  }
};

export default authService;
