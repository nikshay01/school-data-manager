import React from "react";

const ActionButton = ({
  label,
  onClick,
  colorClass = "bg-white/10 hover:bg-white/20 text-white",
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`px-[5px] py-[2px] rounded-lg text-[10px] font-bold border border-white/10 transition-all ${colorClass}`}
  >
    {label}
  </button>
);

const ActionButtonsCell = ({ student, onFeeAction }) => {
  const handleAction = (action) => {
    if (onFeeAction) {
      if (action === "Add Fee") onFeeAction("add", student);
      if (action === "Edit Fee") onFeeAction("edit_structure", student);
      if (action === "Inquiry") onFeeAction("inquiry", student);
      if (action === "History") onFeeAction("history", student);
    }
    console.log(`${action} for ${student.studentName}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton
        label="Add Fee"
        onClick={() => handleAction("Add Fee")}
        colorClass="bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30"
      />
      <ActionButton label="Edit Fee" onClick={() => handleAction("Edit Fee")} />
      <ActionButton label="Inquiry" onClick={() => handleAction("Inquiry")} />
      <ActionButton label="History" onClick={() => handleAction("History")} />
    </div>
  );
};

export default ActionButtonsCell;
