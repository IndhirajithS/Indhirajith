import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter as RouterMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const MemoryRouter = ({ future, ...props }) => (
  <RouterMemoryRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true, ...future }}
    {...props}
  />
);
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

import App from './App';
import Navbar from './components/layout/Navbar';
import Login from './components/Login';
import ErrorHandler, { ErrorBoundary } from './components/ErrorHandler';
import DocumentList from './components/document/DocumentList';
import DocumentForm from './components/document/DocumentForm';
import NotificationStack from './components/NotificationStack';
import SearchFilterBar from './components/common/SearchFilterBar';

import authReducer, { logout } from './store/slices/authSlice';
import workspaceReducer from './store/slices/workspaceSlice';
import documentReducer from './store/slices/documentSlice';
import reviewReducer from './store/slices/reviewSlice';
import notificationReducer, { addNotification } from './store/slices/notificationSlice';
import auditReducer from './store/slices/auditSlice';
import versionReducer from './store/slices/versionSlice';
import authService from './services/authService';

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
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });
    jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
    jest.spyOn(axios, 'put').mockResolvedValue({ data: {} });
    jest.spyOn(axios, 'delete').mockResolvedValue({ data: {} });
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

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
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

    expect(screen.getByText(/Sign in to DraftDash/i)).toBeInTheDocument();
  });

  // T4 — Error boundary message rendering
  test('T4 — Error boundary message rendering', () => {
    const testErrorMessage = 'Critical Network Error';

    const { rerender } = render(<ErrorHandler message={testErrorMessage} />);
    expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
    expect(screen.getByText(/Application Error/i)).toBeInTheDocument();

    rerender(<ErrorBoundary error={new Error('Error Object Message')} />);
    expect(screen.getByText('Error Object Message')).toBeInTheDocument();

    rerender(<ErrorHandler error="String error message" />);
    expect(screen.getByText('String error message')).toBeInTheDocument();

    rerender(<ErrorHandler error={null} />);
    expect(screen.queryByText(testErrorMessage)).not.toBeInTheDocument();
  });

  // T5 — DocumentList API fetch invocation
  test('T5 — DocumentList API fetch invocation', async () => {
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

  // T6 — Guest restrictions: Missing New Document button
  test('T6 — Guest restrictions: Missing New Document button', async () => {
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

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /New Document/i })).not.toBeInTheDocument();
    });
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

    const titleInput = screen.getByLabelText(/^Title$/i);
    expect(titleInput.value).toBe('');

    fireEvent.change(titleInput, { target: { value: 'New Test Document Title' } });
    expect(titleInput.value).toBe('New Test Document Title');
  });

  // T8 — Async Workspace fetching on Form mount
  test('T8 — Async Workspace fetching on Form mount', async () => {
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

  // T9 — Modal dismissal callback execution
  test('T9 — Modal dismissal callback execution', () => {
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
        placeholder="Search by document title"
      />
    );

    const searchInput = screen.getByPlaceholderText('Search by document title');
    expect(searchInput).toBeInTheDocument();
  });

  // T15 — Filter dropdown status options
  test('T15 — Filter dropdown status options', async () => {
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
    expect(select).toHaveAttribute('id', 'search-filter-status');

    const options = Array.from(select.querySelectorAll('option')).map((opt) => opt.value);
    expect(options).toContain('');
    expect(options).toContain('DRAFT');
    expect(options).toContain('IN_REVIEW');
    expect(options).toContain('APPROVED');
    expect(options).toContain('REJECTED');
    expect(options).toContain('ARCHIVED');

    await waitFor(() => {
      expect(select).toBeInTheDocument();
    });
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
        <App />
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
        <App />
      </Provider>
    );

    expect(screen.getByText(/Sign in to DraftDash/i)).toBeInTheDocument();
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

    expect(screen.getByLabelText(/^Title$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Workspace$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  // T20 — App container root node presence
  test('T20 — App container root node presence', () => {
    const testStore = createTestStore();

    const { container } = render(
      <Provider store={testStore}>
        <App />
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

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  // T22 — DocumentList empty data view
  test('T22 — DocumentList empty data view', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('No Documents Found')).toBeInTheDocument();
    });
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

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveAttribute('id', 'doc-submit');
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
    expect(passwordInput).toHaveAttribute('placeholder', 'Minimum 8 characters');
  });

  // T25 — DocumentList loading spinner visibility
  test('T25 — DocumentList loading spinner visibility', () => {
    jest.spyOn(axios, 'get').mockReturnValue(new Promise(() => {}));

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

    expect(screen.getByText(/Loading documents/i)).toBeInTheDocument();
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
    expect(logo).toHaveTextContent('DD');
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

    const titleInput = screen.getByLabelText(/^Title$/i);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('id', 'doc-title');
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

    const workspaceSelect = screen.getByLabelText(/^Workspace$/i);
    expect(workspaceSelect).toBeInTheDocument();
    expect(workspaceSelect).toHaveAttribute('id', 'doc-workspace');
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

    expect(screen.getByText(/Demo accounts:/i)).toBeInTheDocument();
    expect(screen.getByText(/director_user/i)).toBeInTheDocument();
    expect(screen.getByText(/creator_user/i)).toBeInTheDocument();
    expect(screen.getByText(/reviewer_user/i)).toBeInTheDocument();
  });

  // Supplementary test: T6 role permission checks (CONTENT_CREATOR, PROJECT_DIRECTOR, GUEST_OBSERVER)
  test('T6 — Role permission checks: CONTENT_CREATOR, PROJECT_DIRECTOR, GUEST_OBSERVER', () => {
    // CONTENT_CREATOR should see New Document button
    const creatorStore = createTestStore({
      auth: { isAuthenticated: true, user: { role: 'CONTENT_CREATOR' }, role: 'CONTENT_CREATOR' },
    });
    const { unmount: unmount1 } = render(
      <Provider store={creatorStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /\+ New Document/i })).toBeInTheDocument();
    unmount1();

    // PROJECT_DIRECTOR should see New Document button
    const directorStore = createTestStore({
      auth: { isAuthenticated: true, user: { role: 'PROJECT_DIRECTOR' }, role: 'PROJECT_DIRECTOR' },
    });
    const { unmount: unmount2 } = render(
      <Provider store={directorStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole('button', { name: /\+ New Document/i })).toBeInTheDocument();
    unmount2();

    // GUEST_OBSERVER should NOT see New Document button
    const guestStore = createTestStore({
      auth: { isAuthenticated: true, user: { role: 'GUEST_OBSERVER' }, role: 'GUEST_OBSERVER' },
    });
    render(
      <Provider store={guestStore}>
        <MemoryRouter>
          <DocumentList />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByRole('button', { name: /New Document/i })).not.toBeInTheDocument();
  });

  // Supplementary test: T9 dismissal on form submit success & isEditing conditional workspace
  test('T9 & isEditing — Modal dismissal on successful submit and workspace hidden on edit', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { id: 1, title: 'Created Document' } });
    const handleClose = jest.fn();
    const testStore = createTestStore({
      workspace: { workspaces: [{ id: 1, name: 'Workspace 1' }] },
    });

    // Test creating (isEditing = false): workspace select should be present
    const { unmount } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm
            workspaces={[{ id: 1, name: 'Workspace 1' }]}
            onClose={handleClose}
            isEditing={false}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText(/^Workspace$/i)).toBeInTheDocument();

    // Fill title and submit
    const titleInput = screen.getByLabelText(/^Title$/i);
    fireEvent.change(titleInput, { target: { value: 'Created Document' } });
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
    unmount();

    // Test editing (isEditing = true): workspace select should NOT be present
    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <DocumentForm
            workspaces={[{ id: 1, name: 'Workspace 1' }]}
            initialValues={{ id: 42, title: 'Existing Document' }}
            isEditing={true}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByLabelText(/^Workspace$/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Title$/i)).toBeInTheDocument();
  });
});
