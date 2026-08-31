import React from 'react';

export const SearchFilterBar = ({
  searchTerm = '',
  onSearchChange,
  filterValue = 'ALL',
  onFilterChange,
  filterOptions = [],
  placeholder = 'Search by document title',
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800 backdrop-blur-sm">
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-slate-500 transition-all"
        />
        <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
      </div>

      {filterOptions.length > 0 && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Filter by:</label>
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer w-full sm:w-44"
          >
            <option value="ALL">All Statuses</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
