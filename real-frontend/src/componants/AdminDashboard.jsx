import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../index.css";
import "../App.css";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full pt-24 pb-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        ADMIN DASHBOARD
      </h1>

      <div className="flex gap-6 mb-10 items-center">
        <Link to="/dashboard">
          <button className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-white font-bold hover:bg-red-500/30 transition-all">
            ← BACK
          </button>
        </Link>
        <Link to="/admin/users">
          <button className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all">
            MANAGE USERS
          </button>
        </Link>
        <Link to="/admin/schools">
          <button className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all">
            MANAGE SCHOOLS
          </button>
        </Link>
      </div>

      <div className="w-[90%] max-w-[1200px] bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm">
        <Outlet />
      </div>
    </div>
  );
}
