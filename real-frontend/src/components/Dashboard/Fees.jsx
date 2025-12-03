import React, { useState } from "react";
import "../../index.css";
import "../../App.css";

export default function Fees() {
  // Placeholder data
  const [feeRecords] = useState([
    {
      id: 1,
      student: "John Doe",
      amount: "5000",
      status: "Paid",
      date: "2023-10-01",
    },
    {
      id: 2,
      student: "Jane Smith",
      amount: "5000",
      status: "Pending",
      date: "-",
    },
    {
      id: 3,
      student: "Alice Johnson",
      amount: "5000",
      status: "Paid",
      date: "2023-10-05",
    },
  ]);

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        FEES MANAGEMENT
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px] mb-8">
        <div className="bg-black/20 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
          <h3 className="text-white/60 text-lg mb-2">Total Collected</h3>
          <p className="text-white text-3xl font-bold text-green-400">
            ₹ 10,000
          </p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
          <h3 className="text-white/60 text-lg mb-2">Pending Fees</h3>
          <p className="text-white text-3xl font-bold text-red-400">₹ 5,000</p>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-[24px] p-6 backdrop-blur-md flex flex-col items-center">
          <h3 className="text-white/60 text-lg mb-2">Total Students</h3>
          <p className="text-white text-3xl font-bold">3</p>
        </div>
      </div>

      <div className="w-full max-w-[1200px] bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Recent Transactions</h2>
          <button className="px-6 py-2 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all">
            RECORD PAYMENT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-4">Student</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{record.student}</td>
                  <td className="p-4">₹ {record.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === "Paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4">{record.date}</td>
                  <td className="p-4">
                    <button className="text-white/60 hover:text-white font-bold text-sm">
                      VIEW
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
