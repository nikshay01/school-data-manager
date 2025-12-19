import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";

const MainLayout = ({ userRole }) => {
  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Sidebar - Fixed Position */}
      <Sidebar userRole={userRole} />

      {/* Main Content Area */}
      <div className="pl-[210px] mt-[93px] h-[calc(100vh-93px)] w-full overflow-y-auto">
        <div className="p-8 w-full min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
