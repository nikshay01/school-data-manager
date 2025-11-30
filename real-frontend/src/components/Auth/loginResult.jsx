import React from "react";

function LoginResult({ status, message, onClose }) {
  return (
    <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="flex flex-col items-center w-[350px] p-6 bg-black/70 border border-white/30 rounded-[30px] shadow-lg">
        <h2 className="text-white font-irish-grover text-2xl mb-4">Status</h2>

        <p className="text-white text-lg mb-6 text-center">
          {status === "loading" && "Logging in..."}
          {status === "error" && (message || "Login failed.")}
          {status === "success" && "Login successful!"}
        </p>

        <button
          onClick={onClose}
          className="text-white underline font-caveat-brush text-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginResult;
