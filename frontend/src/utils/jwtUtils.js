/**
 * Helper functions for JWT token handling, expiration checking, and role extraction.
 */

/**
 * Decode JWT token payload without external libraries.
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT token:', e);
    return null;
  }
};

/**
 * Check if token is expired.
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Parse roles from JWT payload or user object.
 */
export const parseUserRoles = (tokenOrUser) => {
  if (!tokenOrUser) return [];
  
  if (typeof tokenOrUser === 'string') {
    const decoded = decodeToken(tokenOrUser);
    if (!decoded) return [];
    // Role can be in 'role', 'roles', or Spring 'authorities'
    const rawRole = decoded.role || decoded.roles || decoded.authorities || [];
    if (Array.isArray(rawRole)) {
      return rawRole.map((r) => (typeof r === 'string' ? r : r.authority || ''));
    }
    return [rawRole];
  }

  if (tokenOrUser.role) {
    return Array.isArray(tokenOrUser.role) ? tokenOrUser.role : [tokenOrUser.role];
  }

  return [];
};

/**
 * Get current token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem('draftdash_token');
};

/**
 * Store token & user info in localStorage
 */
export const setStoredAuth = (token, user) => {
  if (token) localStorage.setItem('draftdash_token', token);
  if (user) localStorage.setItem('draftdash_user', JSON.stringify(user));
};

/**
 * Clear stored token & user info
 */
export const clearStoredAuth = () => {
  localStorage.removeItem('draftdash_token');
  localStorage.removeItem('draftdash_user');
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = () => {
  const data = localStorage.getItem('draftdash_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
