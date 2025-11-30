import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Button from "../Common/button.jsx";
import "../../index.css";
import SignupResult from "./signupResult";

function Signup() {
  const [formValues, setFormValues] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // NEW POPUP STATE
  const [result, setResult] = useState({ status: null, message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      setResult({
        status: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    setResult({ status: "loading", message: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ status: "error", message: data.error || "Signup failed" });
      } else {
        setResult({ status: "success", message: "Signup successful!" });
        localStorage.setItem("email", formValues.email);
        window.location.reload();

        // Clear fields after success
        setFormValues({
          email: "",
          otp: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch {
      setResult({ status: "error", message: "Network error during signup." });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    setResult({
      status: "success",
      message: "OTP sent to " + formValues.email,
    });
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      {/* OVERLAY ALWAYS ABOVE SIGNUP FORM */}
      {result.status && (
        <SignupResult
          status={result.status}
          message={result.message}
          onClose={() => setResult({ status: null, message: "" })}
        />
      )}

      {/* YOUR SIGNUP FORM — UNCHANGED */}
      <form
        className="flex flex-col items-center w-[440px] h-[460px] border border-white/39 rounded-[48.24px] shadow-[3px_3px_200px_rgba(0,0,0,0.418)] bg-black/6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white font-irish-grover text-center text-[36px] pt-[26px] mb-2 tracking-wide">
          SIGN UP
        </h1>

        <div className="flex gap-[14px] flex-col justify-center items-center w-[364px] mt-5 mb-2">
          <div className="relative w-full">
            <input
              type="email"
              className="input pr-[110px]"
              id="email"
              name="email"
              placeholder="E-MAIL"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <button
              type="button"
              className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white font-mono text-[15px] underline hover:opacity-80 px-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
              onClick={handleSendOtp}
            >
              SEND OTP
            </button>
          </div>

          <input
            type="text"
            className="input"
            id="otp"
            name="otp"
            placeholder="OTP"
            value={formValues.otp}
            onChange={handleChange}
            autoComplete="one-time-code"
          />

          <input
            type="password"
            className="input"
            id="password"
            name="password"
            placeholder="PASSWORD"
            value={formValues.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <input
            type="password"
            className="input"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="RE-ENTER PASSWORD"
            value={formValues.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full mt-2 gap-2">
          <Button title={loading ? "Signing Up..." : "Sign Up"} type="submit" />

          <Link
            to="/login"
            className="text-white text-[16px] font-caveat-brush underline hover:cursor-pointer mt-[-15px]"
            style={{ letterSpacing: "0.07em", fontWeight: 100 }}
          >
            LOGIN
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
