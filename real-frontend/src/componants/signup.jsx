import React, { useState } from "react";
import "../App.css";
import Button from "../componants/button.jsx";
import "../index.css";

function Signup({ onSwitchToLogin }) {
  const [formValues, setFormValues] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Signup failed");
      } else {
        alert("Signup successful! Please log in.");
        setFormValues({ email: "", otp: "", password: "", confirmPassword: "" });
        if (onSwitchToLogin) onSwitchToLogin();
      }
    } catch {
      alert("Network error during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    alert("OTP sent to " + formValues.email);
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      <form
        className="flex flex-col items-center w-[440px] h-[460px] border border-white/39 rounded-[48.24px] shadow-[3px_3px_200px_rgba(0,0,0,0.418)] bg-black/6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white font-irish-grover text-center text-[36px] pt-[26px] mb-2 tracking-wide">SIGN UP</h1>
        <div className="flex gap-[14px] flex-col justify-center items-center w-[364px] mt-5 mb-2">
          {/* EMAIL + OTP ROW */}
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
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              onClick={handleSendOtp}
            >
              SEND OTP
            </button>
          </div>
          {/* OTP INPUT FIELD */}
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
          {/* PASSWORD */}
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
          {/* RE-ENTER PASSWORD */}
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
        {/* BUTTONS: Main sign up, then subtle login below */}
        <div className="flex flex-col items-center justify-center w-full mt-2 gap-2">
          <Button title={loading ? "Signing Up..." : "Sign Up"} typeo='submit' />
          {onSwitchToLogin && (
            <button
              type="button"
              className="text-white text-[16px] font-caveat-brush underline hover:cursor-pointer mt-[-15px]"
              style={{ letterSpacing: "0.07em", fontWeight: 100 }}
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              LOGIN
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Signup;
