import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  GripVertical,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const filterColumns = [
  { value: "studentName", label: "Student Name", type: "text" },
  { value: "fatherName", label: "Father Name", type: "text" },
  {
    value: "class",
    label: "Class",
    type: "enum",
    options: [
      "Nursery",
      "LKG",
      "UKG",
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
    ],
  },
  {
    value: "section",
    label: "Section",
    type: "enum",
    options: ["A", "B", "C", "D"],
  },
  { value: "srNo", label: "SR No", type: "text" },
  { value: "aadhar", label: "Aadhar", type: "text" },
  { value: "state", label: "State", type: "text" },
  { value: "adDate", label: "Admission Date", type: "date" },
  { value: "dob", label: "Date of Birth", type: "date" },
];

const textOperators = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
];

const dateOperators = [
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
  { value: "between", label: "Between" },
];

export function FilterPanel({
  activeFilters = [], // Default to empty array if not provided
  onApplyFilters,
  onClose,
  isOpen, // Added isOpen prop
}) {
  // Local state for managing filters while the panel is open
  const [filters, setFilters] = useState(activeFilters);

  const [position, setPosition] = useState({ x: 180, y: 80 });
  const [size, setSize] = useState({ width: 380, height: 460 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(new Set());
  const [invalidMap, setInvalidMap] = useState({});

  const panelRef = useRef(null);
  const dragOrigin = useRef(null);
  const resizeOrigin = useRef(null);

  // Sync local state if activeFilters prop changes (e.g. cleared externally)
  useEffect(() => {
    setFilters(activeFilters || []);
  }, [activeFilters]);

  const getColumnConfig = (colValue) =>
    filterColumns.find((c) => c.value === colValue);

  const getOperators = (type) => {
    switch (type) {
      case "date":
        return dateOperators;
      case "enum":
        return [{ value: "in", label: "Is One Of" }];
      default:
        return textOperators;
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging && dragOrigin.current) {
        const dx = e.clientX - dragOrigin.current.x;
        const dy = e.clientY - dragOrigin.current.y;

        const newX = Math.max(
          10,
          Math.min(
            window.innerWidth - size.width - 10,
            dragOrigin.current.xOffset + dx
          )
        );

        const newY = Math.max(
          10,
          Math.min(
            window.innerHeight - (isMinimized ? 52 : size.height) - 10,
            dragOrigin.current.yOffset + dy
          )
        );

        setPosition({ x: newX, y: newY });
      }

      if (isResizing && resizeOrigin.current) {
        const dx = e.clientX - resizeOrigin.current.x;
        const dy = e.clientY - resizeOrigin.current.y;

        const newW = Math.max(
          320,
          Math.min(
            window.innerWidth - position.x - 10,
            resizeOrigin.current.w + dx
          )
        );

        const newH = Math.max(
          220,
          Math.min(
            window.innerHeight - position.y - 10,
            resizeOrigin.current.h + dy
          )
        );

        setSize({ width: newW, height: newH });
      }
    };

    const handleUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragOrigin.current = null;
      resizeOrigin.current = null;
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [
    isDragging,
    isResizing,
    size.width,
    size.height,
    position.x,
    position.y,
    isMinimized,
  ]);

  const onDragStart = (e) => {
    e.preventDefault();
    dragOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      xOffset: position.x,
      yOffset: position.y,
    };
    setIsDragging(true);
  };

  const onResizeStart = (e) => {
    e.stopPropagation();
    resizeOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };
    setIsResizing(true);
  };

  const addFilter = () => {
    const newFilter = {
      id: `filter-${Date.now()}`,
      column: "studentName",
      operator: "contains",
      value: "",
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);

    const newExpanded = new Set(expandedFilters);
    newExpanded.add(newFilter.id);
    setExpandedFilters(newExpanded);
  };

  const removeFilter = (id) => {
    const newFilters = filters.filter((f) => f.id !== id);
    setFilters(newFilters);

    const next = { ...invalidMap };
    delete next[id];
    setInvalidMap(next);
  };

  const moveFilter = (id, dir) => {
    const idx = filters.findIndex((f) => f.id === id);
    if (idx === -1) return;

    const copy = [...filters];
    const newIndex =
      dir === "up" ? Math.max(0, idx - 1) : Math.min(copy.length - 1, idx + 1);
    const [item] = copy.splice(idx, 1);
    copy.splice(newIndex, 0, item);
    setFilters(copy);
  };

  const updateFilter = (id, updates) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const validateFilter = (f) => {
    const col = getColumnConfig(f.column);
    const op = f.operator;
    let err = null;

    if (!f.column) err = "Select a column";
    if (!op) err = "Select operator";

    if (col?.type === "enum") {
      if (!Array.isArray(f.value) || f.value.length === 0) {
        err = "Select at least one option";
      }
    }

    if (col?.type === "date" && op === "between") {
      if (!f.value || !f.value.min || !f.value.max) {
        err = "Enter start and end date";
      } else if (new Date(f.value.min) > new Date(f.value.max)) {
        err = "Start date must be earlier";
      }
    }

    if (
      col?.type === "text" &&
      typeof f.value === "string" &&
      f.value.trim() === ""
    ) {
      err = "Enter a value";
    }

    return err;
  };

  useEffect(() => {
    const map = {};
    // Ensure filters is an array before iterating
    if (Array.isArray(filters)) {
      for (const f of filters) map[f.id] = validateFilter(f);
    }
    setInvalidMap(map);
  }, [filters]);

  const anyInvalid = Object.values(invalidMap).some((v) => v !== null);

  const handleApply = () => {
    if (!anyInvalid && onApplyFilters) {
      onApplyFilters(filters);
      onClose();
    }
  };

  const handleClear = () => {
    setFilters([]);
    setExpandedFilters(new Set());
    setInvalidMap({});
    if (onApplyFilters) onApplyFilters([]);
  };

  const toggleExpanded = (id) => {
    const s = new Set(expandedFilters);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpandedFilters(s);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={panelRef}
      className="fixed z-[9999] rounded-xl shadow-2xl bg-black/90 border border-white/20 backdrop-blur-md select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 52 : size.height,
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 cursor-grab"
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-2 text-white">
          <GripVertical className="h-4 w-4 text-white/50" />
          <span className="text-sm font-medium">Advanced Filters</span>
          {filters.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300">
              {filters.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* BODY */}
      {!isMinimized && (
        <>
          <div
            className="p-3 overflow-auto custom-scrollbar"
            style={{ height: size.height - 120 }}
          >
            {filters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-sm text-white/50 mb-3">No filters applied</p>
                <button
                  onClick={addFilter}
                  className="flex items-center px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Filter
                </button>
              </div>
            ) : (
              filters.map((filter, idx) => {
                const colCfg = getColumnConfig(filter.column);
                const isExpanded = expandedFilters.has(filter.id);
                const invalidMsg = invalidMap[filter.id];

                return (
                  <div
                    key={filter.id}
                    className={`mb-3 rounded-lg border border-white/10 overflow-hidden transition-all ${
                      invalidMsg ? "ring-2 ring-red-500/30" : ""
                    }`}
                  >
                    {/* FILTER HEADER */}
                    <div
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5"
                      onClick={() => toggleExpanded(filter.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {colCfg?.label}
                        </span>
                        <span className="text-xs text-white/50">
                          {filter.operator}
                        </span>
                        {invalidMsg && (
                          <span className="ml-2 text-xs text-red-400">
                            {invalidMsg}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFilter(filter.id, "up");
                          }}
                          className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFilter(filter.id, "down");
                          }}
                          className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFilter(filter.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-white/50" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/50" />
                        )}
                      </div>
                    </div>

                    {/* BODY */}
                    {isExpanded && (
                      <div className="p-3 pt-1 space-y-3">
                        {/* COLUMN + OPERATOR */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-white/50 mb-1 block">
                              Column
                            </label>
                            <select
                              value={filter.column}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  column: e.target.value,
                                  operator: getOperators(
                                    getColumnConfig(e.target.value)?.type
                                  )[0].value,
                                  value:
                                    getColumnConfig(e.target.value)?.type ===
                                    "enum"
                                      ? []
                                      : "",
                                })
                              }
                              className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40 [&>option]:text-black"
                            >
                              {filterColumns.map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs text-white/50 mb-1 block">
                              Operator
                            </label>
                            <select
                              value={filter.operator}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  operator: e.target.value,
                                })
                              }
                              className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40 [&>option]:text-black"
                            >
                              {getOperators(colCfg?.type).map((op) => (
                                <option key={op.value} value={op.value}>
                                  {op.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* VALUE FIELD(S) */}
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">
                            Value
                          </label>

                          {/* ENUM MULTI-SELECT */}
                          {colCfg?.type === "enum" && (
                            <div className="grid grid-cols-2 gap-2">
                              {colCfg.options.map((opt) => {
                                const selected =
                                  Array.isArray(filter.value) &&
                                  filter.value.includes(opt);

                                return (
                                  <label
                                    key={opt}
                                    className="flex items-center gap-2 p-1 rounded hover:bg-white/5 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={(e) => {
                                        const next = Array.isArray(filter.value)
                                          ? [...filter.value]
                                          : [];
                                        if (e.target.checked) next.push(opt);
                                        else {
                                          const i = next.indexOf(opt);
                                          if (i >= 0) next.splice(i, 1);
                                        }
                                        updateFilter(filter.id, {
                                          value: next,
                                        });
                                      }}
                                      className="rounded border-white/20 bg-black/40 text-blue-500 focus:ring-0"
                                    />
                                    <span className="text-sm text-white">
                                      {opt}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}

                          {/* DATE BETWEEN */}
                          {colCfg?.type === "date" &&
                            filter.operator === "between" && (
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  value={filter.value?.min || ""}
                                  onChange={(e) =>
                                    updateFilter(filter.id, {
                                      value: {
                                        ...(filter.value || {}),
                                        min: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40"
                                />
                                <div className="flex items-center px-1 text-sm text-white/50">
                                  to
                                </div>
                                <input
                                  type="date"
                                  value={filter.value?.max || ""}
                                  onChange={(e) =>
                                    updateFilter(filter.id, {
                                      value: {
                                        ...(filter.value || {}),
                                        max: e.target.value,
                                      },
                                    })
                                  }
                                  className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40"
                                />
                              </div>
                            )}

                          {/* DATE SINGLE */}
                          {colCfg?.type === "date" &&
                            filter.operator !== "between" && (
                              <input
                                type="date"
                                value={filter.value || ""}
                                onChange={(e) =>
                                  updateFilter(filter.id, {
                                    value: e.target.value,
                                  })
                                }
                                className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40"
                              />
                            )}

                          {/* TEXT DEFAULT */}
                          {colCfg?.type === "text" && (
                            <input
                              type="text"
                              value={filter.value}
                              onChange={(e) =>
                                updateFilter(filter.id, {
                                  value: e.target.value,
                                })
                              }
                              placeholder="Enter value..."
                              className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-white/40 placeholder:text-white/30"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {filters.length > 0 && (
              <button
                onClick={addFilter}
                className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-white/20 hover:bg-white/5 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Filter
              </button>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-white/5">
            <button
              disabled={filters.length === 0}
              onClick={handleClear}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear All
            </button>
            <button
              disabled={filters.length === 0 || anyInvalid}
              onClick={handleApply}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}

      {/* RESIZE HANDLE */}
      {!isMinimized && (
        <div
          className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize"
          onMouseDown={onResizeStart}
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-white/30" />
        </div>
      )}
    </div>,
    document.body
  );
}

export default FilterPanel;
