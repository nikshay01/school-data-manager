import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../App.css";
import Button from "./button";

export default function EditProfile() {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Schools
        const schoolsRes = await fetch("http://localhost:5000/api/schools");
        if (schoolsRes.ok) {
          setSchools(await schoolsRes.json());
        }

        // Fetch User Data
        const email = localStorage.getItem("email");
        if (email) {
          const usersRes = await fetch("http://localhost:5000/api/auth/users");
          if (usersRes.ok) {
            const users = await usersRes.json();
            const currentUser = users.find((u) => u.email === email);
            if (currentUser) {
              setForm({
                username: currentUser.username || "",
                school: currentUser.school?._id || currentUser.school || "",
                role: currentUser.position || "",
                aadhar: currentUser.aadhar || "",
                fullName: currentUser.name || "",
                address: currentUser.address || "",
                gender: currentUser.gender || "",
                phone: currentUser.contact || "",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    if (!validateForm()) return;

    const email = localStorage.getItem("email");
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
        alert(data.error || "Failed to update profile");
      } else {
        alert("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      <form
        className="flex scale-[0.75] flex-col items-center w-[900px] h-fit py-6 border border-white/30 rounded-[48px] shadow-[3px_3px_200px_rgba(0,0,0,0.35)] bg-black/10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white font-irish-grover text-center text-[36px] tracking-wide mb-3">
          EDIT PROFILE
        </h1>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-[750px] mt-2 mb-6">
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

        <div className="flex gap-4">
          <Button title="UPDATE PROFILE" type="submit" />
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-xl text-white font-bold hover:bg-red-500/30 transition-all"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
