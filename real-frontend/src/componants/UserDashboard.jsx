import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import "../App.css";

export default function UserDashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full pt-24 pb-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        DASHBOARD
      </h1>

      <div className="grid grid-cols-2 gap-6 w-[90%] max-w-[1000px]">
        <Link to="/students">
          <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer h-[200px] flex flex-col justify-center items-center">
            <h2 className="text-white text-3xl font-bold mb-2">STUDENTS</h2>
            <p className="text-white/60">Manage student records</p>
          </div>
        </Link>

        <Link to="/fees">
          <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer h-[200px] flex flex-col justify-center items-center">
            <h2 className="text-white text-3xl font-bold mb-2">FEES</h2>
            <p className="text-white/60">Track fee payments</p>
          </div>
        </Link>

        <Link to="/profile">
          <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer h-[200px] flex flex-col justify-center items-center">
            <h2 className="text-white text-3xl font-bold mb-2">PROFILE</h2>
            <p className="text-white/60">View and edit your profile</p>
          </div>
        </Link>

        <Link to="/reports">
          <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer h-[200px] flex flex-col justify-center items-center">
            <h2 className="text-white text-3xl font-bold mb-2">REPORTS</h2>
            <p className="text-white/60">Generate reports</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
