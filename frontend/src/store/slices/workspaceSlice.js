import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '../../services/workspaceService';

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await workspaceService.getAll();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch workspaces');
    }
  }
);

export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await workspaceService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch workspace');
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspace/create',
  async (workspaceData, { rejectWithValue }) => {
    try {
      const data = await workspaceService.create(workspaceData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create workspace');
    }
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspace/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await workspaceService.update(id, data);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update workspace');
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspace/delete',
  async (id, { rejectWithValue }) => {
    try {
      await workspaceService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete workspace');
    }
  }
);

export const inviteMember = createAsyncThunk(
  'workspace/inviteMember',
  async ({ workspaceId, memberData }, { rejectWithValue }) => {
    try {
      const result = await workspaceService.inviteMember(workspaceId, memberData);
      return { workspaceId, result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to invite member');
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    clearWorkspaceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWorkspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchWorkspaceById
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createWorkspace
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
      })
      // deleteWorkspace
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      });
  },
});

export const { setCurrentWorkspace, clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
