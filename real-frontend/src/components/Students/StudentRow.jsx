import React from "react";
import FeesCell from "./FeesCell";
import ActionButtonsCell from "./ActionButtonsCell";

const StudentRow = ({ student, columns, onRowClick, index }) => {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors group">
      {columns.map((col) => {
        if (col.hidden) return null;

        if (col.key === "serialNumber") {
          return (
            <td
              key={col.key}
              className="p-4 align-middle text-white/50 text-sm"
            >
              {index + 1}
            </td>
          );
        }

        if (col.key === "fees") {
          return (
            <td key={col.key} className="p-4 align-top">
              <FeesCell feeSummary={student.feeSummary} />
            </td>
          );
        }

        if (col.key === "actions") {
          return (
            <td key={col.key} className="p-4 align-middle">
              <ActionButtonsCell student={student} />
            </td>
          );
        }

        if (col.key === "studentName") {
          return (
            <td
              key={col.key}
              className="p-4 align-middle font-bold text-blue-300 group-hover:text-blue-200 transition-colors cursor-pointer hover:underline"
              onClick={() => onRowClick(student)}
            >
              {student[col.key]}
            </td>
          );
        }

        return (
          <td key={col.key} className="p-4 align-middle text-white/90 text-sm">
            {student[col.key] || <span className="text-white/30">—</span>}
          </td>
        );
      })}
    </tr>
  );
};

export default StudentRow;
