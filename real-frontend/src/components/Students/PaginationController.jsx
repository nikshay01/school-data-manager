import React from "react";

const PaginationController = ({
  batchSize,
  setBatchSize,
  totalItems,
  loadedItems,
}) => {
  return (
    <div className="flex items-center gap-4 text-white/70 text-sm bg-black/30 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
      <span>
        Showing <span className="text-white font-bold">{loadedItems}</span> of{" "}
        <span className="text-white font-bold">{totalItems}</span> students
      </span>

      <div className="h-4 w-[1px] bg-white/20"></div>

      <div className="flex items-center gap-2">
        <span>Rows per load:</span>
        <select
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white focus:outline-none cursor-pointer [&>option]:text-black"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={totalItems}>All</option>
        </select>
      </div>
    </div>
  );
};

export default PaginationController;
