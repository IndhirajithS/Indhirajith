import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchDocumentById,
  submitDocumentForReview,
  retractDocumentSubmission,
} from '../../store/slices/documentSlice';
import { createDraftVersion, fetchVersionHistory, compareVersions } from '../../store/slices/versionSlice';
import { submitReviewDecision } from '../../store/slices/reviewSlice';
import VersionList from '../version/VersionList';
import VersionForm from '../version/VersionForm';
import ReviewForm from '../review/ReviewForm';

export const DocumentEditor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentDocument, loading: docLoading } = useSelector((state) => state.document);
  const { history, comparison, loading: versionLoading } = useSelector((state) => state.version);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'versions', 'compare', 'review'
  const [selectedV1, setSelectedV1] = useState('');
  const [selectedV2, setSelectedV2] = useState('');
  const [contentDelta, setContentDelta] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchDocumentById(id));
      dispatch(fetchVersionHistory(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (history.length > 0) {
      const latest = history[0];
      setContentDelta(latest.contentDelta || '');
    }
  }, [history]);

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!contentDelta.trim()) return;
    dispatch(
      createDraftVersion({
        documentId: Number(id),
        contentDelta,
        commitMessage: commitMessage || 'Updated document draft content',
      })
    ).then(() => {
      setCommitMessage('');
      dispatch(fetchVersionHistory(id));
    });
  };

  const handleSubmitReview = () => {
    dispatch(submitDocumentForReview(id)).then(() => {
      dispatch(fetchDocumentById(id));
    });
  };

  const handleRetract = () => {
    dispatch(retractDocumentSubmission(id)).then(() => {
      dispatch(fetchDocumentById(id));
    });
  };

  const handleCompare = () => {
    if (selectedV1 && selectedV2) {
      dispatch(compareVersions({ docId: Number(id), v1: Number(selectedV1), v2: Number(selectedV2) }));
    }
  };

  const handleReviewSubmit = (reviewData) => {
    dispatch(submitReviewDecision({ reviewCycleId: Number(id), decisionData: reviewData })).then(() => {
      dispatch(fetchDocumentById(id));
    });
  };

  if (docLoading || !currentDocument) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
        Loading document editor & version context...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentDocument.title}</h1>
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              {currentDocument.currentStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
            <span>Workspace #{currentDocument.workspaceId}</span>
            <span>•</span>
            <span>Creator: @{currentDocument.createdByUsername}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentDocument.currentStatus === 'DRAFT' && (
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md transition"
            >
              Submit for Review
            </button>
          )}

          {(currentDocument.currentStatus === 'SUBMITTED' || currentDocument.currentStatus === 'IN_REVIEW') && (
            <button
              onClick={handleRetract}
              className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition"
            >
              Retract Submission
            </button>
          )}

          <button
            onClick={() => navigate('/documents')}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-xl transition"
          >
            Back to Documents
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === 'editor'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ✏️ Content Editor
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === 'versions'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📜 History ({history.length})
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === 'compare'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔍 Compare Versions
        </button>
        {user?.role === 'QUALITY_REVIEWER' && (
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === 'review'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⭐ Review Decision
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSaveDraft} className="space-y-4 bg-slate-900/60 p-6 border border-slate-800 rounded-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Document Content (Markdown / Delta Text)
            </label>
            <textarea
              rows={12}
              value={contentDelta}
              onChange={(e) => setContentDelta(e.target.value)}
              placeholder="Write document contents here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Commit Summary</label>
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe changes in this draft version..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={versionLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
            >
              Save New Version Draft
            </button>
          </div>
        </form>
      )}

      {activeTab === 'versions' && (
        <div className="space-y-6">
          <VersionForm
            documentId={Number(id)}
            onSubmit={(vData) => {
              dispatch(createDraftVersion(vData)).then(() => {
                dispatch(fetchVersionHistory(id));
              });
            }}
          />
          <VersionList versions={history} />
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-6 bg-slate-900/60 p-6 border border-slate-800 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Version A (Base)</label>
              <select
                value={selectedV1}
                onChange={(e) => setSelectedV1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200"
              >
                <option value="">Select Version</option>
                {history.map((v) => (
                  <option key={v.id} value={v.versionNumber}>
                    v{v.versionNumber} - {v.commitMessage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Version B (Target)</label>
              <select
                value={selectedV2}
                onChange={(e) => setSelectedV2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-200"
              >
                <option value="">Select Version</option>
                {history.map((v) => (
                  <option key={v.id} value={v.versionNumber}>
                    v{v.versionNumber} - {v.commitMessage}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCompare}
              disabled={!selectedV1 || !selectedV2}
              className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl transition"
            >
              Compare
            </button>
          </div>

          {comparison && (
            <div className="mt-6 border-t border-slate-800 pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Word Count A</div>
                  <div className="text-lg font-mono font-bold text-slate-200">{comparison.wordCountA}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Word Count B</div>
                  <div className="text-lg font-mono font-bold text-slate-200">{comparison.wordCountB}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Delta %</div>
                  <div className="text-lg font-mono font-bold text-indigo-400">
                    {comparison.changePercentage?.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="text-xs font-mono text-slate-400 mb-2">
                    v{comparison.versionA?.versionNumber} Content:
                  </h4>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                    {comparison.versionA?.contentDelta}
                  </pre>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="text-xs font-mono text-slate-400 mb-2">
                    v{comparison.versionB?.versionNumber} Content:
                  </h4>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
                    {comparison.versionB?.contentDelta}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'review' && (
        <ReviewForm reviewCycleId={Number(id)} onSubmit={handleReviewSubmit} />
      )}
    </div>
  );
};

export default DocumentEditor;
