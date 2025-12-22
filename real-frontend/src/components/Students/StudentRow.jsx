import React from "react";
import FeesCell from "./FeesCell";
import ActionButtonsCell from "./ActionButtonsCell";

const StudentRow = ({
  student,
  columns,
  onRowClick,
  index,
  density = "standard",
  onCopy,
}) => {
  const paddingClass = {
    compact: "p-[1px]",
    standard: "p-4",
    comfortable: "p-6",
  }[density];

  const handleCopy = (e, text, label) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (onCopy) onCopy(`Copied ${label}: ${text}`);
  };

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors group">
      {columns.map((col) => {
        if (col.hidden) return null;

        if (col.key === "serialNumber") {
          return (
            <td
              key={col.key}
              className={`${paddingClass} align-middle text-white/50 text-sm`}
            >
              {index + 1}
            </td>
          );
        }

        if (col.key === "fees") {
          return (
            <td key={col.key} className={`${paddingClass} align-top`}>
              <FeesCell feeSummary={student.feeSummary} />
            </td>
          );
        }

        if (col.key === "actions") {
          return (
            <td key={col.key} className={`${paddingClass} align-middle`}>
              <ActionButtonsCell student={student} />
            </td>
          );
        }

        if (col.key === "studentName") {
          return (
            <td
              key={col.key}
              className={`${paddingClass} align-middle font-bold text-blue-300 group-hover:text-blue-200 transition-colors cursor-pointer hover:underline relative`}
              onClick={() => onRowClick(student)}
            >
              <div className="flex items-center gap-2">
                {student[col.key]}
                <button
                  onClick={(e) => handleCopy(e, student[col.key], "Name")}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all text-white/50 hover:text-white"
                  title="Copy Name"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </td>
          );
        }

        return (
          <td
            key={col.key}
            className={`${paddingClass} align-middle text-white/90 text-sm cursor-copy hover:bg-white/5 transition-colors`}
            onClick={(e) => handleCopy(e, student[col.key], col.label)}
            title={`Click to copy ${col.label}`}
          >
            {student[col.key] || <span className="text-white/30">—</span>}
          </td>
        );
      })}
    </tr>
  );
};

export default StudentRow;
