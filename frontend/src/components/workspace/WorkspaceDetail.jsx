import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkspaceById, inviteMember } from '../../store/slices/workspaceSlice';
import { fetchDocuments } from '../../store/slices/documentSlice';
import CapacityBar from '../common/CapacityBar';

export const WorkspaceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentWorkspace, loading } = useSelector((state) => state.workspace);
  const { documents } = useSelector((state) => state.document);
  const { user } = useSelector((state) => state.auth);

  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteRole, setInviteRole] = useState('CONTRIBUTOR');

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkspaceById(id));
      dispatch(fetchDocuments());
    }
  }, [id, dispatch]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteUsername.trim()) return;
    dispatch(
      inviteMember({
        workspaceId: Number(id),
        memberData: { username: inviteUsername, memberRole: inviteRole },
      })
    ).then(() => {
      setInviteUsername('');
      dispatch(fetchWorkspaceById(id));
    });
  };

  const wsDocs = documents.filter((d) => Number(d.workspaceId) === Number(id));

  if (loading || !currentWorkspace) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
        Loading workspace details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">{currentWorkspace.name}</h1>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              {currentWorkspace.status || 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Owner: @{currentWorkspace.ownerUsername || 'admin'} • ID: #{currentWorkspace.id}
          </p>
        </div>

        <div className="w-full md:w-72">
          <CapacityBar
            current={currentWorkspace.currentDocumentCount || wsDocs.length || 0}
            max={currentWorkspace.capacityLimit || 100}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Documents */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>📄</span> Workspace Documents ({wsDocs.length})
            </h3>
            <button
              onClick={() => navigate('/documents')}
              className="text-xs text-indigo-400 hover:underline"
            >
              All Documents →
            </button>
          </div>

          {wsDocs.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No documents in this workspace yet.</p>
          ) : (
            <div className="space-y-3">
              {wsDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-indigo-500/50 cursor-pointer transition"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{doc.title}</h4>
                    <span className="text-xs text-slate-500">
                      Created by @{doc.createdByUsername}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {doc.currentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Member Management */}
        <div className="space-y-6">
          {(user?.role === 'PROJECT_DIRECTOR' || user?.role === 'CONTENT_CREATOR') && (
            <form onSubmit={handleInvite} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-md">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>👤</span> Invite Member
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="Username to add"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Member Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200"
                >
                  <option value="CONTRIBUTOR">Contributor</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
              >
                Send Workspace Invite
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetail;
