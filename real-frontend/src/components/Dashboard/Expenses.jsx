import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, CheckCircle, IndianRupee, Trash2, Calendar, FileText, CreditCard } from "lucide-react";
import api from "../../api/axios";
import "../../index.css";
import "../../App.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "Utilities",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Bank Transfer",
    referenceNumber: ""
  });

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth, categoryFilter]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses?month=${selectedMonth}&category=${categoryFilter}`);
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showNotification("Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post("/expenses", formData);
      showNotification("Expense recorded safely");
      setIsModalOpen(false);
      
      // Reset
      setFormData({
        title: "", description: "", amount: "", category: "Utilities", 
        date: new Date().toISOString().split("T")[0], paymentMethod: "Bank Transfer", referenceNumber: ""
      });
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
      showNotification(err.response?.data?.message || "Failed to string expense", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense log?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      showNotification("Expense deleted");
      fetchExpenses();
    } catch (err) {
      showNotification("Failed to delete", "error");
    }
  };

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { total, count: expenses.length };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (exp.referenceNumber && exp.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [expenses, searchTerm]);

  return (
    <div className="w-full h-full flex flex-col pt-8 px-10 relative overflow-y-auto custom-scrollbar">
      {notification && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${notification.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-200" : "bg-red-500/20 border-red-500/50 text-red-200"}`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase text-center">
        EXPENSE MANAGEMENT
      </h1>

      <div className="w-full max-w-[1200px] mb-8 mx-auto bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
           <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 [color-scheme:dark]" />
             
             <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50">
               <option value="All">All Categories</option>
               <option value="Utilities">Utilities</option>
               <option value="Maintenance">Maintenance</option>
               <option value="Salaries">Salaries (Direct)</option>
               <option value="Setup">Setup/Infrastructure</option>
               <option value="Stationery">Stationery</option>
               <option value="Miscellaneous">Miscellaneous</option>
             </select>

             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" placeholder="Search title or Ref..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-red-500/50" />
             </div>
           </div>

           <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] shrink-0">
             <Plus size={20} /> Record Expense
           </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20 rounded-2xl p-6 flex justify-between items-center">
             <div>
                <h3 className="text-red-400 text-sm tracking-widest uppercase mb-1 font-bold">Total Expenses (Month)</h3>
                <p className="text-white text-3xl font-mono font-bold">₹ {stats.total.toLocaleString()}</p>
             </div>
             <div className="p-4 bg-red-500/20 rounded-full text-red-400"><IndianRupee size={32}/></div>
          </div>
          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center min-w-[200px]">
             <h3 className="text-white/40 text-sm tracking-widest uppercase mb-1">Records Found</h3>
             <p className="text-white text-2xl font-bold">{stats.count}</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse relative">
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest w-1/3">Detail</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">Category</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">Date</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">Amount</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-white/40 animate-pulse">Scanning ledgers...</td></tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map(exp => (
                  <tr key={exp._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-white">{exp.title}</p>
                      {exp.description && <p className="text-xs text-white/50 mt-1 line-clamp-1">{exp.description}</p>}
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-white/40">
                         <span className="flex items-center gap-1"><CreditCard size={10}/> {exp.paymentMethod}</span>
                         {exp.referenceNumber && <span>| Ref: {exp.referenceNumber}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-red-500/30 bg-red-500/10 text-red-300">
                         {exp.category}
                       </span>
                    </td>
                    <td className="p-4 text-center text-sm font-mono text-white/60">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right font-mono text-xl font-bold text-red-400">
                      ₹ {exp.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-white/20">
                      <button onClick={() => handleDelete(exp._id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors group-hover:opacity-100 opacity-0" title="Delete record">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr><td colSpan="5" className="p-10 text-center text-white/30 italic">No expenses matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
             <div className="p-6 bg-red-900/20 border-b border-red-500/20">
                <h2 className="text-xl font-bold text-red-200 flex items-center gap-2">
                   <IndianRupee size={20} />
                   Log New Expense
                </h2>
             </div>
             
             <form onSubmit={handleAddExpense} className="p-6 space-y-4">
               <div>
                 <label className="block text-white/60 text-sm mb-1 ml-1">Expense Title *</label>
                 <input type="text" required name="title" value={formData.title} onChange={handleChange} placeholder="E.g. Monthly Electricity Bill" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-white/60 text-sm mb-1 ml-1">Amount (₹) *</label>
                   <input type="number" required name="amount" value={formData.amount} onChange={handleChange} placeholder="0" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50" />
                 </div>
                 <div>
                   <label className="block text-white/60 text-sm mb-1 ml-1">Category *</label>
                   <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50">
                     <option>Utilities</option>
                     <option>Maintenance</option>
                     <option>Salaries</option>
                     <option>Setup</option>
                     <option>Stationery</option>
                     <option>Miscellaneous</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-white/60 text-sm mb-1 ml-1">Description</label>
                 <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 custom-scrollbar" placeholder="Optional details..."></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="block text-white/60 text-sm mb-1 ml-1">Date *</label>
                   <input type="date" required name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 [color-scheme:dark]" />
                 </div>
                 <div>
                   <label className="block text-white/60 text-sm mb-1 ml-1">Method</label>
                   <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50">
                     <option>Cash</option>
                     <option>Bank Transfer</option>
                     <option>Cheque</option>
                     <option>UPI</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-white/60 text-sm mb-1 ml-1">Reference No.</label>
                   <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50" placeholder="Optional" />
                 </div>
               </div>

               <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-white/70 hover:bg-white/10 transition-all font-bold">Cancel</button>
                 <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-8 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">Save Expense</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
