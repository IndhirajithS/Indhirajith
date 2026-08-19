import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkspaces, createWorkspace, deleteWorkspace } from '../../store/slices/workspaceSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import CapacityBar from '../common/CapacityBar';
import EmptyState from '../common/EmptyState';
import WorkspaceForm from './WorkspaceForm';
import { useNavigate } from 'react-router-dom';

export const WorkspaceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces, loading } = useSelector((state) => state.workspace);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleCreate = (data) => {
    dispatch(createWorkspace(data)).then(() => {
      setShowModal(false);
      dispatch(fetchWorkspaces());
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete workspace "${name}"?`)) {
      dispatch(deleteWorkspace(id));
    }
  };

  const filteredWorkspaces = workspaces.filter((ws) =>
    !search || ws.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>📂</span> Workspaces Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage collaborative workspaces, track capacity quotas, and delegate member permissions.
          </p>
        </div>

        {(user?.role === 'PROJECT_DIRECTOR' || user?.role === 'CONTENT_CREATOR') && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>➕</span> Create Workspace
          </button>
        )}
      </div>

      {/* Filter */}
      <SearchFilterBar
        searchTerm={search}
        onSearchChange={setSearch}
        placeholder="Filter workspaces by name..."
      />

      {/* Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
          Loading workspace directory...
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <EmptyState
          icon="📂"
          title="No Workspaces Available"
          description="There are currently no workspaces created."
          actionLabel="Create Workspace"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3
                    onClick={() => navigate(`/workspaces/${ws.id}`)}
                    className="text-base font-bold text-slate-100 hover:text-indigo-400 cursor-pointer transition flex items-center gap-2"
                  >
                    <span>📁</span> {ws.name}
                  </h3>
                  {user?.role === 'PROJECT_DIRECTOR' && (
                    <button
                      onClick={() => handleDelete(ws.id, ws.name)}
                      className="text-slate-500 hover:text-rose-400 p-1 text-xs transition"
                      title="Delete Workspace"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Owner: <span className="font-mono text-slate-300">@{ws.ownerUsername || 'admin'}</span>
                </p>

                <CapacityBar
                  current={ws.currentDocumentCount || ws.memberCount || 0}
                  max={ws.capacityLimit || 100}
                />
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">
                  {ws.memberCount || 1} Members
                </span>
                <button
                  onClick={() => navigate(`/workspaces/${ws.id}`)}
                  className="px-3 py-1.5 font-medium text-indigo-400 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800 rounded-lg transition"
                >
                  Workspace Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <WorkspaceForm
              onSubmit={handleCreate}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
