import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import "../../App.css";
import api from "../../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // If unauthorized, redirect to login (optional, or handle in UI)
        // window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="text-white text-center mt-20">Loading profile...</div>
    );
  if (!user)
    return <div className="text-white text-center mt-20">User not found.</div>;

  return (
    <div className="flex flex-col items-center w-full pb-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        MY PROFILE
      </h1>

      <div className="w-[90%] max-w-[800px] bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md relative">
        <Link to="/profile/edit" className="absolute top-8 right-8">
          <button className="px-6 py-2 bg-white/10 border border-white/30 rounded-xl text-white font-bold hover:bg-white/20 transition-all">
            EDIT
          </button>
        </Link>

        <div className="grid grid-cols-2 gap-y-6 text-white">
          <div>
            <label className="text-white/50 text-sm block mb-1">
              FULL NAME
            </label>
            <div className="text-xl font-bold">{user.name}</div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">USERNAME</label>
            <div className="text-xl font-bold">{user.username}</div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">EMAIL</label>
            <div className="text-xl font-bold">{user.email}</div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">ROLE</label>
            <div className="text-xl font-bold capitalize">{user.position}</div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">SCHOOL</label>
            <div className="text-xl font-bold">
              {user.school?.name || "N/A"}
            </div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">GENDER</label>
            <div className="text-xl font-bold capitalize">
              {user.gender || "N/A"}
            </div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">PHONE</label>
            <div className="text-xl font-bold">{user.contact || "N/A"}</div>
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-1">AADHAR</label>
            <div className="text-xl font-bold">{user.aadhar || "N/A"}</div>
          </div>
          <div className="col-span-2">
            <label className="text-white/50 text-sm block mb-1">ADDRESS</label>
            <div className="text-xl font-bold">{user.address || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
