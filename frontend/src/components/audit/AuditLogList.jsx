import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuditLogs } from '../../store/slices/auditSlice';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';

export const AuditLogList = () => {
  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.audit);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const filteredLogs = logs.filter((log) => {
    const actionMatch = filterAction === 'ALL' || log.actionType === filterAction || log.action === filterAction;
    const searchLower = search.toLowerCase();
    const textMatch =
      !search ||
      log.description?.toLowerCase().includes(searchLower) ||
      log.performedByUsername?.toLowerCase().includes(searchLower) ||
      log.targetEntity?.toLowerCase().includes(searchLower);
    return actionMatch && textMatch;
  });

  const getActionBadge = (type) => {
    switch (type) {
      case 'CREATE':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60';
      case 'UPDATE':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/60';
      case 'DELETE':
        return 'bg-rose-950/70 text-rose-400 border-rose-800/60';
      case 'REVIEW':
        return 'bg-purple-950/70 text-purple-400 border-purple-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchTerm={search}
        onSearchChange={setSearch}
        filterValue={filterAction}
        onFilterChange={setFilterAction}
        filterOptions={[
          { value: 'CREATE', label: 'Create Actions' },
          { value: 'UPDATE', label: 'Update Actions' },
          { value: 'DELETE', label: 'Delete Actions' },
          { value: 'REVIEW', label: 'Review Actions' },
        ]}
        placeholder="Filter audit entries by user or description..."
      />

      {loading ? (
        <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
          Loading system audit logs...
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Audit Logs Found"
          description="There are no system audit entries matching your selected criteria."
        />
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono text-xs uppercase">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp || log.performedAt || Date.now()).toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-slate-200">
                      @{log.performedByUsername || log.actorUsername || 'system'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] font-mono rounded-md border ${getActionBadge(log.actionType)}`}>
                        {log.actionType || log.action || 'INFO'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-indigo-400">
                      {log.targetEntity || 'SYSTEM'} #{log.targetEntityId || log.targetId || '-'}
                    </td>
                    <td className="p-4 text-slate-300 max-w-md truncate">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogList;
