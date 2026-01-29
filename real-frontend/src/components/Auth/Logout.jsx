import React, { useState, useEffect } from "react";
import { LogOut, LogIn } from "lucide-react";
import "../../App.css";

function Logout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    }
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white font-julius-sans-one uppercase text-xs tracking-widest hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 group"
    >
      <span className="group-hover:translate-x-0.5 transition-transform duration-300">
        {isLoggedIn ? <LogOut size={16} /> : <LogIn size={16} />}
      </span>
      <span>{isLoggedIn ? "Logout" : "Login"}</span>
    </button>
  );
}

export default Logout;
