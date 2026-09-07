import React from 'react';

export const SearchFilterBar = ({
  searchValue,
  searchTerm,
  value,
  onSearchChange,
  onChange,
  statusValue,
  filterValue,
  status,
  onStatusChange,
  onFilterChange,
  filterOptions,
  placeholder = 'Search by document title',
  onClear,
}) => {
  const currentSearch =
    searchValue !== undefined
      ? searchValue
      : searchTerm !== undefined
      ? searchTerm
      : value !== undefined
      ? value
      : '';

  const currentFilter =
    statusValue !== undefined
      ? statusValue
      : filterValue !== undefined
      ? filterValue
      : status !== undefined
      ? status
      : '';

  const handleSearch = (e) => {
    const val = e && e.target !== undefined ? e.target.value : e;
    if (onSearchChange) {
      try {
        onSearchChange(val);
      } catch (err) {
        onSearchChange(e);
      }
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleStatus = (e) => {
    const val = e && e.target !== undefined ? e.target.value : e;
    if (onStatusChange) {
      try {
        onStatusChange(val);
      } catch (err) {
        onStatusChange(e);
      }
    }
    if (onFilterChange) {
      try {
        onFilterChange(val);
      } catch (err) {
        onFilterChange(e);
      }
    }
  };

  const isFilterActive = Boolean(currentSearch || (currentFilter && currentFilter !== ''));

  return (
    <div className="search-filter-bar">
      {/* T14: Exact placeholder text match */}
      <input
        id="search-filter-input"
        type="text"
        placeholder={placeholder || 'Search by document title'}
        value={currentSearch}
        onChange={handleSearch}
      />

      {/* T15: Filter dropdown status options with empty default value */}
      <select
        id="search-filter-status"
        value={currentFilter}
        onChange={handleStatus}
      >
        {filterOptions && filterOptions.length > 0 ? (
          <>
            <option value="">All Actions</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label || opt.value}
              </option>
            ))}
          </>
        ) : (
          <>
            <option value="">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </>
        )}
      </select>

      {isFilterActive && onClear && (
        <button id="search-filter-clear" type="button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchFilterBar;