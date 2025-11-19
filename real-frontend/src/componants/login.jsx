import React, { useState } from "react";
import "../App.css";
import Button from "../componants/button.jsx";

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
    <div className="login-body">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>LOGIN</h1>
        <div className="input-fields">
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
        <Button/>
      </form>
    </div>
  );
}

export default login;
