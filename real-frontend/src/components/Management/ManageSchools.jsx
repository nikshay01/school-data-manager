import React, { useState, useEffect } from "react";
import "../../index.css";
import "../../App.css";
import api from "../../api/axios";
import { Edit, Save, X } from "lucide-react";

export default function ManageSchools() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({
    name: "",
    address: "",
    code: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchSchools();
  }, []);

  // ... (imports)

  // ... (inside ManageSchools)
  const fetchSchools = async () => {
    try {
      const response = await api.get("/schools");
      if (response.status === 200) {
        setSchools(response.data);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewSchool({ ...newSchool, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/schools", newSchool);
      if (response.status === 201 || response.status === 200) {
        const createdSchool = response.data;
        setSchools([...schools, createdSchool]);
        setNewSchool({
          name: "",
          address: "",
          code: "",
          contactEmail: "",
          contactPhone: "",
        });
        alert("School added successfully!");
      } else {
        alert("Failed to add school");
      }
    } catch (error) {
      console.error("Error adding school:", error);
      alert(error.response?.data?.message || "Failed to add school");
    }
  };

  const handleEditClick = (school) => {
    setEditingSchoolId(school._id);
    setEditFormData({ ...school });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/schools/${editingSchoolId}`, editFormData);
      if (response.status === 200) {
        setSchools(schools.map(s => s._id === editingSchoolId ? response.data : s));
        setEditingSchoolId(null);
        // alert("School updated successfully!");
      }
    } catch (error) {
      console.error("Error updating school:", error);
      alert("Failed to update school");
    }
  };

  const handleCancelEdit = () => {
    setEditingSchoolId(null);
  };

  if (loading)
    return <div className="text-white text-center">Loading schools...</div>;

  return (
    <div className="w-full">
      <h2 className="text-white text-2xl font-bold mb-6">School Management</h2>

      {/* Add School Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white/5 p-6 rounded-xl border border-white/10"
      >
        <h3 className="text-white text-lg font-bold mb-4">Add New School</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="input"
            placeholder="School Name"
            name="name"
            value={newSchool.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="School Code"
            name="code"
            value={newSchool.code}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="Address"
            name="address"
            value={newSchool.address}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="Contact Email"
            name="contactEmail"
            value={newSchool.contactEmail}
            onChange={handleInputChange}
          />
          <input
            className="input"
            placeholder="Contact Phone"
            name="contactPhone"
            value={newSchool.contactPhone}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
        >
          ADD SCHOOL
        </button>
      </form>

      {/* Schools List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="border-b border-white/20 text-white/50 text-sm uppercase tracking-widest">
              <th className="p-4">Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Address</th>
              <th className="p-4">Contact</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr
                key={school._id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                {editingSchoolId === school._id ? (
                  <>
                    <td className="p-2">
                      <input className="input" name="name" value={editFormData.name} onChange={handleEditChange} />
                    </td>
                    <td className="p-2">
                      <input className="input" name="code" value={editFormData.code} onChange={handleEditChange} />
                    </td>
                    <td className="p-2">
                      <input className="input" name="address" value={editFormData.address} onChange={handleEditChange} />
                    </td>
                    <td className="p-2 flex flex-col gap-1">
                      <input className="input" name="contactEmail" value={editFormData.contactEmail || ""} onChange={handleEditChange} placeholder="Email" />
                      <input className="input" name="contactPhone" value={editFormData.contactPhone || ""} onChange={handleEditChange} placeholder="Phone" />
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSaveEdit} className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/40">
                          <Save size={16} />
                        </button>
                        <button onClick={handleCancelEdit} className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/40">
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-bold">{school.name}</td>
                    <td className="p-4 text-white/70">{school.code}</td>
                    <td className="p-4 text-white/70">{school.address}</td>
                    <td className="p-4 text-white/70">
                      {school.contactEmail && <div>{school.contactEmail}</div>}
                      {school.contactPhone && <div>{school.contactPhone}</div>}
                    </td>
                    <td className="p-4 flex justify-center">
                      <button
                        onClick={() => handleEditClick(school)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-blue-300 transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
