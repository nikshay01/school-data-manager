import React, { useState } from "react";
import "../index.css";
import "../App.css";
import Button from "./button";

export default function CompleteProfile() {
  const [form, setForm] = useState({
    username: "",
    schoolId: "",
    role: "",
    aadhar: "",
    fullName: "",
    address: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
      const response = await fetch("http://localhost:5000/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          schoolId: form.schoolId,
          position: form.role,
          aadhar: form.aadhar,
          fullName: form.fullName,
          address: form.address,
          gender: form.gender,
          phone: form.phone
        }),
      });

      const data = await response.json();
      console.log(data);//error handeling
      // alert('check console my nigga')


      if (!response.ok) {
        console.error("err:");

      }
    } catch {
      console.log('error');

    }
    alert("Profile submitted!");
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      <form
        className="flex scale-[0.75] flex-col items-center w-[900px] h-fit py-6 border border-white/30 rounded-[48px] shadow-[3px_3px_200px_rgba(0,0,0,0.35)] bg-black/10"
        onSubmit={handleSubmit}
      >
        {/* HEADING */}
        <h1 className="text-white font-irish-grover text-center text-[36px] tracking-wide mb-3">
          COMPLETE PROFILE
        </h1>

        {/* 2 COLUMN GRID */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-[750px] mt-2 mb-6">
          {/* LEFT COLUMN */}
          <input
            className="input"
            placeholder="USERNAME"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <select
            className="input text-white"
            name="schoolId"
            value={form.schoolId}
            onChange={handleChange}
          >
            <option value="" disabled className="text-black">
              SCHOOL ID
            </option>
            <option className="text-black" value="101">
              101
            </option>
            <option className="text-black" value="102">
              102
            </option>
            <option className="text-black" value="103">
              103
            </option>
          </select>

          <select
            className="input text-white"
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
          </select>

          <input
            className="input"
            placeholder="AADHAR NUMBER"
            name="aadhar"
            value={form.aadhar}
            onChange={handleChange}
          />

          {/* RIGHT COLUMN */}
          <input
            className="input"
            placeholder="FULL NAME"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            className="input"
            placeholder="ADDRESS"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <select
            className="input text-white"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="" disabled className="text-black">
              GENDER
            </option>
            <option className="text-black" value={true}>
              Male
            </option>
            <option className="text-black" value={false}>
              Female
            </option>
          </select>

          <input
            className="input"
            placeholder="PHONE NO."
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <Button title="SEND ACCESS REQUEST" type="submit" />
      </form>
    </div>
  );
}
