import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from '../../services/documentService';

export const fetchDocuments = createAsyncThunk(
  'document/fetchAll',
  async (param, { rejectWithValue }) => {
    try {
      const params =
        typeof param === 'object' && param !== null
          ? param
          : param
          ? { workspaceId: param }
          : undefined;
      const data = await documentService.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'document/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await documentService.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch document');
    }
  }
);

export const createDocument = createAsyncThunk(
  'document/create',
  async (docData, { rejectWithValue }) => {
    try {
      const data = await documentService.create(docData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create document');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'document/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await documentService.update(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'document/delete',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete document');
    }
  }
);

export const submitDocumentForReview = createAsyncThunk(
  'document/submitForReview',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.submitForReview(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit document');
    }
  }
);

export const retractDocumentSubmission = createAsyncThunk(
  'document/retractSubmission',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.retractSubmission(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to retract submission');
    }
  }
);

export const fetchDocumentVersions = createAsyncThunk(
  'document/fetchVersions',
  async (id, { rejectWithValue }) => {
    try {
      const versions = await documentService.getVersions(id);
      return { documentId: id, versions };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch document versions');
    }
  }
);

const documentSlice = createSlice({
  name: 'document',
  initialState: {
    documents: [],
    currentDocument: null,
    versions: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },
    clearDocumentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDocuments
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchDocumentById
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.currentDocument = action.payload;
      })
      // createDocument
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload);
      })
      // deleteDocument
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
        if (state.currentDocument?.id === action.payload) {
          state.currentDocument = null;
        }
      })
      // fetchDocumentVersions
      .addCase(fetchDocumentVersions.fulfilled, (state, action) => {
        state.versions = action.payload.versions;
      });
  },
});

export const { setCurrentDocument, clearDocumentError } = documentSlice.actions;
export default documentSlice.reducer;
