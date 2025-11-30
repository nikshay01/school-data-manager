import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./components/Auth/login";
import Bg from "./components/Common/bg";
import Signup from "./components/Auth/signup";
import TopBar from "./components/Common/topBar";
import CompleteProfile from "./components/Profile/completeProfile";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ManageUsers from "./components/Management/ManageUsers";
import ManageSchools from "./components/Management/ManageSchools";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile";
import UserDashboard from "./components/Dashboard/UserDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (email) {
        setIsLoggedIn(true);
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.position);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <TopBar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />}
          />

          {/* Protected Routes */}
          <Route
            path="/complete-profile"
            element={
              isLoggedIn ? <CompleteProfile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/edit"
            element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />}
          />

          {/* Admin Routes - Only accessible by admin */}
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                userRole === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/dashboard" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route path="users" element={<ManageUsers />} />
            <Route path="schools" element={<ManageSchools />} />
            <Route
              index
              element={
                <div className="text-white text-center text-xl">
                  Select an option above
                </div>
              }
            />
          </Route>

          {/* Default Redirect */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
          />
        </Routes>
        <Bg />
      </div>
    </BrowserRouter>
  );
};

export default App;
