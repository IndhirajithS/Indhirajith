import React from 'react';
import { useInRouterContext, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import WorkspaceList from './components/workspace/WorkspaceList';
import WorkspaceDetail from './components/workspace/WorkspaceDetail';
import DocumentList from './components/document/DocumentList';
import DocumentEditor from './components/document/DocumentEditor';
import AuditLogList from './components/audit/AuditLogList';
import Login from './components/Login';
import NotificationStack from './components/NotificationStack';
import { removeNotification } from './store/slices/notificationSlice';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <WorkspaceList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces/:id"
        element={
          <ProtectedRoute>
            <WorkspaceDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <DocumentEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit"
        element={
          <ProtectedRoute>
            <AuditLogList />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

export const AppShell = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const notifications = useSelector(
    (state) => state.notification?.notifications || state.notifications?.notifications || []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" data-testid="app-container">
      {isAuthenticated && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AppRoutes />
      </main>

      <NotificationStack
        notifications={notifications}
        onDismiss={(id) => dispatch && dispatch(removeNotification(id))}
      />
    </div>
  );
};

export const App = () => {
  let inRouter = false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }

  if (!inRouter) {
    return (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </BrowserRouter>
    );
  }

  return <AppShell />;
};

export default App;
