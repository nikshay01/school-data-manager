import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Logout from "../Auth/Logout";
import ProfileSummary from "./ProfileSummary";

function TopBar({ userData }) {
  return (
    <div className="fixed top-0 border-2 w-[100vw] h-[124px] bg-black bg-opacity-35">
      {/* Logout Button */}
      <div className="absolute right-10 top-10">
        <Logout />
      </div>
      <ProfileSummary userData={userData} />
    </div>
  );
}

export default TopBar;
