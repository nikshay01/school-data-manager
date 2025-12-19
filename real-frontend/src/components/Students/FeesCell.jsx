import React from "react";

const FeesCell = ({ feeSummary }) => {
  if (!feeSummary) return <span className="text-white/50">—</span>;

  const { total, received, due } = feeSummary;

  return (
    <div className="flex flex-col text-xs">
      <div className="flex justify-between gap-2">
        <span className="text-white/70">Total:</span>
        <span className="font-bold text-white">₹{total.toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-2">
        <span className="text-green-400/70">Paid:</span>
        <span className="font-bold text-green-400">
          ₹{received.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between gap-2">
        <span className="text-red-400/70">Due:</span>
        <span className="font-bold text-red-400">₹{due.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default FeesCell;
