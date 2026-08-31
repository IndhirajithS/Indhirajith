import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import App from './App';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import ErrorHandler, { ErrorBoundary } from './components/ErrorHandler';
import DocumentList from './components/document/DocumentList';
import DocumentForm from './components/document/DocumentForm';
import NotificationStack from './components/NotificationStack';
import SearchFilterBar from './components/common/SearchFilterBar';

import authReducer, { logout, loginUser } from './store/slices/authSlice';
import workspaceReducer, { fetchWorkspaces } from './store/slices/workspaceSlice';
import documentReducer, { fetchDocuments } from './store/slices/documentSlice';
import reviewReducer from './store/slices/reviewSlice';
import notificationReducer, { addNotification } from './store/slices/notificationSlice';
import auditReducer from './store/slices/auditSlice';
import versionReducer from './store/slices/versionSlice';
import store from './store';
import authService from './services/authService';
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
      version: versionReducer,
      versions: versionReducer,
      review: reviewReducer,
      reviews: reviewReducer,
      audit: auditReducer,
      audits: auditReducer,
      notification: notificationReducer,
      notifications: notificationReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

describe('Frontend Verification Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // T1 — Redux authentication state initialization
  test('T1 — Redux authentication state initialization', () => {
    const testStore = createTestStore();
    const authState = testStore.getState().auth;

    expect(authState).toBeDefined();
    expect(authState.user).toBeNull();
    expect(authState.token).toBeNull();
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.loading).toBe(false);
    expect(authState.error).toBeNull();
  });

  // T2 — Navbar branding and home link
  test('T2 — Navbar branding and home link', () => {
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
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const brand = screen.getByText(/DraftDash/i);
    expect(brand).toBeInTheDocument();

    const homeLink = brand.closest('a');
    expect(homeLink).toHaveAttribute('href', '/dashboard');
  });

  // T3 — Login card welcome message
  test('T3 — Login card welcome message', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  // T4 — Error boundary message rendering
  test('T4 — Error boundary message rendering', () => {
    const testErrorMessage = 'Critical Network Error';

    const { rerender } = render(<ErrorHandler error={testErrorMessage} />);
    expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
    expect(screen.getByText(/Application Error/i)).toBeInTheDocument();

    rerender(<ErrorBoundary error={new Error('Error Object Message')} />);
    expect(screen.getByText('Error Object Message')).toBeInTheDocument();

    rerender(<ErrorHandler error={null} />);
    expect(screen.queryByText(testErrorMessage)).not.toBeInTheDocument();
  });

  // T5 — DocumentList API fetch invocation
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

  // T6 — Guest restrictions: Missing New Document button
  test('T6 — Guest restrictions: Missing New Document button', () => {
    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'guest_user', role: 'QUALITY_REVIEWER' },
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

    const newDocButton = screen.queryByRole('button', { name: /New Document/i });
    expect(newDocButton).not.toBeInTheDocument();
  });

  // T7 — Form state: Title input reactivity
  test('T7 — Form state: Title input reactivity', () => {
    const testStore = createTestStore({
      workspace: {
        workspaces: [{ id: 1, name: 'Main Workspace' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Main Workspace' }]} />
        </MemoryRouter>
      </Provider>
    );

    const titleInput = screen.getByLabelText(/Document Title/i);
    expect(titleInput.value).toBe('');

    fireEvent.change(titleInput, { target: { value: 'New Test Document Title' } });
    expect(titleInput.value).toBe('New Test Document Title');
  });

  // T8 — Async Workspace fetching on Form mount
  test('T8 — Async Workspace fetching on Form mount', async () => {
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

  // T9 — Modal dismissal callback execution
  test('T9 — Modal dismissal callback execution', () => {
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

  // T10 — Login form field types check
  test('T10 — Login form field types check', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // T11 — Successful CRUD message persistence
  test('T11 — Successful CRUD message persistence', () => {
    const testStore = createTestStore();

    testStore.dispatch(addNotification('Document created successfully!'));

    const state = testStore.getState();
    const notifications = state.notification.notifications;

    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].message).toBe('Document created successfully!');
    expect(notifications[0].type).toBe('success');
  });

  // T12 — Redux workspace slice check
  test('T12 — Redux workspace slice check', () => {
    const testStore = createTestStore();
    const workspaceState = testStore.getState().workspace;

    expect(workspaceState).toBeDefined();
    expect(Array.isArray(workspaceState.workspaces)).toBe(true);
    expect(workspaceState.currentWorkspace).toBeNull();
    expect(workspaceState.loading).toBe(false);
    expect(workspaceState.error).toBeNull();
  });

  // T13 — LocalStorage token management check
  test('T13 — LocalStorage token management check', () => {
    expect(authService.getToken()).toBeNull();

    authService.setToken('sample-jwt-token-12345');
    expect(authService.getToken()).toBe('sample-jwt-token-12345');
    expect(localStorage.getItem('token')).toBe('sample-jwt-token-12345');

    authService.removeToken();
    expect(authService.getToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  // T14 — Search input placeholder text validation
  test('T14 — Search input placeholder text validation', () => {
    render(
      <SearchFilterBar
        searchTerm=""
        onSearchChange={() => {}}
        placeholder="Search documents by title or creator..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search documents by title or creator...');
    expect(searchInput).toBeInTheDocument();
  });

  // T15 — Filter dropdown status options
  test('T15 — Filter dropdown status options', () => {
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

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    const options = Array.from(select.querySelectorAll('option')).map((opt) => opt.value);
    expect(options).toContain('ALL');
    expect(options).toContain('DRAFT');
    expect(options).toContain('SUBMITTED');
    expect(options).toContain('IN_REVIEW');
    expect(options).toContain('APPROVED');
    expect(options).toContain('REJECTED');
  });

  // T16 — Application shell NotificationStack check
  test('T16 — Application shell NotificationStack check', () => {
    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'director_user', role: 'PROJECT_DIRECTOR' },
        token: 'mock-token',
      },
      notification: {
        notifications: [{ id: 1, message: 'Global System Alert', type: 'success' }],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Global System Alert')).toBeInTheDocument();
  });

  // T17 — Auth redirection to login for guests
  test('T17 — Auth redirection to login for guests', () => {
    const testStore = createTestStore({
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
  });

  // T18 — Redux auth logout action effect
  test('T18 — Redux auth logout action effect', () => {
    localStorage.setItem('token', 'active-token');
    localStorage.setItem('user', JSON.stringify({ username: 'user1' }));

    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'user1' },
        token: 'active-token',
      },
    });

    testStore.dispatch(logout());

    const authState = testStore.getState().auth;
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.user).toBeNull();
    expect(authState.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  // T19 — DocumentForm render check
  test('T19 — DocumentForm render check', () => {
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

  // T20 — App container root node presence
  test('T20 — App container root node presence', () => {
    const testStore = createTestStore();

    const { container } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    const appContainer = container.querySelector('[data-testid="app-container"]') || container.firstChild;
    expect(appContainer).toBeInTheDocument();
  });

  // T21 — Navbar home link path
  test('T21 — Navbar home link path', () => {
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
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    const brandLink = screen.getByRole('link', { name: /DraftDash/i });
    expect(brandLink).toHaveAttribute('href', '/dashboard');
  });

  // T22 — DocumentList empty data view
  test('T22 — DocumentList empty data view', () => {
    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'director_user', role: 'PROJECT_DIRECTOR' },
        token: 'mock-token',
      },
      document: {
        documents: [],
        loading: false,
        error: null,
      },
      workspace: {
        workspaces: [],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No Documents Found')).toBeInTheDocument();
  });

  // T23 — DocumentForm submit button role
  test('T23 — DocumentForm submit button role', () => {
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

  // T24 — Password field placeholder check
  test('T24 — Password field placeholder check', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  });

  // T25 — DocumentList loading spinner visibility
  test('T25 — DocumentList loading spinner visibility', () => {
    const testStore = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { username: 'director_user', role: 'PROJECT_DIRECTOR' },
        token: 'mock-token',
      },
      document: {
        documents: [],
        loading: true,
        error: null,
      },
      workspace: {
        workspaces: [],
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading document repository.../i)).toBeInTheDocument();
  });

  // T26 — Redux reviews slice availability
  test('T26 — Redux reviews slice availability', () => {
    const testStore = createTestStore();
    const reviewState = testStore.getState().reviews || testStore.getState().review;

    expect(reviewState).toBeDefined();
    expect(Array.isArray(reviewState.pendingReviews)).toBe(true);
    expect(reviewState.loading).toBe(false);
    expect(reviewState.error).toBeNull();
  });

  // T27 — Login card logo display
  test('T27 — Login card logo display', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const logo = screen.getByTestId('login-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent('⚡');
  });

  // T28 — Form label accessibility: Title
  test('T28 — Form label accessibility: Title', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Workspace 1' }]} />
        </MemoryRouter>
      </Provider>
    );

    const titleInput = screen.getByLabelText(/Document Title/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('id', 'document-title');
  });

  // T29 — Form label accessibility: Workspace
  test('T29 — Form label accessibility: Workspace', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm workspaces={[{ id: 1, name: 'Workspace 1' }]} />
        </MemoryRouter>
      </Provider>
    );

    const workspaceSelect = screen.getByLabelText(/Target Workspace/i);
    expect(workspaceSelect).toBeInTheDocument();
    expect(workspaceSelect).toHaveAttribute('id', 'target-workspace');
  });

  // T30 — Login demo accounts hint presence
  test('T30 — Login demo accounts hint presence', () => {
    const testStore = createTestStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Demo Accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/director_user/i)).toBeInTheDocument();
    expect(screen.getByText(/creator_user/i)).toBeInTheDocument();
    expect(screen.getByText(/reviewer_user/i)).toBeInTheDocument();
  });
});
