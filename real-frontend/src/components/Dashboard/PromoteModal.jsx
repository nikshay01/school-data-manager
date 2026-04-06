import React, { useState, useEffect } from "react";
import { X, GraduationCap, ArrowRight, Save } from "lucide-react";
import api from "../../api/axios";

const PromoteModal = ({ isOpen, onClose, onPromoteComplete }) => {
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState("");
  const [nextClass, setNextClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      setCurrentClass("");
      setNextClass("");
      setError("");
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/students/classes/all");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentClass || !nextClass) {
      setError("Please specify both current and next class.");
      return;
    }
    if (currentClass === nextClass) {
      setError("Next class must be different from current class.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/students/promote", { currentClass, nextClass });
      onPromoteComplete(res.data.modifiedCount, currentClass, nextClass);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote students");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <GraduationCap className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Promote Class</h2>
              <p className="text-white/40 text-sm">Bulk upgrade students to new session</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && <div className="mb-4 bg-red-500/20 text-red-200 p-3 rounded-xl border border-red-500/30 text-sm">{error}</div>}
          
          <form id="promote-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              
               <div className="flex-1 space-y-2">
                 <label className="text-white/60 text-sm ml-1">Current Class</label>
                 <select 
                    value={currentClass} 
                    onChange={(e) => setCurrentClass(e.target.value)}
                    required
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                 >
                   <option value="" disabled>Select origin</option>
                   {classes.map(c => (
                     <option key={c} value={c}>{c}</option>
                   ))}
                 </select>
               </div>

               <div className="mt-6 text-white/30">
                  <ArrowRight size={24} />
               </div>

               <div className="flex-1 space-y-2">
                 <label className="text-white/60 text-sm ml-1">Promote To</label>
                 <input 
                    type="text" 
                    value={nextClass} 
                    onChange={(e) => setNextClass(e.target.value)}
                    required
                    placeholder="e.g. 6th"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500/50"
                 />
               </div>

            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl">
               <p className="text-yellow-200/80 text-sm">
                  ⚠️ This action will immediately move all students in <strong>{currentClass || "[Select Class]"}</strong> to <strong>{nextClass || "[Target]"}</strong>. Payment history is retained.
               </p>
            </div>
          </form>
        </div>

        <div className="px-8 py-4 border-t border-white/10 bg-white/5 flex gap-4 justify-end">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-bold">
            Cancel
          </button>
          <button type="submit" form="promote-form" disabled={loading} className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50">
            {loading ? "Promoting..." : "Confirm Promotion"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoteModal;
