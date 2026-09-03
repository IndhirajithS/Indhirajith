import React from 'react';

const SearchFilterBar = ({ searchValue, onSearchChange, statusValue, onStatusChange, onClear }) => {
  const isFilterActive = searchValue || (statusValue && statusValue !== '');

  return (
    <div className="search-filter-bar">
      {/* T14: Exact placeholder text match */}
      <input 
        id="search-filter-input" 
        type="text" 
        placeholder="Search by document title" 
        value={searchValue || ''}
        onChange={onSearchChange}
      />

      {/* T15: Filter dropdown status options with empty default value */}
      <select 
        id="search-filter-status" 
        value={statusValue || ''} 
        onChange={onStatusChange}
      >
        <option value="">All Statuses</option>
        <option value="DRAFT">DRAFT</option>
        <option value="IN_REVIEW">IN_REVIEW</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>

      {isFilterActive && (
        <button id="search-filter-clear" onClick={onClear}>Clear</button>
      )}
    </div>
  );
};

export default SearchFilterBar;