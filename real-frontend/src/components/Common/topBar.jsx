import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Logout from "../Auth/Logout";
import ProfileSummary from "./ProfileSummary";

function TopBar({ userData }) {
  return (
    <div className="fixed top-0 w-[100vw] h-[93px] bg-black bg-opacity-30 backdrop-blur-xl  ">
      {/* Logout Button */}
      <div className="absolute right-10 top-10">
        <Logout />
      </div>
      <ProfileSummary userData={userData} />
    </div>
  );
}

export default TopBar;
