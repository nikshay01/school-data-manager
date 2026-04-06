import React, { useState, useEffect } from "react";
import { X, Save, User, Building, Phone, Mail, Briefcase, Calendar, GraduationCap, IndianRupee } from "lucide-react";
import "../../index.css";
import "../../App.css";

const StaffModal = ({ isOpen, onClose, staff, onSave }) => {
  const isEditing = !!staff;

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "Teaching",
    designation: "",
    joiningDate: "",
    salaryStructure: {
      baseSalary: "",
      allowances: "",
      deductions: "",
    },
    status: "Active",
  });

  useEffect(() => {
    if (isEditing && staff) {
      setFormData({
        name: staff.name || "",
        employeeId: staff.employeeId || "",
        email: staff.email || "",
        phone: staff.phone || "",
        department: staff.department || "Teaching",
        designation: staff.designation || "",
        joiningDate: staff.joiningDate ? staff.joiningDate.split("T")[0] : "",
        salaryStructure: {
          baseSalary: staff.salaryStructure?.baseSalary || "",
          allowances: staff.salaryStructure?.allowances || "",
          deductions: staff.salaryStructure?.deductions || "",
        },
        status: staff.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        employeeId: "",
        email: "",
        phone: "",
        department: "Teaching",
        designation: "",
        joiningDate: new Date().toISOString().split("T")[0],
        salaryStructure: {
          baseSalary: "",
          allowances: "",
          deductions: "",
        },
        status: "Active",
      });
    }
  }, [staff, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary_")) {
      const field = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        salaryStructure: { ...prev.salaryStructure, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Briefcase className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? "Edit Staff Details" : "Add New Staff"}
              </h2>
              <p className="text-white/40 text-sm">
                Enter employee credentials and payroll structure
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="staff-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Basic Details */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-400" />
                Employee Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Full Name *</label>
                  <input
                    type="text" required name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="E.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Employee ID *</label>
                  <input
                    type="text" required name="employeeId" value={formData.employeeId} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="E.g. EMP-001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Phone Number *</label>
                  <input
                    type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="+91..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Email Address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="employee@school.com"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10"></div>

            {/* 2. Employment Details */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building size={18} className="text-purple-400" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Department *</label>
                  <select
                    name="department" required value={formData.department} onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Administration">Administration</option>
                    <option value="Transport">Transport</option>
                    <option value="Support Staff">Support Staff</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Designation *</label>
                  <input
                    type="text" required name="designation" value={formData.designation} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                    placeholder="E.g. Senior Math Teacher"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-sm ml-1">Joining Date *</label>
                  <input
                    type="date" required name="joiningDate" value={formData.joiningDate} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 [color-scheme:dark]"
                  />
                </div>
                {isEditing && (
                  <div className="space-y-2">
                    <label className="text-white/60 text-sm ml-1">Status</label>
                    <select
                      name="status" value={formData.status} onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="Active">Active</option>
                      <option value="Left">Left</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

             <div className="w-full h-px bg-white/10"></div>

            {/* 3. Salary Structure */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <IndianRupee size={18} className="text-green-400" />
                Salary Structure (Monthly)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-white/60 text-sm ml-1">Base Salary *</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input
                      type="number" required name="salary_baseSalary" value={formData.salaryStructure.baseSalary} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-green-500/50"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <label className="text-white/60 text-sm ml-1">Allowances</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input
                      type="number" name="salary_allowances" value={formData.salaryStructure.allowances} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-green-500/50"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <label className="text-white/60 text-sm ml-1">Deductions</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input
                      type="number" name="salary_deductions" value={formData.salaryStructure.deductions} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-green-500/50"
                      placeholder="0"
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/10 bg-white/5 flex gap-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="staff-form"
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2"
          >
            <Save size={18} />
            {isEditing ? "Update Staff" : "Add Staff"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;
