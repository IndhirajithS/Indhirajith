import React from 'react';

export const SearchFilterBar = ({
  searchTerm = '',
  value,
  onSearchChange,
  onChange,
  filterValue = '',
  status,
  onFilterChange,
  onStatusChange,
  filterOptions,
  placeholder = 'Search by document title',
}) => {
  const currentSearch = searchTerm !== undefined && searchTerm !== '' ? searchTerm : (value || '');
  const currentFilter = filterValue !== undefined && filterValue !== '' ? filterValue : (status || '');

  const handleSearchChange = (e) => {
    const val = e && e.target ? e.target.value : e;
    if (onSearchChange) onSearchChange(val);
    if (onChange) onChange(e);
  };

  const handleStatusChange = (e) => {
    const val = e && e.target ? e.target.value : e;
    if (onFilterChange) onFilterChange(val);
    if (onStatusChange) onStatusChange(val);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800 backdrop-blur-sm">
      <div className="relative w-full sm:w-80">
        <input
          id="search-filter-input"
          placeholder={placeholder || 'Search by document title'}
          type="text"
          value={currentSearch}
          onChange={handleSearchChange}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-slate-500 transition-all"
        />
        <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="search-filter-status" className="text-xs text-slate-400 font-medium whitespace-nowrap">
          Filter by:
        </label>
        <select
          id="search-filter-status"
          value={currentFilter}
          onChange={handleStatusChange}
          className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer w-full sm:w-44"
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
      </div>
    </div>
  );
};

export default SearchFilterBar;
