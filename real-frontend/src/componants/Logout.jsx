import React, { useState, useEffect } from "react";
import "../App.css";

function Logout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("email");
        setIsLoggedIn(!!email);
    }, []);

    const handleClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem("email");
        }
        window.location.reload();
    };

    return (
        <button
            onClick={handleClick}
            className="z-50 absolute top-5 right-5 text-white font-julius-sans-one uppercase text-sm hover:text-gray-300 transition-colors"
            style={{ letterSpacing: "0.1em" }}
        >
            {isLoggedIn ? "Logout" : "Login"}
        </button>
    );
}

export default Logout;
