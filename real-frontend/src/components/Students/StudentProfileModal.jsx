import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------ Row Component ------------------ */
const Row = ({ label, value, editable, type = "text", options, onChange }) => {
  const copyValue = () => {
    if (value !== undefined && value !== null) {
      navigator.clipboard.writeText(String(value));
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-white/60 min-w-[130px]">{label} :</span>

      {editable ? (
        type === "select" ? (
          <select
            value={value ? "YES" : "NO"}
            onChange={(e) => onChange(e.target.value === "YES")}
            className="bg-transparent border-b border-white/30 text-white font-medium flex-1 outline-none"
          >
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        ) : (
          <input
            type={type}
            value={value === "—" ? "" : value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent border-b border-white/30 text-white font-medium flex-1 outline-none"
          />
        )
      ) : (
        <span className="text-white font-medium flex-1">
          {typeof value === "boolean" ? (value ? "YES" : "NO") : value || "—"}
        </span>
      )}

      <button
        onClick={copyValue}
        className="text-white/40 hover:text-white transition-colors"
        title="Copy"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-3 h-3"
          fill="currentColor"
        >
          <path d="M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z" />
        </svg>
      </button>
    </div>
  );
};

/* ------------------ Modal ------------------ */
const StudentProfileModal = ({
  student,
  students,
  onChangeStudent,
  onClose,
  onUpdate,
  onFeeAction,
}) => {
  if (!student) return null;

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(student);

  useEffect(() => {
    setDraft(student);
    setEditMode(false);
  }, [student]);

  const index = students.findIndex((s) => s.id === student.id);
  const prevStudent = students[index - 1];
  const nextStudent = students[index + 1];

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditClick = async () => {
    if (editMode) {
      if (onUpdate) {
        await onUpdate(draft);
      }
    }
    setEditMode(!editMode);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="
            relative w-full max-w-4xl rounded-3xl
            bg-white/10 backdrop-blur-lg
            border border-white/20 shadow-2xl
            px-8 pt-8 pb-6
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            ✕
          </button>

          {/* Avatar */}
          <div className="absolute top-6 right-6 mb-3">
            <img
              src={student.studentPhoto}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
            />
          </div>

          {/* Content Block */}
          <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-4">
            <Row
              label="STUDENT NAME"
              value={draft.studentName}
              editable={editMode}
              onChange={(v) => updateField("studentName", v)}
            />
            <Row
              label="ADDRESS"
              value={draft.address}
              editable={editMode}
              onChange={(v) => updateField("address", v)}
            />

            <Row
              label="FATHER NAME"
              value={draft.fatherName}
              editable={editMode}
              onChange={(v) => updateField("fatherName", v)}
            />
            <Row
              label="STATE"
              value={draft.State}
              editable={editMode}
              onChange={(v) => updateField("State", v)}
            />

            <Row
              label="CLASS"
              value={draft.class}
              editable={editMode}
              onChange={(v) => updateField("class", v)}
            />
            <Row
              label="SECTION"
              value={draft.section}
              editable={editMode}
              onChange={(v) => updateField("section", v)}
            />

            <Row
              label="CONTACT"
              value={draft.contact}
              editable={editMode}
              type="tel"
              onChange={(v) => updateField("contact", v)}
            />
            <Row
              label="DOB"
              value={draft.dob}
              editable={editMode}
              type="date"
              onChange={(v) => updateField("dob", v)}
            />

            <Row
              label="ADMISSION DATE"
              value={draft.adDate}
              editable={editMode}
              type="date"
              onChange={(v) => updateField("adDate", v)}
            />
            <Row
              label="AADHAR"
              value={draft.aadhar}
              editable={editMode}
              type="number"
              onChange={(v) => updateField("aadhar", v)}
            />

            <Row
              label="PEN ID"
              value={draft.penID}
              editable={editMode}
              type="number"
              onChange={(v) => updateField("penID", v)}
            />
            <Row
              label="APAAR ID"
              value={draft.apaarID}
              editable={editMode}
              onChange={(v) => updateField("apaarID", v)}
            />

            <Row
              label="LEFT SCHOOL?"
              value={draft.leftSchool}
              editable={editMode}
              type="select"
              onChange={(v) => updateField("leftSchool", v)}
            />
            <Row
              label="LEAVE DATE"
              value={draft.leftDate}
              editable={editMode}
              type="date"
              onChange={(v) => updateField("leftDate", v)}
            />

            <Row
              label="TC NUMBER"
              value={draft.tcNumber}
              editable={editMode}
              onChange={(v) => updateField("tcNumber", v)}
            />
            <Row
              label="UDISE REMOVED?"
              value={draft.udiseRemoved}
              editable={editMode}
              type="select"
              onChange={(v) => updateField("udiseRemoved", v)}
            />
          </div>

          {/* Fees (READ ONLY) */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 mt-6 pt-4 border-t border-white/20">
            <Row label="TOTAL FEE" value={`₹${student.feeSummary?.total}`} />
            <Row
              label="RECEIVED FEE"
              value={`₹${student.feeSummary?.received}`}
            />
            <Row label="DUE FEE" value={`₹${student.feeSummary?.due}`} />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => prevStudent && onChangeStudent(prevStudent)}
              disabled={!prevStudent}
              className="px-6 py-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 disabled:opacity-30"
            >
              ← PREVIOUS
            </button>

            <button
              onClick={() => onFeeAction && onFeeAction("add", student)}
              className="px-6 py-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
            >
              ADD FEE
            </button>

            <button
              onClick={handleEditClick}
              className="px-10 py-2 rounded-full bg-white/30 text-white font-semibold backdrop-blur-md hover:bg-white/40"
            >
              {editMode ? "SAVE" : "EDIT"}
            </button>

            <button
              onClick={() => nextStudent && onChangeStudent(nextStudent)}
              disabled={!nextStudent}
              className="px-6 py-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 disabled:opacity-30"
            >
              NEXT →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentProfileModal;
