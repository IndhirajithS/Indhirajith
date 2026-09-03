import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const getInitialUser = () => {
  try {
    return authService.getCurrentUser();
  } catch (e) {
    return null;
  }
};

const getInitialToken = () => {
  try {
    return authService.getToken() || localStorage.getItem('token') || null;
  } catch (e) {
    return null;
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

const initialToken = getInitialToken();
const initialUser = getInitialUser();

const initialState = {
  user: initialUser || null,
  role: initialUser?.role || null,
  token: initialToken || null,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        // safe
      }
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token || null;
        state.user = action.payload;
        state.role = action.payload?.role || action.payload?.user?.role || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token || null;
        state.user = action.payload;
        state.role = action.payload?.role || action.payload?.user?.role || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
