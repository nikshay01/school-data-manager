import React from "react";
import "../../index.css";
import "../../App.css";

export default function Reports() {
  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        REPORTS & ANALYTICS
      </h1>

      <div className="grid grid-cols-2 gap-8 w-full max-w-[1200px]">
        {/* Attendance Report */}
        <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md h-[300px] flex flex-col items-center justify-center">
          <h2 className="text-white text-2xl font-bold mb-4">
            Attendance Overview
          </h2>
          <div className="w-40 h-40 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">85%</span>
          </div>
          <p className="text-white/60 mt-4">Average Monthly Attendance</p>
        </div>

        {/* Performance Report */}
        <div className="bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md h-[300px] flex flex-col items-center justify-center">
          <h2 className="text-white text-2xl font-bold mb-4">
            Academic Performance
          </h2>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-green-500 w-[75%]"></div>
          </div>
          <div className="flex justify-between w-full px-10 text-white/60">
            <span>Class 9</span>
            <span>75% Avg</span>
          </div>
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4 mt-2">
            <div className="h-full bg-yellow-500 w-[82%]"></div>
          </div>
          <div className="flex justify-between w-full px-10 text-white/60">
            <span>Class 10</span>
            <span>82% Avg</span>
          </div>
        </div>

        {/* Financial Report */}
        <div className="col-span-2 bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-2xl font-bold">Financial Summary</h2>
            <select className="bg-black/30 border border-white/20 rounded px-4 py-2 text-white text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex justify-around items-center h-full">
            <div className="text-center">
              <p className="text-white/60 mb-2">Income</p>
              <p className="text-green-400 text-4xl font-bold">₹ 1.2L</p>
            </div>
            <div className="w-[1px] h-[80px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-white/60 mb-2">Expenses</p>
              <p className="text-red-400 text-4xl font-bold">₹ 45k</p>
            </div>
            <div className="w-[1px] h-[80px] bg-white/10"></div>
            <div className="text-center">
              <p className="text-white/60 mb-2">Net Profit</p>
              <p className="text-blue-400 text-4xl font-bold">₹ 75k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
