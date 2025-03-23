import React, { useState, useEffect, use } from "react";
import axios from "axios";  // used for making HTTP requests
import './Account.css';

// The (React) frontend sends a GET, POST, DELETE, etc. request to the (NodeJS) backend. The backend server.js file processes the request and returns a response that is then displayed on the frontend.

const Account = () => {

    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");

    // triggered once when the page loads
    useEffect(() => {
        const fetchName = async () => {

            try {
                const res = await axios.get("http://localhost:8000/account");   // sends a GET request to /account
                setUserName(res.data.userName);
            } catch (error) {
                console.error("Error fetching account data:", error);
                setError("Failed to load account data.");
            }

        }

        fetchName();    // need to explicitly call fetchName to run it
    }, []);

    return( // HTML -----

        <div id="body">

            {/* header code credit to @ alan "atonyit" */}

            <header className="header">
                <div className="container">
                    <nav className="nav">
                        <div className="logo">
                            <a href="/">
                                <img src="/logo.png" alt="Logo" />
                            </a>
                            <h1>Cougar Public Library</h1>
                        </div>

                        <div className={`nav-links`}>
                            {["My Books", "Browse Books", "Browse Devices"].map((item) => (
                                <a key={item} href="/" className="link">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            {/* main content - my code ----- */}
            <div id="main">

                {userName && <h1>{userName}</h1>}

            </div>

        </div>

    );
}

export default Account