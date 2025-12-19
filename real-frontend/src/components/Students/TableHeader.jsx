import React from "react";

const TableHeader = ({ columns, sortConfig, onSort }) => {
  return (
    <thead>
      <tr className="border-b border-white/20 bg-black/20">
        {columns.map((col) => (
          <th
            key={col.key}
            className={`p-4 text-left text-sm font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors ${
              col.hidden ? "hidden" : ""
            }`}
            onClick={() => col.sortable && onSort(col.key)}
          >
            <div className="flex items-center gap-2">
              {col.label}
              {col.sortable && (
                <div className="flex flex-col text-[8px] leading-[8px] opacity-50">
                  <span
                    className={
                      sortConfig.key === col.key &&
                      sortConfig.direction === "asc"
                        ? "text-white opacity-100"
                        : ""
                    }
                  >
                    ▲
                  </span>
                  <span
                    className={
                      sortConfig.key === col.key &&
                      sortConfig.direction === "desc"
                        ? "text-white opacity-100"
                        : ""
                    }
                  >
                    ▼
                  </span>
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
