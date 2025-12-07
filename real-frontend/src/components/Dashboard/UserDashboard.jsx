import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import "../../App.css";

export default function UserDashboard() {
  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-white font-irish-grover text-[48px] tracking-wide mb-8">
        DASHBOARD
      </h1>

      <div className="glass-surface bg-black/20 border border-white/10 rounded-[32px] p-8 backdrop-blur-md w-full h-full flex items-center justify-center">
        <p className="text-white/60 text-xl">
          Select an option from the sidebar to get started.
        </p>
      </div>
    </div>
  );
}
