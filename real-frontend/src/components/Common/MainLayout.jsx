import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Sidebar - Fixed Position */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="pl-[280px] pt-[124px] min-h-screen w-full">
        <div className="p-8 w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
