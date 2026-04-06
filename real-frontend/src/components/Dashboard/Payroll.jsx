import React, { useState, useEffect, useMemo } from "react";
import { IndianRupee, Search, CheckCircle, Clock, Save, FileText } from "lucide-react";
import api from "../../api/axios";
import "../../index.css";
import "../../App.css";

const Payroll = () => {
  const [staffList, setStaffList] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const [activeProcessStaff, setActiveProcessStaff] = useState(null);
  const [processForm, setProcessForm] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    paymentMethod: "Bank Transfer",
    referenceNumber: ""
  });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, payrollRes] = await Promise.all([
        api.get("/staff"),
        api.get(`/staff/payroll?month=${selectedMonth}`)
      ]);
      setStaffList(staffRes.data);
      setPayrollHistory(payrollRes.data);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      showNotification("Failed to load payroll data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openProcessModal = (staff) => {
    setActiveProcessStaff(staff);
    setProcessForm({
      baseSalary: staff.salaryStructure?.baseSalary || 0,
      allowances: staff.salaryStructure?.allowances || 0,
      deductions: staff.salaryStructure?.deductions || 0,
      paymentMethod: "Bank Transfer",
      referenceNumber: ""
    });
  };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff/payroll", {
        staffId: activeProcessStaff._id,
        month: selectedMonth,
        ...processForm
      });
      showNotification(`Salary processed for ${activeProcessStaff.name}`);
      setActiveProcessStaff(null);
      fetchData(); // Refresh history
    } catch (err) {
      console.error("Error processing payroll:", err);
      const msg = err.response?.data?.message || "Failed to process payroll";
      showNotification(msg, "error");
    }
  };

  const payrollMap = useMemo(() => {
    const map = {};
    payrollHistory.forEach(p => {
      map[p.staffId._id || p.staffId] = p; // Populated or string
    });
    return map;
  }, [payrollHistory]);

  const stats = useMemo(() => {
    let totalPaid = 0;
    let pendingCount = 0;
    let paidCount = 0;

    staffList.forEach(s => {
      const isPaid = payrollMap[s._id];
      if (isPaid) {
        paidCount++;
        totalPaid += isPaid.netPaid;
      } else {
        pendingCount++;
      }
    });

    return { totalPaid, pendingCount, paidCount };
  }, [staffList, payrollMap]);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffList, searchTerm]);

  return (
    <div className="w-full h-full flex flex-col pt-8 px-10 relative overflow-y-auto custom-scrollbar">
      {notification && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${notification.type === "success" ? "bg-green-500/20 border-green-500/50 text-green-200" : "bg-red-500/20 border-red-500/50 text-red-200"}`}>
          {notification.message}
        </div>
      )}

      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase text-center">
        PAYROLL PROCESSING
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px] mb-8 mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
           <div className="p-3 bg-green-500/20 rounded-full mb-3">
             <IndianRupee className="text-green-400" size={24} />
           </div>
           <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Total Paid ({selectedMonth})</h3>
           <p className="text-green-400 text-3xl font-bold font-mono">₹ {stats.totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
           <div className="p-3 bg-blue-500/20 rounded-full mb-3">
             <CheckCircle className="text-blue-400" size={24} />
           </div>
           <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Staff Paid</h3>
           <p className="text-white text-3xl font-bold">{stats.paidCount} / {staffList.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
           <div className="p-3 bg-red-500/20 rounded-full mb-3">
             <Clock className="text-red-400" size={24} />
           </div>
           <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Pending Processing</h3>
           <p className="text-red-400 text-3xl font-bold">{stats.pendingCount}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1200px] mx-auto bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
             <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 [color-scheme:dark]" />
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input type="text" placeholder="Search staff..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 w-64" />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse relative">
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest">Employee</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">Base Salary</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">Status</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-right">Net Paid</th>
                <th className="p-4 text-white/40 uppercase text-xs tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-white/40 animate-pulse">Loading payroll data...</td></tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map(staff => {
                  const isPaid = payrollMap[staff._id];
                  return (
                    <tr key={staff._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{staff.name}</p>
                        <p className="text-xs text-white/40">{staff.designation} ({staff.employeeId})</p>
                      </td>
                      <td className="p-4 text-right font-mono">₹ {(staff.salaryStructure?.baseSalary || 0).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        {isPaid 
                          ? <span className="text-green-400 bg-green-500/20 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">Paid</span>
                          : <span className="text-red-400 bg-red-500/20 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">Pending</span>
                        }
                      </td>
                      <td className="p-4 text-right font-mono text-green-400 font-bold">
                        {isPaid ? `₹ ${isPaid.netPaid.toLocaleString()}` : "—"}
                      </td>
                      <td className="p-4 text-center">
                        {isPaid ? (
                          <div className="text-white/50 text-xs flex flex-col items-center" title={`Paid on ${new Date(isPaid.paymentDate).toLocaleDateString()}`}>
                            <FileText size={16} className="mb-1 text-white/30" />
                            <span>Slip Generated</span>
                          </div>
                        ) : (
                          <button onClick={() => openProcessModal(staff)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                            Process Salary
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                 <tr><td colSpan="5" className="p-8 text-center text-white/40 italic">No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payroll Modal */}
      {activeProcessStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveProcessStaff(null)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Process Salary</h2>
            <p className="text-white/50 text-sm mb-6">Processing for {activeProcessStaff.name} ({selectedMonth})</p>
            
            <form onSubmit={handleProcessPayroll} className="space-y-4">
              <div className="flex justify-between items-center text-white/70">
                 <span>Base Salary</span>
                 <span className="font-mono">₹ {processForm.baseSalary}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-white/70">Allowances (+) ₹</label>
                <input type="number" value={processForm.allowances} onChange={(e) => setProcessForm({...processForm, allowances: e.target.value})} className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-right text-white focus:border-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-white/70">Deductions (-) ₹</label>
                <input type="number" value={processForm.deductions} onChange={(e) => setProcessForm({...processForm, deductions: e.target.value})} className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-right text-white focus:border-red-500" />
              </div>
              
              <div className="w-full h-px bg-white/10 my-4" />
              <div className="flex justify-between items-center text-xl font-bold text-green-400">
                <span>Net Payable</span>
                <span className="font-mono">₹ {(Number(processForm.baseSalary) + Number(processForm.allowances) - Number(processForm.deductions)).toLocaleString()}</span>
              </div>
              <div className="w-full h-px bg-white/10 my-4" />

              <div>
                <label className="block text-white/70 text-sm mb-1">Payment Method</label>
                <select value={processForm.paymentMethod} onChange={(e)=>setProcessForm({...processForm, paymentMethod: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>UPI</option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Reference No. (Optional)</label>
                <input type="text" value={processForm.referenceNumber} onChange={(e)=>setProcessForm({...processForm, referenceNumber: e.target.value})} placeholder="Txn ID or Cheque No" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setActiveProcessStaff(null)} className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-all font-bold">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-all flex items-center gap-2"><Save size={18}/> Disburse Salary</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
