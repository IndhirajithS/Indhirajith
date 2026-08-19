import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import documentReducer from './slices/documentSlice';
import versionReducer from './slices/versionSlice';
import reviewReducer from './slices/reviewSlice';
import auditReducer from './slices/auditSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    document: documentReducer,
    version: versionReducer,
    review: reviewReducer,
    audit: auditReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
