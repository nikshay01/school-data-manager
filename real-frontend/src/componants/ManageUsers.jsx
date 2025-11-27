import React, { useState, useEffect } from "react";
import "../index.css";
import "../App.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
        alert("User deleted successfully");
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: newRole }),
        }
      );
      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, position: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (loading)
    return <div className="text-white text-center">Loading users...</div>;

  return (
    <div className="w-full">
      <h2 className="text-white text-2xl font-bold mb-6">User Management</h2>
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
                <td className="p-4">{user.name || user.username}</td>
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
    </div>
  );
}
