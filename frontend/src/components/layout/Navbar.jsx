import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
      isActive
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
            <span className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg shadow-md text-white font-mono text-sm font-extrabold">
              DD
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              DraftDash
            </span>
          </NavLink>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navItemClass}>
              <span>🏠</span> Home
            </NavLink>
            <NavLink to="/dashboard" className={navItemClass}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/workspaces" className={navItemClass}>
              <span>📂</span> Workspaces
            </NavLink>
            <NavLink to="/documents" className={navItemClass}>
              <span>📄</span> Documents
            </NavLink>
            <NavLink to="/audit" className={navItemClass}>
              <span>📋</span> Audit Logs
            </NavLink>
          </div>
        </div>

        {/* User Info & Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-100">{user.username}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
