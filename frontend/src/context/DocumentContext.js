import React, { createContext, useContext, useState } from 'react';
import documentService from '../services/documentService';
import versionService from '../services/versionService';

const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [activeDocument, setActiveDocument] = useState(null);
  const [activeDraft, setActiveDraft] = useState('');
  const [versions, setVersions] = useState([]);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const fetchDocumentDetails = async (docId) => {
    setLoadingDoc(true);
    try {
      const doc = await documentService.getById(docId);
      setActiveDocument(doc);
      
      const versionHistory = await versionService.getVersionHistory(docId).catch(() => []);
      setVersions(versionHistory);

      if (versionHistory && versionHistory.length > 0) {
        const latest = versionHistory[versionHistory.length - 1];
        setActiveDraft(latest.contentDelta || '');
      } else {
        setActiveDraft('');
      }
      return doc;
    } catch (err) {
      console.error('Failed to load document details:', err);
    } finally {
      setLoadingDoc(false);
    }
  };

  const saveVersionDraft = async (docId, content, commitMsg) => {
    setIsSaving(true);
    try {
      const versionData = await versionService.saveDraftVersion({
        documentId: docId,
        contentDelta: content,
        commitMessage: commitMsg || 'Update draft version'
      });

      setVersions((prev) => [...prev, versionData]);
      setLastSavedTime(new Date());
      return versionData;
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    activeDocument,
    setActiveDocument,
    activeDraft,
    setActiveDraft,
    versions,
    setVersions,
    loadingDoc,
    isSaving,
    lastSavedTime,
    fetchDocumentDetails,
    saveVersionDraft
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;
