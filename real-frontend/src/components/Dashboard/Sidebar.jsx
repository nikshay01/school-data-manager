import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "DASHBOARD" },
    { path: "/students", label: "STUDENTS" },
    { path: "/fees", label: "FEES" },
    { path: "/profile", label: "PROFILE" },
    { path: "/reports", label: "REPORTS" },
  ];

  if (userRole === "admin") {
    menuItems.push({ path: "/admin", label: "ADMIN" });
  }

  return (
    <div className="fixed left-0 top-[124px] h-[calc(100vh-124px)] w-[280px] bg-black/30 backdrop-blur-md border-r border-white/10 flex flex-col py-8 px-4 overflow-y-auto z-40">
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`flex items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/20 border border-white/20 shadow-lg"
                    : "bg-transparent border border-transparent hover:bg-white/10"
                }`}
              >
                <span className="text-white font-bold tracking-wider jul text-xl">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
