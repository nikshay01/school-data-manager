import React, { useState } from "react";

const StudentProfileModal = ({ student, onClose }) => {
  const [formData, setFormData] = useState({ ...student });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving student data:", formData);
    // Placeholder save logic
    onClose();
  };

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-full max-h-[90vh] bg-black/80 border border-white/20 rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-6">
            <img
              src={formData.studentPhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white/10 shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {formData.studentName}
              </h2>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                {formData.class} - {formData.section} | Roll No: {formData.srNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2 mb-2">
              <h3 className="text-blue-300 text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                Personal Details
              </h3>
            </div>
            <InputField
              label="Full Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
            />
            <InputField
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
            />
            <InputField label="Gender" name="gender" value="Male" disabled />{" "}
            {/* Mock data didn't have gender, defaulting */}
            <InputField
              label="Aadhar Number"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
            />
            <InputField
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
            <div className="col-span-2 mt-4 mb-2">
              <h3 className="text-green-300 text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                Academic Info
              </h3>
            </div>
            <InputField
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
            />
            <InputField
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
            <InputField
              label="Admission Date"
              name="adDate"
              type="date"
              value={formData.adDate}
              onChange={handleChange}
            />
            <InputField
              label="PEN ID"
              name="penID"
              value={formData.penID}
              onChange={handleChange}
            />
            <InputField
              label="APAAR ID"
              name="apaarID"
              value={formData.apaarID}
              onChange={handleChange}
            />
            <InputField
              label="State"
              name="State"
              value={formData.State}
              onChange={handleChange}
            />
            <div className="col-span-2 mt-4 mb-2">
              <h3 className="text-purple-300 text-sm font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                Address
              </h3>
            </div>
            <div className="col-span-2">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-white/40 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-white/70 hover:text-white font-bold transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-white/50 uppercase font-bold tracking-wider ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-all ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

export default StudentProfileModal;
