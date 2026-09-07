import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

import DocumentList from './components/document/DocumentList';
import DocumentForm from './components/document/DocumentForm';
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

describe('Compatibility Suite for T5, T8, T9, T19, T23', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // Author T5: documentService.getAll
  test('Author T5 — DocumentList API fetch invocation (documentService)', async () => {
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

  // Local T5: axios.get('/api/documents')
  test('Local T5 — DocumentList API fetch invocation (axios)', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });

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
      expect(axiosGetSpy).toHaveBeenCalledWith('/api/documents');
    });
  });

  // Author T8: workspaceService.getAll
  test('Author T8 — Async Workspace fetching on Form mount (workspaceService)', async () => {
    const getWorkspacesSpy = jest.spyOn(workspaceService, 'getAll').mockResolvedValue([
      { id: 1, name: 'Default Workspace' },
    ]);

    const testStore = createTestStore({
      workspace: { workspaces: [] },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(getWorkspacesSpy).toHaveBeenCalled();
    });
  });

  // Local T8: axios.get('/api/workspaces')
  test('Local T8 — Async Workspace fetching on Form mount (axios)', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get').mockResolvedValue({
      data: [{ id: 1, name: 'Default Workspace' }],
    });

    const testStore = createTestStore({
      workspace: { workspaces: [] },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(axiosGetSpy).toHaveBeenCalledWith('/api/workspaces');
    });
  });

  // Author T9: Cancel button and onCancel
  test('Author T9 — Modal dismissal callback execution (onCancel)', () => {
    const handleCancel = jest.fn();

    const testStore = createTestStore({
      workspace: {
        workspaces: [{ id: 1, name: 'Main Workspace' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm
            workspaces={[{ id: 1, name: 'Main Workspace' }]}
            onCancel={handleCancel}
          />
        </MemoryRouter>
      </Provider>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  // Local T9: Close button and onClose
  test('Local T9 — Modal dismissal callback execution (onClose)', () => {
    const handleClose = jest.fn();

    const testStore = createTestStore({
      workspace: {
        workspaces: [{ id: 1, name: 'Main Workspace' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm
            workspaces={[{ id: 1, name: 'Main Workspace' }]}
            onClose={handleClose}
          />
        </MemoryRouter>
      </Provider>
    );

    const closeButtons = screen.getAllByLabelText(/Close/i);
    expect(closeButtons.length).toBeGreaterThan(0);
    fireEvent.click(closeButtons[0]);

    expect(handleClose).toHaveBeenCalled();
  });

  // Author T19: /Document Title/i, /Target Workspace/i, /Create Document/i
  test('Author T19 — DocumentForm render check', () => {
    const testStore = createTestStore({
      workspace: {
        workspaces: [{ id: 1, name: 'Default Workspace' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Default Workspace' }]} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Document Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Workspace/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Document/i })).toBeInTheDocument();
  });

  // Local T19: /^Title$/i, /^Workspace$/i, /Submit/i
  test('Local T19 — DocumentForm render check', () => {
    const testStore = createTestStore({
      workspace: {
        workspaces: [{ id: 1, name: 'Default Workspace' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Default Workspace' }]} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/^Title$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Workspace$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // Author T23: /Create Document/i
  test('Author T23 — DocumentForm submit button role', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Workspace 1' }]} />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Create Document/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  // Local T23: /Submit/i, id="doc-submit"
  test('Local T23 — DocumentForm submit button role', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Workspace 1' }]} />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveAttribute('id', 'doc-submit');
  });
});
