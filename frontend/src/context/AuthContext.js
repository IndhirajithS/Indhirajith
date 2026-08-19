import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import {
  getStoredToken,
  getStoredUser,
  isTokenExpired,
  clearStoredAuth,
  parseUserRoles
} from '../utils/jwtUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate stored token on mount
    const savedToken = getStoredToken();
    if (savedToken && isTokenExpired(savedToken)) {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setToken(data.token);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const userRoles = parseUserRoles(user || token);

  const hasRole = (role) => {
    if (!role) return true;
    if (Array.isArray(role)) {
      return role.some((r) => userRoles.includes(r) || userRoles.includes(`ROLE_${r}`));
    }
    return userRoles.includes(role) || userRoles.includes(`ROLE_${role}`);
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !isTokenExpired(token),
    roles: userRoles,
    hasRole,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
