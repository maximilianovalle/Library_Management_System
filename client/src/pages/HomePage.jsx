import React, { useEffect, useState } from "react";
import Header from "../components/header/Header.jsx";
import HeaderAfter from "../components/header/HeaderAfter.jsx";

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in when component mounts
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Convert to boolean
    }, []);

    return(
        <div>
            {isLoggedIn ? <HeaderAfter /> : <Header />}
            <div className="welcome-content">
                <h1>Welcome to Cougar Public Library</h1>
                <p>Explore our collection of books and devices.</p>
                {!isLoggedIn && (
                    <div className="cta-section">
                        <p>Please log in to access your account and borrow items.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;