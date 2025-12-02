import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Login from "./components/Auth/login";
import GridMotion from "./components/Common/GridMotion";
import Signup from "./components/Auth/signup";
import TopBar from "./components/Common/topBar";
import CompleteProfile from "./components/Profile/completeProfile";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ManageUsers from "./components/Management/ManageUsers";
import ManageSchools from "./components/Management/ManageSchools";
import Profile from "./components/Profile/Profile";
import EditProfile from "./components/Profile/EditProfile";
import UserDashboard from "./components/Dashboard/UserDashboard";
import MainLayout from "./components/Common/MainLayout";

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
            element={isLoggedIn ? <MainLayout /> : <Navigate to="/login" />}
          >
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />

            {/* Placeholder routes for Sidebar links */}
            <Route
              path="/students"
              element={
                <div className="text-white p-8">
                  Students Page (Coming Soon)
                </div>
              }
            />
            <Route
              path="/fees"
              element={
                <div className="text-white p-8">Fees Page (Coming Soon)</div>
              }
            />
            <Route
              path="/reports"
              element={
                <div className="text-white p-8">Reports Page (Coming Soon)</div>
              }
            />

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
        <GridMotion
          items={[
            "Item 1",
            <div key="jsx-item-1">Custom JSX Content</div>,
            "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "Item 2",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "Item 4",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "Item 5",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "Item 7",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "Item 8",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "Item 10",
            <div key="jsx-item-3">Custom JSX Content</div>,
            "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "Item 11",
            <div key="jsx-item-2">Custom JSX Content</div>,
            "Item 13",
            <div key="jsx-item-4">Custom JSX Content</div>,
            "https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "Item 14",
          ]}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
