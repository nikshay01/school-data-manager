import React from "react";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  searchColumn,
  onSearchColumnChange,
  columns,
}) => {
  const searchableColumns = columns.filter((col) =>
    [
      "studentName",
      "fatherName",
      "class",
      "section",
      "srNo",
      "aadhar",
    ].includes(col.key)
  );

  return (
    <div className="flex items-center gap-2 w-full max-w-2xl bg-black/30 border border-white/20 rounded-xl p-1 pl-4 backdrop-blur-sm focus-within:border-white/40 transition-all">
      <svg
        className="w-5 h-5 text-white/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <div className="relative flex items-center gap-2 border-r border-white/10 pr-2 mr-2">
        <span className="text-xs text-white/50 whitespace-nowrap">
          Search in:
        </span>
        <select
          value={searchColumn}
          onChange={(e) => onSearchColumnChange(e.target.value)}
          className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:text-black"
        >
          <option value="all">All Columns</option>
          {searchableColumns.map((col) => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search students..."
        className="bg-transparent w-full text-white placeholder-white/30 focus:outline-none py-2"
      />
    </div>
  );
};

export default SearchBar;
