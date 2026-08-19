import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import auditService from '../../services/auditService';
import documentService from '../../services/documentService';
import AuditLogTable from '../../components/audit/AuditLogTable';
import RecentActivityList from '../../components/audit/RecentActivityList';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [auditLogs, docList] = await Promise.all([
          auditService.getRecentAuditLogs().catch(() => []),
          documentService.getAll().catch(() => [])
        ]);
        setLogs(auditLogs);
        setDocuments(docList);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalDocs = documents.length;
  const draftCount = documents.filter((d) => d.currentStatus === 'DRAFT').length;
  const reviewCount = documents.filter((d) => d.currentStatus === 'UNDER_REVIEW').length;
  const approvedCount = documents.filter((d) => d.currentStatus === 'APPROVED').length;

  return (
    <PageContainer title="Dashboard & System Overview">
      {loading ? (
        <Loader label="Loading audit logs and workspace metrics..." fullScreen />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Welcome Banner */}
          <div
            className="glass-card"
            style={{
              padding: '24px 32px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(188, 140, 255, 0.1))',
              border: '1px solid rgba(88, 166, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Welcome back, {user?.username || 'Project Lead'}! 👋
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Project Director View • Consuming <code>/api/audit/recent</code> & Document Metrics
              </p>
            </div>

            <Link
              to="/documents"
              className="btn btn-primary"
              style={{ padding: '10px 20px', borderRadius: '8px' }}
            >
              Manage Documents →
            </Link>
          </div>

          {/* Quick Metrics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div className="glass-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Total Documents
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                {totalDocs}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--status-draft)', fontWeight: 600 }}>
                Active Drafts
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-draft)', marginTop: '8px' }}>
                {draftCount}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--status-review)', fontWeight: 600 }}>
                Pending Review
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-review)', marginTop: '8px' }}>
                {reviewCount}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--status-approved)', fontWeight: 600 }}>
                Approved Documents
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-approved)', marginTop: '8px' }}>
                {approvedCount}
              </div>
            </div>
          </div>

          {/* Main Content Grid: Activity Feed & Audit Log Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <RecentActivityList activities={logs} />
            <AuditLogTable logs={logs} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
