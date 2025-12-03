import React, { useState } from "react";
import "../../index.css";
import "../../App.css";

export default function Students() {
  // Placeholder data
  const [students] = useState([
    {
      id: 1,
      name: "John Doe",
      class: "10th",
      rollNo: "101",
      contact: "1234567890",
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "10th",
      rollNo: "102",
      contact: "9876543210",
    },
    {
      id: 3,
      name: "Alice Johnson",
      class: "9th",
      rollNo: "901",
      contact: "5555555555",
    },
  ]);

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 px-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        STUDENTS
      </h1>

      <div className="w-full max-w-[1200px] bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">Student List</h2>
          <button className="px-6 py-2 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all">
            ADD STUDENT
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-white border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-4">Name</th>
                <th className="p-4">Class</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">{student.class}</td>
                  <td className="p-4">{student.rollNo}</td>
                  <td className="p-4">{student.contact}</td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 font-bold text-sm mr-4">
                      EDIT
                    </button>
                    <button className="text-red-400 hover:text-red-300 font-bold text-sm">
                      DELETE
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
