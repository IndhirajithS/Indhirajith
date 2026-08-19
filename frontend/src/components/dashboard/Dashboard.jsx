import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkspaces } from '../../store/slices/workspaceSlice';
import { fetchDocuments } from '../../store/slices/documentSlice';
import { fetchAuditLogs } from '../../store/slices/auditSlice';
import StatCards from './StatCards';
import RecentActivity from './RecentActivity';
import StatusDistributionBar from './StatusDistributionBar';
import CapacityBar from '../common/CapacityBar';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state) => state.workspace);
  const { documents } = useSelector((state) => state.document);
  const { logs } = useSelector((state) => state.audit);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchDocuments());
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const pendingReviews = documents.filter(
    (d) => d.currentStatus === 'SUBMITTED' || d.currentStatus === 'IN_REVIEW'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>✨</span> System Dashboard & Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time workspace capacity metrics, document lifecycle, and governance audit stream.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span>➕</span> New Document
          </Link>
          <Link
            to="/workspaces"
            className="px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center gap-2"
          >
            <span>📂</span> Manage Workspaces
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards workspaces={workspaces} documents={documents} pendingReviews={pendingReviews} />

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatusDistributionBar documents={documents} />

          {/* Workspace Capacity Overview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg space-y-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span>📊</span> Workspace Capacity Status
            </h3>
            {workspaces.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No workspaces available.</p>
            ) : (
              <div className="space-y-4">
                {workspaces.slice(0, 3).map((ws) => (
                  <div key={ws.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/70">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-200">{ws.name}</span>
                      <span className="text-xs text-slate-400 font-mono">Owner: @{ws.ownerUsername || 'admin'}</span>
                    </div>
                    <CapacityBar
                      current={ws.currentDocumentCount || ws.memberCount || 0}
                      max={ws.capacityLimit || 100}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit / Recent Activity Stream */}
        <div>
          <RecentActivity activities={logs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
