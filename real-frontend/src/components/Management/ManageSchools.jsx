import React, { useState, useEffect } from "react";
import "../../index.css";
import "../../App.css";

export default function ManageSchools() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({
    name: "",
    address: "",
    code: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/schools");
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewSchool({ ...newSchool, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchool),
      });
      if (response.ok) {
        const createdSchool = await response.json();
        setSchools([...schools, createdSchool]);
        setNewSchool({
          name: "",
          address: "",
          code: "",
          contactEmail: "",
          contactPhone: "",
        });
        alert("School added successfully!");
      } else {
        alert("Failed to add school");
      }
    } catch (error) {
      console.error("Error adding school:", error);
    }
  };

  if (loading)
    return <div className="text-white text-center">Loading schools...</div>;

  return (
    <div className="w-full">
      <h2 className="text-white text-2xl font-bold mb-6">School Management</h2>

      {/* Add School Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white/5 p-6 rounded-xl border border-white/10"
      >
        <h3 className="text-white text-lg font-bold mb-4">Add New School</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="input"
            placeholder="School Name"
            name="name"
            value={newSchool.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="School Code"
            name="code"
            value={newSchool.code}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="Address"
            name="address"
            value={newSchool.address}
            onChange={handleInputChange}
            required
          />
          <input
            className="input"
            placeholder="Contact Email"
            name="contactEmail"
            value={newSchool.contactEmail}
            onChange={handleInputChange}
          />
          <input
            className="input"
            placeholder="Contact Phone"
            name="contactPhone"
            value={newSchool.contactPhone}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
        >
          ADD SCHOOL
        </button>
      </form>

      {/* Schools List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="border-b border-white/20">
              <th className="p-4">Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Address</th>
              <th className="p-4">Contact</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr
                key={school._id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="p-4">{school.name}</td>
                <td className="p-4">{school.code}</td>
                <td className="p-4">{school.address}</td>
                <td className="p-4">
                  {school.contactEmail && <div>{school.contactEmail}</div>}
                  {school.contactPhone && <div>{school.contactPhone}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
