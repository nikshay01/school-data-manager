import React, { useState } from "react";
import "../App.css";
import Button from "../componants/button.jsx";
import "../index.css";

function Signup() {
  const [formValues, setFormValues] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Signup Form submitted:", formValues);
  };

  const handleSendOtp = () => {
    // TODO: Implement send OTP logic here
    alert("OTP sent to " + formValues.email);
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      <form
        className="flex flex-col items-center w-[440px] h-[460px] border border-white/40 rounded-[38px] shadow-[3px_3px_200px_rgba(0,0,0,0.41)] bg-black/10 backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-white font-irish-grover text-center text-[36px] pt-[26px] mb-2 tracking-wide">
          SIGN UP
        </h1>
        <div className="flex gap-[14px] flex-col justify-center items-center w-[350px] mt-5 mb-2">
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
              style={{ fontFamily: 'Montserrat', fontSize: 17, letterSpacing: 1 }}
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
            style={{ fontFamily: 'Montserrat', fontSize: 17, letterSpacing: 2 }}
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
            style={{ fontFamily: 'Montserrat', fontSize: 17 }}
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
            style={{ fontFamily: 'Montserrat', fontSize: 17 }}
          />
        </div>
        {/* BUTTONS: Main sign up, then subtle login below */}
        <div className="flex flex-col items-center justify-center w-full mt-2 gap-2">
          <div className="flex justify-center w-full">
            <Button title="Sign Up" />
          </div>
          <button
            type="button"
            className="text-white text-[16px] mt-2 font-caveat-brush underline hover:cursor-pointer mb-10"
            style={{ letterSpacing: "0.07em", fontWeight: 100 }}
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
