import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

import DocumentList from './components/document/DocumentList';
import authReducer from './store/slices/authSlice';
import workspaceReducer from './store/slices/workspaceSlice';
import documentReducer from './store/slices/documentSlice';
import documentService from './services/documentService';
import workspaceService from './services/workspaceService';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      workspace: workspaceReducer,
      workspaces: workspaceReducer,
      document: documentReducer,
      documents: documentReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

describe('T5 Test', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('T5 — DocumentList API fetch invocation', async () => {
    const getDocsSpy = jest.spyOn(documentService, 'getAll').mockResolvedValue([]);
    const getWorkspacesSpy = jest.spyOn(workspaceService, 'getAll').mockResolvedValue([]);

    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'director_user', role: 'PROJECT_DIRECTOR' },
        token: 'mock-token',
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(getDocsSpy).toHaveBeenCalled();
    });
  });
});
