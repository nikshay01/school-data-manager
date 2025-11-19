import React, { useState } from "react";
import "../App.css";
import Button from "../componants/button.jsx";
import "../index.css"

function login() {
  const [formValues, setFormValues] = useState({
    userId: "",
    email: "",
    password: "",
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log("Form submitted:", formValues);
  };

  return (
    <div className="flex absolute justify-center items-center h-screen w-screen -mb-5">
      <form className="flex flex-col items-center w-[456.52px] h-[429.05px] border border-white/39 rounded-[48.24px] shadow-[3px_3px_200px_rgba(0,0,0,0.418)] bg-black/6" onSubmit={handleSubmit}>
        <h1 className="text-white font-irish-grover text-center text-[38.74px] pt-[25px]">LOGIN</h1>
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
          />
          <input
            type="password"
            className="input"
            id="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
          />
        </div>
        <Button title="Login"/>
        <h2 className="font-caveat-brush font-thin underline mb-5 text-lg text-white hover:cursor-pointer">sign up</h2>
      </form>
    </div>
  );
}

export default login;
