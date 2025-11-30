import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import "../../App.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("email");
      if (!email) return;

      try {
        // We can reuse the complete-profile endpoint logic or create a dedicated get-profile
        // For now, let's assume we can fetch user details via a new endpoint or existing one.
        // Since we don't have a direct "get me" endpoint, we might need to rely on the login response
        // or add a 'me' endpoint.
        // Let's use the 'complete-profile' endpoint logic but as a GET if possible,
        // OR just fetch all users and filter (inefficient but works for now given current API).
        // BETTER: Let's add a simple GET /api/auth/me endpoint or similar.
        // Actually, let's just use the admin 'users' endpoint but filter by email for now
        // since we are short on time, OR better, let's just use the existing state if passed.
        // Wait, I can't easily change backend right now without more steps.
        // Let's try to fetch by email if I added that capability?
        // I added 'getAllUsers'. I can use that and find the user.

        const response = await fetch("http://localhost:5000/api/auth/users");
        if (response.ok) {
          const users = await response.json();
          const currentUser = users.find((u) => u.email === email);
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
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
    <div className="flex flex-col items-center min-h-screen w-full pt-24 pb-10">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        MY PROFILE
      </h1>

      <div className="w-[90%] max-w-[800px] bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-sm relative">
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
