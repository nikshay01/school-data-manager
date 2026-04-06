import React, { useState, useEffect } from "react";
import "../../index.css";
import "../../App.css";
import api from "../../api/axios";

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [className, setClassName] = useState("");
  const [availableClasses, setAvailableClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (className) fetchAttendance();
  }, [date, className]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/students/classes/all');
      setAvailableClasses(response.data);
      if (response.data.length > 0) {
        setClassName(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/${className}/${date}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    const updatedStudents = students.map((s) =>
      s.studentId === studentId ? { ...s, status } : s
    );
    setStudents(updatedStudents);
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, status: "Present" })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s.studentId,
        status: s.status,
      }));

      await api.post("/attendance", {
        date,
        className,
        records,
      });
      alert(`Attendance for ${className} on ${date} saved successfully!`);
      fetchAttendance(); // Refresh
    } catch (error) {
      alert("Error saving attendance.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const total = students.length;
  const present = students.filter(s => s.status === "Present").length;
  const absent = students.filter(s => s.status === "Absent").length;
  const halfDay = students.filter(s => s.status === "Half-Day").length;

  return (
    <div className="w-full h-full flex flex-col pt-8 px-10 relative overflow-y-auto">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase text-center">
        MANAGE ATTENDANCE
      </h1>

      <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md w-full max-w-4xl mx-auto mb-10">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-white mb-2 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="text-white mb-2 block">Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none custom-select"
            >
              {availableClasses.map((cls) => (
                <option key={cls} className="text-black bg-white" value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {className && !loading && students.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-lg hover:bg-white/15 transition-all">
              <span className="text-white/60 text-sm uppercase tracking-wider mb-1">Total</span>
              <span className="text-white text-3xl font-bold">{total}</span>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-lg hover:bg-green-500/30 transition-all">
              <span className="text-green-400 text-sm uppercase tracking-wider mb-1">Present</span>
              <span className="text-green-400 text-3xl font-bold">{present}</span>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-lg hover:bg-red-500/30 transition-all">
              <span className="text-red-400 text-sm uppercase tracking-wider mb-1">Absent</span>
              <span className="text-red-400 text-3xl font-bold">{absent}</span>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-md shadow-lg hover:bg-yellow-500/30 transition-all">
              <span className="text-yellow-400 text-sm uppercase tracking-wider mb-1">Half-Day</span>
              <span className="text-yellow-400 text-3xl font-bold">{halfDay}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-white animate-pulse">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-white/60">No students found for this class.</div>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleMarkAllPresent}
                className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-all font-bold text-sm"
              >
                ✓ Mark All Present
              </button>
            </div>
            <table className="w-full text-left text-white border-collapse mb-6">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-4 uppercase tracking-wider text-sm opacity-80">Roll No</th>
                  <th className="p-4 uppercase tracking-wider text-sm opacity-80">Name</th>
                  <th className="p-4 uppercase tracking-wider text-sm opacity-80">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4">{student.rollNumber || "N/A"}</td>
                    <td className="p-4">{student.studentName}</td>
                    <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleStatusChange(student.studentId, "Present")}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${student.status === "Present" ? "bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-white/5 text-white/50 hover:bg-white/10" }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, "Absent")}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${student.status === "Absent" ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-white/5 text-white/50 hover:bg-white/10" }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, "Half-Day")}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${student.status === "Half-Day" ? "bg-yellow-500 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-white/5 text-white/50 hover:bg-white/10" }`}
                        >
                          Half-Day
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
