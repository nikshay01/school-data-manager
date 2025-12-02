import React, { useState, useEffect } from "react";
import "../../index.css";
import "../../App.css";
import Button from "../Common/button";

export default function CompleteProfile() {
  const [form, setForm] = useState({
    username: "",
    school: "",
    role: "",
    aadhar: "",
    fullName: "",
    address: "",
    gender: "",
    phone: "",
  });

  const [schools, setSchools] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/schools");
        if (response.ok) {
          const data = await response.json();
          setSchools(data);
        } else {
          console.error("Failed to fetch schools");
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const aadharRegex = /^\d{12}$/;
    const phoneRegex = /^\d{10}$/;

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (!usernameRegex.test(form.username))
      newErrors.username = "Only letters, numbers, and underscores allowed";
    else if (form.username.length < 3 || form.username.length > 30)
      newErrors.username = "Username must be 3-30 characters";

    if (!form.school) newErrors.school = "School is required";

    if (!form.role) newErrors.role = "Role is required";

    if (form.aadhar && !aadharRegex.test(form.aadhar))
      newErrors.aadhar = "Aadhar must be 12 digits";

    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";

    if (form.gender && !["male", "female", "other"].includes(form.gender))
      newErrors.gender = "Invalid gender selection";

    if (form.phone && !phoneRegex.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    if (!validateForm()) return;

    try {
      const apidata = {
        email: email,
        username: form.username,
        school: form.school,
        position: form.role,
        aadhar: form.aadhar,
        fullName: form.fullName,
        address: form.address,
        gender: form.gender,
        phone: form.phone,
      };

      const response = await fetch(
        "http://localhost:5000/api/auth/complete-profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apidata),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Server Error:", data.error);
        alert(data.error || "Failed to update profile");
      } else {
        console.log(data);
        alert("Profile submitted successfully!");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full py-10">
      <form
        className="flex scale-[0.75] flex-col items-center w-[900px] h-fit py-6 border border-white/30 rounded-[48px] shadow-[3px_3px_200px_rgba(0,0,0,0.35)] bg-black/10 backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        {/* HEADING */}
        <h1 className="text-white font-irish-grover text-center text-[36px] tracking-wide mb-3">
          COMPLETE PROFILE
        </h1>

        {/* 2 COLUMN GRID */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-[750px] mt-2 mb-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <input
              className={`input ${errors.username ? "border-red-500" : ""}`}
              placeholder="USERNAME"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && (
              <span className="text-red-500 text-xs ml-2">
                {errors.username}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <select
              className={`input text-white ${
                errors.school ? "border-red-500" : ""
              }`}
              name="school"
              value={form.school}
              onChange={handleChange}
            >
              <option value="" disabled className="text-black">
                SELECT SCHOOL
              </option>
              {schools.map((school) => (
                <option
                  key={school._id}
                  value={school._id}
                  className="text-black"
                >
                  {school.name} ({school.code})
                </option>
              ))}
            </select>
            {errors.school && (
              <span className="text-red-500 text-xs ml-2">{errors.school}</span>
            )}
          </div>

          <div className="flex flex-col">
            <select
              className={`input text-white ${
                errors.role ? "border-red-500" : ""
              }`}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="" disabled className="text-black">
                ROLE
              </option>
              <option className="text-black" value="teacher">
                Teacher
              </option>
              <option className="text-black" value="admin">
                Admin
              </option>
              <option className="text-black" value="clerk">
                Clerk
              </option>
              <option className="text-black" value="staff">
                Staff
              </option>
            </select>
            {errors.role && (
              <span className="text-red-500 text-xs ml-2">{errors.role}</span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              className={`input ${errors.aadhar ? "border-red-500" : ""}`}
              placeholder="AADHAR NUMBER"
              name="aadhar"
              value={form.aadhar}
              onChange={handleChange}
            />
            {errors.aadhar && (
              <span className="text-red-500 text-xs ml-2">{errors.aadhar}</span>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col">
            <input
              className={`input ${errors.fullName ? "border-red-500" : ""}`}
              placeholder="FULL NAME"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs ml-2">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              className="input"
              placeholder="ADDRESS"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <select
              className={`input text-white ${
                errors.gender ? "border-red-500" : ""
              }`}
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="" disabled className="text-black">
                GENDER
              </option>
              <option className="text-black" value="male">
                Male
              </option>
              <option className="text-black" value="female">
                Female
              </option>
              <option className="text-black" value="other">
                Other
              </option>
            </select>
            {errors.gender && (
              <span className="text-red-500 text-xs ml-2">{errors.gender}</span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              className={`input ${errors.phone ? "border-red-500" : ""}`}
              placeholder="PHONE NO."
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs ml-2">{errors.phone}</span>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button title="SEND ACCESS REQUEST" type="submit" />
      </form>
    </div>
  );
}
