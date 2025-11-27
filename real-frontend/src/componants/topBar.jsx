import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Logout from "./Logout";

function TopBar() {
  return (
    <div className="absolute border-2 w-[100vw] h-[124px] bg-black bg-opacity-35">
      {/* Logout Button */}
      <div className="absolute right-10 top-10">
        <Logout />
      </div>
      <Link
        to="/profile"
        className="block h-[82px] w-[213px] mt-[20px] ml-[38px] border border-white/50 rounded-[30px] bg-gradient-to-t from-white/20 to-black/0 bg-clip-padding hover:bg-white/10 transition-all cursor-pointer"
      >
        {/* Avatar Icon */}
        <div className="h-[59px] w-[59px] ml-[13px] mt-[12px]">
          <svg
            width="59"
            height="59"
            viewBox="0 0 59 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="59"
              height="59"
              rx="29.5"
              fill="white"
              fillOpacity="0.1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M38.3504 23.6C38.3504 28.4877 34.3881 32.45 29.5004 32.45C24.6126 32.45 20.6504 28.4877 20.6504 23.6C20.6504 18.7123 24.6126 14.75 29.5004 14.75C34.3881 14.75 38.3504 18.7123 38.3504 23.6ZM35.4004 23.6C35.4004 26.8585 32.7588 29.5 29.5004 29.5C26.2419 29.5 23.6004 26.8585 23.6004 23.6C23.6004 20.3415 26.2419 17.7 29.5004 17.7C32.7588 17.7 35.4004 20.3415 35.4004 23.6Z"
              fill="white"
            />
            <path
              d="M29.5004 36.875C19.9506 36.875 11.814 42.5219 8.7146 50.4333C9.46964 51.183 10.265 51.8922 11.0972 52.5573C13.4052 45.2938 20.6455 39.825 29.5004 39.825C38.3552 39.825 45.5955 45.2939 47.9035 52.5573C48.7357 51.8922 49.5311 51.183 50.2861 50.4333C47.1867 42.5219 39.0501 36.875 29.5004 36.875Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="ml-[75px] h-[51px] w-[140px] mt-[-59px]">
          <p className="uppercase jul">Disha academy</p>
          <p className="uppercase jul">hemant sharma</p>
          <p className="uppercase jul">com. op</p>
        </div>
      </Link>
    </div>
  );
}

export default TopBar;
