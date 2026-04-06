import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import "../../index.css";
import "../../App.css";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports/full");
        setData(response.data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-white animate-pulse pt-20 text-center">Loading reports API...</div>;
  }

  if (!data) {
    return <div className="text-red-400 text-center pt-20">Error loading reports. Check network.</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-10 relative overflow-y-auto">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase">
        REPORTS & ANALYTICS
      </h1>

      <div className="grid grid-cols-2 gap-8 w-full max-w-[1200px] pb-10">
        
        {/* Financial Chart */}
        <div className="col-span-2 bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md h-[400px]">
          <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-3">
            Financial Overview by Class
          </h2>
          {data.feeByClass && data.feeByClass.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data.feeByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="className" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#000000dd', border: '1px solid #ffffff20', borderRadius: '12px'}} />
                <Legend iconType="circle" />
                <Bar dataKey="collected" name="Collected Fee" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="due" name="Pending Fee" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-white/40 italic flex h-full items-center justify-center">No fee data available.</div>
          )}
        </div>

        {/* Attendance Chart */}
        <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md h-[400px]">
          <h2 className="text-white text-2xl font-bold mb-4">Attendance by Class</h2>
          {data.attendanceByClass && data.attendanceByClass.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data.attendanceByClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="className" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" domain={[0, 100]} fontSize={12} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#000000dd', border: '1px solid #ffffff20', borderRadius: '12px'}} />
                <Legend iconType="circle" />
                <Bar dataKey="attendanceRate" name="Attendance %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-white/40 italic flex h-full items-center justify-center">No attendance data available.</div>
          )}
        </div>

        {/* Overall Attendance Card */}
        <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
          <h2 className="text-white text-2xl font-bold mb-6 z-10">
            School Attendance Rate
          </h2>
          <div className="w-56 h-56 rounded-full border-[12px] border-blue-500/80 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform duration-500 z-10">
            <span className="text-white text-6xl font-bold">{data.attendanceOverivew || 0}%</span>
          </div>
          <p className="text-white/60 mt-8 text-center text-sm z-10">Average attendance<br/>across all registered modules</p>
        </div>

        {/* Financial Report */}
        <div className="col-span-2 bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Financial Summary</h2>
          </div>
          <div className="flex justify-around items-center h-full">
            <div className="text-center">
              <p className="text-white/60 mb-2">Income (Collected)</p>
              <p className="text-green-400 text-4xl font-bold">₹ {data.financialSummary?.income.toLocaleString()}</p>
            </div>
            <div className="w-[1px] h-[80px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-white/60 mb-2">Estimated Expenses</p>
              <p className="text-red-400 text-4xl font-bold">₹ {data.financialSummary?.expenses.toLocaleString()}</p>
            </div>
            <div className="w-[1px] h-[80px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-white/60 mb-2">Net Profit</p>
              <p className="text-blue-400 text-4xl font-bold">₹ {data.financialSummary?.netProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
