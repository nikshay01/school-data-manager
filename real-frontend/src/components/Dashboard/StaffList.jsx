import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, User, Briefcase, Mail, Phone, Edit, Building, Settings } from "lucide-react";
import api from "../../api/axios";
import StaffModal from "./StaffModal";
import "../../index.css";
import "../../App.css";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  
  const [activeModal, setActiveModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get("/staff");
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      showNotification("Failed to load staff list", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveStaff = async (formData) => {
    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff._id}`, formData);
        showNotification("Staff updated successfully");
      } else {
        await api.post("/staff", formData);
        showNotification("Staff added successfully");
      }
      setActiveModal(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (err) {
      console.error("Error saving staff:", err);
      const msg = err.response?.data?.message || "Something went wrong";
      showNotification(msg, "error");
    }
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setActiveModal(true);
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setActiveModal(true);
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === "All" || s.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [staffList, searchTerm, departmentFilter]);

  if (loading && staffList.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pt-8 px-10 relative overflow-y-auto custom-scrollbar">
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

      {/* Header */}
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase text-center">
        STAFF MANAGEMENT
      </h1>

      <div className="w-full max-w-[1200px] mb-8 mx-auto bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-80">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search staff Name or EMP ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-sans"
              />
            </div>
            
            {/* Filter */}
             <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-black/30 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Departments</option>
              <option value="Teaching">Teaching</option>
              <option value="Administration">Administration</option>
              <option value="Transport">Transport</option>
              <option value="Support Staff">Support Staff</option>
              <option value="Management">Management</option>
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0"
          >
            <Plus size={20} />
            Add Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest font-bold">Employee</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest font-bold">Contact</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest font-bold">Role</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest font-bold">Status</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{staff.name}</p>
                          <p className="text-xs text-white/40">{staff.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col gap-1 text-sm text-white/70">
                          <span className="flex items-center gap-2"><Phone size={12}/> {staff.phone}</span>
                          {staff.email && <span className="flex items-center gap-2"><Mail size={12}/> {staff.email}</span>}
                       </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm">{staff.designation}</span>
                        <span className="text-xs text-purple-400 flex items-center gap-1">
                           <Building size={10} /> {staff.department}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        staff.status === "Active" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center items-center gap-2">
                       <button
                          onClick={() => openEditModal(staff)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all shadow-sm group-hover:opacity-100"
                          title="Edit Staff"
                        >
                          <Edit size={16} />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-white/30 italic">
                    No staff members found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <StaffModal 
        isOpen={activeModal} 
        onClose={() => setActiveModal(false)} 
        staff={editingStaff} 
        onSave={handleSaveStaff} 
      />

    </div>
  );
};

export default StaffList;
