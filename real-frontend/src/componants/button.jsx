import React from "react";

function button(props) {
  return (
    <button className="login-button" type={props.type}>
      {props.title}
    </button>
  );
}

export default button;
