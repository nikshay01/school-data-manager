import React, { useState } from "react";
import "./index.css";
import Login from "./componants/login";
import Bg from "./componants/bg";
import Signup from "./componants/signup";
import TopBar from "./componants/topBar";
import CompleteProfile from "./componants/completeProfile";
const App = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    const email = localStorage.getItem("email");
    setIsLoggedIn(!!email);
  }, []);

  return (
    <div>
      <TopBar />
      {isLoggedIn ? (
        <CompleteProfile />
      ) : isSignup ? (
        <Signup onSwitchToLogin={() => setIsSignup(false)} />
      ) : (
        <Login onSwitchToSignup={() => setIsSignup(true)} />
      )}
      <Bg />
    </div>
  );
};

export default App;
