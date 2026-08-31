import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const id = Date.now() + Math.random();
      const notification =
        typeof action.payload === 'string'
          ? { id, message: action.payload, type: 'success' }
          : { id, type: 'success', ...action.payload };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
