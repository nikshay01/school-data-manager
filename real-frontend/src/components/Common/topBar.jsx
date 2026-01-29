import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Logout from "../Auth/Logout";
import ProfileSummary from "./ProfileSummary";

function TopBar({ userData }) {
  return (
    <div className="fixed top-0 w-[100vw] h-[93px] bg-black bg-opacity-30 backdrop-blur-xl flex items-center justify-between px-8">
      <ProfileSummary userData={userData} />
      {/* Logout Button */}
      <div className="flex items-center">
        <Logout />
      </div>
    </div>
  );
}

export default TopBar;
