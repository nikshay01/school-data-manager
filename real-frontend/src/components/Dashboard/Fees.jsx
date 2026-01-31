import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  IndianRupee,
  Users,
  Clock,
  Filter,
  ArrowLeft,
  User,
} from "lucide-react";
import api from "../../api/axios";
import FeesModal from "../Students/FeesModal";
import StudentProfileModal from "../Students/StudentProfileModal";
import "../../index.css";
import "../../App.css";

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View State
  const [viewMode, setViewMode] = useState("dashboard"); // 'dashboard' | 'list'
  const [filterType, setFilterType] = useState("all"); // 'all' | 'collected' | 'pending' | 'zero'
  const [minFee, setMinFee] = useState("");

  // Search & Modals
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFeeModal, setActiveFeeModal] = useState(null); // { type: 'add'|'history', student: ... }
  const [selectedProfileStudent, setSelectedProfileStudent] = useState(null);
  const [notification, setNotification] = useState(null);

  // --- Data Fetching ---
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students/0");
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching students for fees:", err);
      setError(
        "Failed to load fee data. Please ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Calculations ---
  const processStudentFee = (student) => {
    const received =
      student.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalStructure =
      (student.fees?.adFee || 0) +
      (student.fees?.fee || 0) +
      (student.fees?.bus || 0) +
      (student.fees?.hostel || 0) -
      (student.fees?.discount || 0);
    const due = Math.max(0, totalStructure - received);

    return {
      ...student,
      feeStats: { received, totalStructure, due },
      feeSummary: {
        total: totalStructure,
        received: received,
        due: due,
      },
    };
  };

  const processedStudents = useMemo(
    () => students.map(processStudentFee),
    [students]
  );

  const stats = useMemo(() => {
    let totalCollected = 0;
    let totalDue = 0;
    let zeroPaidCount = 0;

    processedStudents.forEach((s) => {
      totalCollected += s.feeStats.received;
      totalDue += s.feeStats.due;
      if (s.feeStats.received === 0) zeroPaidCount++;
    });

    return {
      totalCollected,
      totalDue,
      zeroPaidCount,
      totalStudents: students.length,
    };
  }, [processedStudents]);

  const recentTransactions = useMemo(() => {
    const allPayments = [];
    processedStudents.forEach((student) => {
      if (student.payments) {
        student.payments.forEach((payment) => {
          allPayments.push({
            ...payment,
            studentName: student.studentName,
            studentId: student._id || student.id,
            fullStudent: student,
          });
        });
      }
    });

    return allPayments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [processedStudents]);

  const filteredList = useMemo(() => {
    let result = processedStudents;

    // 1. Filter by Type
    if (filterType === "collected") {
      result = result.filter((s) => s.feeStats.received > 0);
    } else if (filterType === "pending") {
      result = result.filter((s) => s.feeStats.due > 0);
    } else if (filterType === "zero") {
      result = result.filter((s) => s.feeStats.received === 0);
    }

    // 2. Filter by Min Fee
    if (minFee) {
      const minVal = Number(minFee);
      if (!isNaN(minVal)) {
        result = result.filter((s) => s.feeStats.totalStructure > minVal);
      }
    }

    // 3. Search (if in list view)
    if (searchTerm && viewMode === "list") {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.studentName.toLowerCase().includes(lowerTerm) ||
          (s.srNo && s.srNo.toLowerCase().includes(lowerTerm))
      );
    }

    return result;
  }, [processedStudents, filterType, minFee, searchTerm, viewMode]);

  // Quick Search for Dashboard
  const quickSearchResults = useMemo(() => {
    if (!searchTerm || viewMode !== "dashboard") return [];
    return processedStudents
      .filter(
        (s) =>
          s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.srNo && s.srNo.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 5);
  }, [processedStudents, searchTerm, viewMode]);

  // --- Handlers ---
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCardClick = (type) => {
    setFilterType(type);
    setViewMode("list");
    setSearchTerm(""); // Reset search when switching views
  };

  const handleFeeUpdate = async (updatedStudentData) => {
    try {
      const payload = { ...updatedStudentData };
      const studentId = updatedStudentData._id || updatedStudentData.id;

      // Clean payload
      delete payload.feeSummary;
      delete payload.feeStats; // Remove our calculated field
      delete payload.id;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      await api.put(`/students/${studentId}`, payload);
      await fetchStudents();

      showNotification("Data updated successfully", "success");
      setActiveFeeModal(null);

      // If we are in profile modal, update the selected student too
      if (selectedProfileStudent && selectedProfileStudent.id === studentId) {
        // We'll close the modal to force refresh or rely on parent update.
        // Ideally we update the local state, but for simplicity we'll just close it or let the user see the update in the list.
        // Let's close it to be safe and avoid stale data.
        // setSelectedProfileStudent(null);
        // Actually, let's keep it open but maybe we can't easily update the deep object without re-finding it.
        // Let's try to find it in the new students list (which we just fetched).
        // But fetchStudents is async and we just called it. We can't guarantee it's done.
        // So for now, let's just close it or leave it. Leaving it might show stale data until re-open.
        // Let's close it.
        setSelectedProfileStudent(null);
      }
    } catch (err) {
      console.error("Failed to update:", err);
      showNotification("Failed to update data", "error");
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-10 relative overflow-y-auto custom-scrollbar">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${
            notification.type === "success"
              ? "bg-green-500/20 border-green-500/50 text-green-200"
              : "bg-red-500/20 border-red-500/50 text-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase">
        FEES MANAGEMENT
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-[1200px] mb-8">
        <div
          onClick={() => handleCardClick("collected")}
          className={`bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all duration-300 cursor-pointer ${
            filterType === "collected" && viewMode === "list"
              ? "ring-2 ring-green-500 bg-white/10"
              : ""
          }`}
        >
          <div className="p-3 bg-green-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <IndianRupee className="text-green-400" size={24} />
          </div>
          <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">
            Total Collected
          </h3>
          <p className="text-white text-2xl font-bold text-green-400">
            ₹ {stats.totalCollected.toLocaleString()}
          </p>
        </div>

        <div
          onClick={() => handleCardClick("pending")}
          className={`bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all duration-300 cursor-pointer ${
            filterType === "pending" && viewMode === "list"
              ? "ring-2 ring-red-500 bg-white/10"
              : ""
          }`}
        >
          <div className="p-3 bg-red-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Clock className="text-red-400" size={24} />
          </div>
          <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">
            Pending Fees
          </h3>
          <p className="text-white text-2xl font-bold text-red-400">
            ₹ {stats.totalDue.toLocaleString()}
          </p>
        </div>

        <div
          onClick={() => handleCardClick("zero")}
          className={`bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all duration-300 cursor-pointer ${
            filterType === "zero" && viewMode === "list"
              ? "ring-2 ring-yellow-500 bg-white/10"
              : ""
          }`}
        >
          <div className="p-3 bg-yellow-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Filter className="text-yellow-400" size={24} />
          </div>
          <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">
            0 Fees Paid
          </h3>
          <p className="text-white text-2xl font-bold text-yellow-400">
            {stats.zeroPaidCount}
          </p>
        </div>

        <div
          onClick={() => handleCardClick("all")}
          className={`bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all duration-300 cursor-pointer ${
            filterType === "all" && viewMode === "list"
              ? "ring-2 ring-blue-500 bg-white/10"
              : ""
          }`}
        >
          <div className="p-3 bg-blue-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Users className="text-blue-400" size={24} />
          </div>
          <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">
            Total Students
          </h3>
          <p className="text-white text-2xl font-bold">{stats.totalStudents}</p>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {viewMode === "dashboard" && (
        <>
          {/* Quick Search */}
          <div className="w-full max-w-[1200px] mb-8 flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search student to record payment (Name or SR No)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all backdrop-blur-md"
              />

              {/* Dropdown */}
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-xl z-50 overflow-hidden shadow-2xl">
                  {quickSearchResults.length > 0 ? (
                    quickSearchResults.map((s) => (
                      <button
                        key={s._id}
                        onClick={() =>
                          setActiveFeeModal({ type: "add", student: s })
                        }
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="text-left">
                          <p className="text-white font-bold">
                            {s.studentName}
                          </p>
                          <p className="text-white/40 text-xs">
                            Class: {s.class} | SR: {s.srNo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                          <Plus size={16} /> RECORD
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-white/40 italic text-center">
                      No students found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="w-full max-w-[1200px] bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold flex items-center gap-3">
                <Clock className="text-blue-400" size={24} />
                Recent Transactions
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-white border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                      Student
                    </th>
                    <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                      Amount
                    </th>
                    <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                      Receipt
                    </th>
                    <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                      Date
                    </th>
                    <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((record, idx) => (
                      <tr
                        key={record._id || idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-4">
                          <button
                            onClick={() =>
                              setSelectedProfileStudent(record.fullStudent)
                            }
                            className="font-bold hover:text-blue-400 transition-colors text-left"
                          >
                            {record.studentName}
                          </button>
                        </td>
                        <td className="p-4 font-mono text-green-400 font-bold">
                          ₹ {record.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-white/60">
                          {record.rn || "—"}
                        </td>
                        <td className="p-4 text-white/60">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <button
                            onClick={() =>
                              setActiveFeeModal({
                                type: "history",
                                student: record.fullStudent,
                              })
                            }
                            className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
                            title="View Fee Details"
                          >
                            VIEW FEE
                          </button>
                          <button
                            onClick={() =>
                              setActiveFeeModal({
                                type: "inquiry",
                                student: record.fullStudent,
                              })
                            }
                            className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                            title="View Inquiry"
                          >
                            INQUIRY
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-10 text-center text-white/20 italic"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="w-full max-w-[1200px] bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md mb-12 flex flex-col h-[600px]">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode("dashboard")}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-white text-2xl font-bold">
                {filterType === "all" && "All Students"}
                {filterType === "collected" && "Fees Collected"}
                {filterType === "pending" && "Pending Fees"}
                {filterType === "zero" && "Zero Fees Paid"}
              </h2>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search list..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-white/50 text-xs font-bold uppercase">
                  Fees &gt;
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  className="bg-transparent w-20 text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-white border-collapse relative">
              <thead className="sticky top-0 bg-[#1a1a1a] z-10">
                <tr className="border-b border-white/10">
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                    Student
                  </th>
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest">
                    Class
                  </th>
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">
                    Total Fee
                  </th>
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">
                    Paid
                  </th>
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">
                    Due
                  </th>
                  <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length > 0 ? (
                  filteredList.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 font-bold">{s.studentName}</td>
                      <td className="p-4 text-white/70">{s.class}</td>
                      <td className="p-4 text-right font-mono">
                        ₹{s.feeStats.totalStructure.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-green-400">
                        ₹{s.feeStats.received.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-mono text-red-400">
                        ₹{s.feeStats.due.toLocaleString()}
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedProfileStudent(s)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          title="View Profile"
                        >
                          <User size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setActiveFeeModal({ type: "history", student: s })
                          }
                          className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
                          title="View Fee Details"
                        >
                          VIEW FEE
                        </button>
                        <button
                          onClick={() =>
                            setActiveFeeModal({ type: "inquiry", student: s })
                          }
                          className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                          title="View Inquiry"
                        >
                          INQUIRY
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-white/30 italic"
                    >
                      No students match the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-right text-white/40 text-xs">
            Showing {filteredList.length} students
          </div>
        </div>
      )}

      {/* Modals */}
      {activeFeeModal && (
        <FeesModal
          isOpen={!!activeFeeModal}
          onClose={() => setActiveFeeModal(null)}
          type={activeFeeModal.type}
          student={activeFeeModal.student}
          onUpdate={handleFeeUpdate}
        />
      )}

      {selectedProfileStudent && (
        <StudentProfileModal
          student={selectedProfileStudent}
          students={filteredList} // Allow navigation within the current filtered list
          onChangeStudent={setSelectedProfileStudent}
          onClose={() => setSelectedProfileStudent(null)}
          onUpdate={handleFeeUpdate}
          onFeeAction={(type, s) => {
            // Close profile modal and open fee modal? Or open fee modal on top?
            // Let's open fee modal on top.
            setActiveFeeModal({ type, student: s });
          }}
        />
      )}
    </div>
  );
}
