import React from "react";

function button(props) {
  return (
    <button className="login-button" type="button">
      {props.title}
    </button>
  );
}

export default button;
