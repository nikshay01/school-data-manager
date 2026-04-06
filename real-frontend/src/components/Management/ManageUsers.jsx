import React, { useState, useEffect } from "react";
import "../../index.css";
import "../../App.css";
import api from "../../api/axios";
import AssignUserModal from "./AssignUserModal";
import { Plus } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ... (imports)

  // ... (inside ManageUsers)
  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await api.delete(`/auth/users/${id}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await api.put(`/auth/users/${id}`, {
        position: newRole,
      });
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, position: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  if (loading)
    return <div className="text-white text-center">Loading users...</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus size={20} />
          Assign User to My School
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">School</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="p-4">{user.name || user.username || user.email?.split("@")[0]}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.school?.name || "N/A"}</td>
                <td className="p-4">
                  <select
                    className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm"
                    value={user.position}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="clerk">Clerk</option>
                    <option value="staff">Staff</option>
                    <option value="principal">Principal</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 hover:text-red-300 font-bold text-sm"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign User Modal */}
      <AssignUserModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssignSuccess={() => fetchUsers()} 
      />
    </div>
  );
}
