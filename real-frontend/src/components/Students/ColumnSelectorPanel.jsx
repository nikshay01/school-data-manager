import React from "react";

const ColumnSelectorPanel = ({ columns, onToggleColumn, onClose }) => {
  return (
    <div className="absolute top-16 right-0 z-20 w-64 bg-black/80 border border-white/20 rounded-2xl p-4 backdrop-blur-xl shadow-2xl animate-fade-in-down">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-white font-bold">Customize Columns</h3>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {columns.map((col) => (
          <label
            key={col.key}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <span className="text-white/90 text-sm">{col.label}</span>
            <div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-green-400"
                checked={!col.hidden}
                onChange={() => onToggleColumn(col.key)}
              />
              <span
                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                  !col.hidden ? "bg-green-400/50" : "bg-gray-600"
                }`}
              ></span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelectorPanel;
