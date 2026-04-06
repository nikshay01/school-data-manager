import React, { useState } from "react";
import { Search, UserPlus, X } from "lucide-react";
import api from "../../api/axios";

export default function AssignUserModal({ isOpen, onClose, onAssignSuccess }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setNotification(null);
    try {
      const response = await api.get(`/auth/search-users?q=${searchQuery}`);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setNotification({ type: "error", message: "No users found." });
      }
    } catch (error) {
      console.error("Search failed:", error);
      setNotification({ type: "error", message: "Search failed." });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async (userId) => {
    try {
      await api.put(`/auth/users/${userId}/assign-school`);
      setNotification({ type: "success", message: "User successfully assigned!" });
      if (onAssignSuccess) onAssignSuccess();
      // Remove or mark the user visually as assigned
      setSearchResults(searchResults.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Assignment failed:", error);
      setNotification({ type: "error", message: error.response?.data?.message || "Failed to assign user." });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-center items-center backdrop-blur-sm bg-black/40">
      <div className="bg-black/60 border border-white/20 rounded-2xl w-full max-w-[600px] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
          <UserPlus size={24} className="text-blue-400" />
          Assign User to My School
        </h2>

        {notification && (
          <div className={`p-3 mb-4 rounded border ${notification.type === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}>
            {notification.message}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              placeholder="Search by Email, Username, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Find"}
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {searchResults.map((user) => (
            <div key={user._id} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl mb-2 hover:bg-white/10">
              <div>
                <p className="text-white font-bold">{user.name || user.username || "Unknown"}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
                {user.contact && <p className="text-white/60 text-xs text-blue-300">{user.contact}</p>}
                {user.school && <p className="text-xs text-yellow-500">Currently in: {user.school.name}</p>}
              </div>
              <button
                onClick={() => handleAssign(user._id)}
                className="px-4 py-2 bg-green-600/30 border border-green-500/50 text-green-300 font-bold rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
              >
                Assign
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
