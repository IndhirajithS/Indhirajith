import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import documentReducer from './slices/documentSlice';
import versionReducer from './slices/versionSlice';
import reviewReducer from './slices/reviewSlice';
import auditReducer from './slices/auditSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    document: documentReducer,
    version: versionReducer,
    review: reviewReducer,
    reviews: reviewReducer,
    audit: auditReducer,
    notification: notificationReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
