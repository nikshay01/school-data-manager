import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, IndianRupee, Clock, Filter } from "lucide-react";
import api from "../../api/axios";
import "../../index.css";
import "../../App.css";

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/reports/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dash stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col w-full h-full pt-8 px-10 relative overflow-y-auto custom-scrollbar items-center">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8 uppercase">
        DASHBOARD
      </h1>

      {loading ? (
        <div className="text-white/50 animate-pulse">Loading dashboard...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-[1200px] mb-8">
          <Link to="/students" className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all cursor-pointer">
            <div className="p-3 bg-blue-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Users className="text-blue-400" size={24} />
            </div>
            <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Total Students</h3>
            <p className="text-white text-2xl font-bold">{stats.totalStudents}</p>
          </Link>

          <Link to="/fees" className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all cursor-pointer">
            <div className="p-3 bg-green-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <IndianRupee className="text-green-400" size={24} />
            </div>
            <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Total Collected</h3>
            <p className="text-white text-2xl font-bold text-green-400">₹ {stats.totalCollected.toLocaleString()}</p>
          </Link>

          <Link to="/fees" className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all cursor-pointer">
            <div className="p-3 bg-red-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Clock className="text-red-400" size={24} />
            </div>
            <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Total Due</h3>
            <p className="text-white text-2xl font-bold text-red-400">₹ {stats.totalDue.toLocaleString()}</p>
          </Link>

          <Link to="/fees" className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center group hover:bg-white/10 transition-all cursor-pointer">
            <div className="p-3 bg-yellow-500/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Filter className="text-yellow-400" size={24} />
            </div>
            <h3 className="text-white/60 text-sm uppercase tracking-widest mb-1">Defaulters</h3>
            <p className="text-white text-2xl font-bold text-yellow-400">{stats.zeroPaidCount}</p>
          </Link>
        </div>
      ) : (
        <div className="text-white/50">Error loading stats.</div>
      )}
    </div>
  );
}
