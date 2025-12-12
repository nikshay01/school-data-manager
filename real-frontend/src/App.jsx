import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import TopBar from "./components/Common/topBar";
import CompleteProfile from "./components/Profile/completeProfile";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ManageUsers from "./components/Management/ManageUsers";
import ManageSchools from "./components/Management/ManageSchools";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile";
import UserDashboard from "./components/Dashboard/UserDashboard";
import Students from "./components/Dashboard/Students";
import Fees from "./components/Dashboard/Fees";
import Reports from "./components/Dashboard/Reports";
import MainLayout from "./components/Common/MainLayout";
import Bg from "./components/Common/bg.jsx";
import api from "./api/axios";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("email");
      if (email) {
        setIsLoggedIn(true);
        try {
          const response = await api.post("/auth/me", { email });
          if (response.status === 200) {
            setUserRole(response.data.position);
            setUserData(response.data);
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
      <div className="relative h-screen w-full overflow-hidden">
        <TopBar userData={userData} />
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
            element={
              isLoggedIn ? (
                <MainLayout userRole={userRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />

            {/* Placeholder routes for Sidebar links */}
            <Route path="/students" element={<Students />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/reports" element={<Reports />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                userRole === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/dashboard" />
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
          </Route>

          {/* Default Redirect */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
          />
        </Routes>
        <Bg />
        {/* <div className="fixed inset-0 w-full h-full z-[-1]"></div> */}
      </div>
    </BrowserRouter>
  );
};

export default App;
