import React, { useState } from "react";
import "./index.css";
import Login from "./componants/login";
import Bg from "./componants/bg";
import Signup from "./componants/signup";

const App = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div>
      {isSignup ? (
        <Signup onSwitchToLogin={() => setIsSignup(false)} />
      ) : (
        <Login onSwitchToSignup={() => setIsSignup(true)} />
      )}
      <Bg />
    </div>
  );
};

export default App;
