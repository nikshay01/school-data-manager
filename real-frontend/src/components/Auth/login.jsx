import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Button from "../Common/button.jsx";
import "../../index.css";
import LoginResult from "./loginResult";

function Login() {
  const [formValues, setFormValues] = useState({
    userId: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // NEW: control the result popup
  const [result, setResult] = useState({ status: null, message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // show loading popup
    setResult({ status: "loading", message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ status: "error", message: data.error });
      } else {
        setResult({ status: "success", message: "Login successful!" });
        localStorage.setItem("email", formValues.email);
        window.location.reload();
      }
    } catch {
      setResult({
        status: "error",
        message: "Network error during login.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      {/* ALWAYS RENDERS ABOVE THE LOGIN PAGE */}
      {result.status && (
        <LoginResult
          status={result.status}
          message={result.message}
          onClose={() => setResult({ status: null, message: "" })}
        />
      )}

      {/* YOUR ORIGINAL EXACT LOGIN UI — UNTOUCHED */}
      <form
        className="flex flex-col items-center w-[456.52px] h-[429.05px] border border-white/39 rounded-[48.24px] shadow-[3px_3px_200px_rgba(0,0,0,0.418)] bg-black/6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white font-irish-grover text-center text-[38.74px] pt-[25px]">
          LOGIN
        </h1>

        <div className="flex gap-[30px] flex-col justify-center items-center h-[325.38px] w-[364.01px] relative">
          <input
            type="text"
            className="input"
            id="userId"
            name="userId"
            placeholder="User ID"
            value={formValues.userId}
            onChange={handleChange}
          />
          <input
            type="email"
            className="input"
            id="email"
            name="email"
            placeholder="Email ID"
            value={formValues.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="input"
            id="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button title={loading ? "Logging in..." : "Login"} type="submit" />

        <Link
          to="/signup"
          className="font-caveat-brush font-thin underline mb-5 text-lg text-white hover:cursor-pointer"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          Sign up
        </Link>
      </form>
    </div>
  );
}

export default Login;
