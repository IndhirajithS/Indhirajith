import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import versionService from '../../services/versionService';

export const createDraftVersion = createAsyncThunk(
  'version/createDraft',
  async (versionData, { rejectWithValue }) => {
    try {
      const data = await versionService.create(versionData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create draft version');
    }
  }
);

export const fetchVersionHistory = createAsyncThunk(
  'version/fetchHistory',
  async (docId, { rejectWithValue }) => {
    try {
      const data = await versionService.getHistory(docId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch version history');
    }
  }
);

export const compareVersions = createAsyncThunk(
  'version/compare',
  async ({ docId, v1, v2 }, { rejectWithValue }) => {
    try {
      const data = await versionService.compare(docId, v1, v2);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to compare versions');
    }
  }
);

const versionSlice = createSlice({
  name: 'version',
  initialState: {
    history: [],
    currentVersion: null,
    comparison: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearComparison: (state) => {
      state.comparison = null;
    },
    clearVersionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDraftVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDraftVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.history.unshift(action.payload);
        state.currentVersion = action.payload;
      })
      .addCase(createDraftVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVersionHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(compareVersions.fulfilled, (state, action) => {
        state.comparison = action.payload;
      });
  },
});

export const { clearComparison, clearVersionError } = versionSlice.actions;
export default versionSlice.reducer;
