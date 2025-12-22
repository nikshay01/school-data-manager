import React, { useState, useEffect, useMemo, useRef } from "react";
import mockStudents from "../../data/mockStudents";
import StudentRow from "./StudentRow";
import TableHeader from "./TableHeader";
import SearchBar from "./SearchBar";
import PaginationController from "./PaginationController";
import ColumnSelectorPanel from "./ColumnSelectorPanel";
import FilterPanel from "./FilterPanel";
import StudentProfileModal from "./StudentProfileModal";

const StudentTable = () => {
  // --- State ---
  const [allStudents] = useState(mockStudents);
  const [displayedStudents, setDisplayedStudents] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const [batchSize, setBatchSize] = useState(20);
  const [loadedCount, setLoadedCount] = useState(20);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [rowDensity, setRowDensity] = useState("standard");
  const [showDensitySelector, setShowDensitySelector] = useState(false);
  const [notification, setNotification] = useState(null);

  const [columns, setColumns] = useState([
    {
      key: "serialNumber",
      label: "S.No",
      sortable: false,
      hidden: false,
    },
    {
      key: "studentName",
      label: "Student Name",
      sortable: true,
      hidden: false,
    },
    { key: "fatherName", label: "Father Name", sortable: true, hidden: false },
    { key: "class", label: "Class", sortable: true, hidden: false },
    { key: "section", label: "Section", sortable: true, hidden: false },
    { key: "srNo", label: "SR No.", sortable: true, hidden: false },
    { key: "aadhar", label: "Aadhar", sortable: true, hidden: false },
    { key: "fees", label: "Fees Status", sortable: false, hidden: false },
    { key: "actions", label: "Actions", sortable: false, hidden: false },
  ]);

  const observerTarget = useRef(null);

  // --- Logic ---

  // 1. Filter & Search
  const processedStudents = useMemo(() => {
    let result = [...allStudents];

    // Apply Advanced Filters
    // Apply Advanced Filters
    if (filters.length > 0) {
      result = result.filter((student) => {
        return filters.every((filter) => {
          if (
            !filter.column ||
            !filter.operator ||
            filter.value === undefined ||
            filter.value === null ||
            filter.value === ""
          )
            return true;

          const rawStudentValue = student[filter.column];
          const studentValue = String(rawStudentValue || "").toLowerCase();

          // Handle Text Operators
          if (
            ["contains", "equals", "startsWith", "endsWith"].includes(
              filter.operator
            )
          ) {
            const filterValue = String(filter.value).toLowerCase();
            switch (filter.operator) {
              case "contains":
                return studentValue.includes(filterValue);
              case "equals":
                return studentValue === filterValue;
              case "startsWith":
                return studentValue.startsWith(filterValue);
              case "endsWith":
                return studentValue.endsWith(filterValue);
              default:
                return true;
            }
          }

          // Handle Enum (Array) Operators
          if (filter.operator === "in" && Array.isArray(filter.value)) {
            // Check if student value is in the selected options
            // We compare loosely or strictly depending on data.
            // Assuming student data matches option values exactly or as string.
            return filter.value.some(
              (v) => String(v).toLowerCase() === studentValue
            );
          }

          // Handle Date Operators
          if (["before", "after", "between"].includes(filter.operator)) {
            const studentDate = new Date(rawStudentValue);
            if (isNaN(studentDate.getTime())) return false; // Invalid student date

            if (filter.operator === "between") {
              const min = filter.value?.min ? new Date(filter.value.min) : null;
              const max = filter.value?.max ? new Date(filter.value.max) : null;
              if (!min || !max) return true;
              return studentDate >= min && studentDate <= max;
            }

            const filterDate = new Date(filter.value);
            if (isNaN(filterDate.getTime())) return true;

            if (filter.operator === "before") return studentDate < filterDate;
            if (filter.operator === "after") return studentDate > filterDate;
          }

          return true;
        });
      });
    }

    // Apply Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((student) => {
        if (searchColumn === "all") {
          return (
            student.studentName.toLowerCase().includes(lowerTerm) ||
            student.fatherName.toLowerCase().includes(lowerTerm) ||
            student.class.toLowerCase().includes(lowerTerm) ||
            student.srNo.toLowerCase().includes(lowerTerm) ||
            (student.aadhar && student.aadhar.includes(lowerTerm))
          );
        } else {
          return String(student[searchColumn] || "")
            .toLowerCase()
            .includes(lowerTerm);
        }
      });
    }

    // Apply Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [allStudents, filters, searchTerm, searchColumn, sortConfig]);

  // 2. Pagination / Infinite Scroll
  useEffect(() => {
    setLoadedCount(batchSize); // Reset loaded count when batch size changes
  }, [batchSize, processedStudents]); // Also reset when data changes

  useEffect(() => {
    setDisplayedStudents(processedStudents.slice(0, loadedCount));
  }, [processedStudents, loadedCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadedCount((prev) =>
            Math.min(prev + batchSize, processedStudents.length)
          );
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [batchSize, processedStudents.length]);

  // --- Handlers ---

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleColumn = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-4 px-4 relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down">
          <div
            className={`px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-200"
                : "bg-red-500/20 border-red-500/50 text-red-200"
            }`}
          >
            <span className="text-xl">
              {notification.type === "success" ? "✅" : "❌"}
            </span>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="w-full max-w-[1400px] flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-white font-irish-grover text-[48px] tracking-wide leading-none">
              STUDENTS
            </h1>
            <p className="text-white/50 text-sm mt-2 ml-1">
              Manage your student database with ease.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilterPanel(true)}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 font-bold ${
                filters.length > 0
                  ? "bg-red-500/20 border-red-500 text-red-300 animate-pulse"
                  : "bg-white/10 border-white/30 text-white hover:bg-white/20"
              }`}
            >
              <span className="text-lg">⚡</span>
              {filters.length > 0 ? "FILTERS ACTIVE" : "ADVANCED FILTERS"}
            </button>
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all"
            >
              ⚙ COLUMNS
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDensitySelector(!showDensitySelector)}
                className="px-4 py-2 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all"
              >
                ≡ ROW HEIGHT
              </button>

              {showDensitySelector && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-black/90 border border-white/20 rounded-xl shadow-xl backdrop-blur-xl z-50 overflow-hidden flex flex-col">
                  {["compact", "standard", "comfortable"].map((density) => (
                    <button
                      key={density}
                      onClick={() => {
                        setRowDensity(density);
                        setShowDensitySelector(false);
                      }}
                      className={`px-4 py-3 text-left text-sm font-medium transition-colors ${
                        rowDensity === density
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {density.charAt(0).toUpperCase() + density.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchColumn={searchColumn}
            onSearchColumnChange={setSearchColumn}
            columns={columns}
          />
          <PaginationController
            batchSize={batchSize}
            setBatchSize={setBatchSize}
            totalItems={processedStudents.length}
            loadedItems={displayedStudents.length}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="w-full max-w-[1400px] flex-1 bg-black/20 border border-white/10 rounded-[32px] p-6 backdrop-blur-md overflow-hidden flex flex-col relative">
        {/* Floating Panels */}
        {showColumnSelector && (
          <ColumnSelectorPanel
            columns={columns}
            onToggleColumn={toggleColumn}
            onClose={() => setShowColumnSelector(false)}
          />
        )}

        {showFilterPanel && (
          <FilterPanel
            isOpen={true}
            activeFilters={filters}
            onApplyFilters={setFilters}
            onClose={() => setShowFilterPanel(false)}
          />
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar rounded-xl border border-white/5">
          <table className="w-full text-left text-white border-collapse relative">
            <TableHeader
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
            <tbody>
              {displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    index={index}
                    columns={columns}
                    density={rowDensity}
                    onRowClick={setSelectedStudent}
                    onCopy={showNotification}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-10 text-center text-white/30 italic"
                  >
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
              {/* Sentinel for infinite scroll */}
              <tr ref={observerTarget} className="h-4"></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentTable;
