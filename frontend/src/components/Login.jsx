import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import ErrorHandler from './ErrorHandler';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CONTENT_CREATOR');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(registerUser({ username, email, password, role })).then((res) => {
        if (!res.error) {
          navigate('/dashboard');
        }
      });
    } else {
      dispatch(loginUser({ username, password })).then((res) => {
        if (!res.error) {
          navigate('/dashboard');
        }
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg text-2xl text-white mb-2" data-testid="login-logo">
            ⚡
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create DraftDash Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Join workspace collaboration and quality document review'
              : 'Sign in with your credentials to access system resources'}
          </p>
        </div>

        <ErrorHandler error={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. director_user"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {isRegister && (
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {isRegister && (
            <div>
              <label htmlFor="role" className="block text-xs font-medium text-slate-300 mb-1.5">Role Authorization</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="CONTENT_CREATOR">Content Creator</option>
                <option value="QUALITY_REVIEWER">Quality Reviewer</option>
                <option value="PROJECT_DIRECTOR">Project Director</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg transition active:scale-98 disabled:bg-slate-800"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Hint */}
        <div className="text-xs text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5" data-testid="demo-accounts-hint">
          <p className="font-semibold text-slate-300">Demo Accounts</p>
          <div className="flex flex-col gap-1 text-[11px]">
            <div><span className="text-slate-400">Director:</span> <span className="font-mono text-indigo-300">director_user</span> / <span className="font-mono text-indigo-300">password123</span></div>
            <div><span className="text-slate-400">Creator:</span> <span className="font-mono text-indigo-300">creator_user</span> / <span className="font-mono text-indigo-300">password123</span></div>
            <div><span className="text-slate-400">Reviewer:</span> <span className="font-mono text-indigo-300">reviewer_user</span> / <span className="font-mono text-indigo-300">password123</span></div>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-indigo-400 font-medium transition"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
