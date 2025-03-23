import React, { useState, useEffect, use } from "react";
import axios from "axios";  // used for making HTTP requests
import './Account.css';

// The (React) frontend sends a GET, POST, DELETE, etc. request to the (NodeJS) backend. The backend server.js file processes the request and returns a response that is then displayed on the frontend.

const Account = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [fineAmntDue, setFineAmnt] = useState("");

    const [error, setError] = useState("");

    // triggered once when the page loads
    useEffect(() => {
        const fetchName = async () => {

            try {
                const res = await axios.get("http://localhost:8000/account");   // sends a GET request to /account

                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setEmail(res.data.email);
                setCreatedAt(new Date(res.data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }));    // saves date as January 1, 2025 instead of 2025-01-01
                setFineAmnt(res.data.fineAmntDue);

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

                {/* {userName && <h1>{userName}</h1>} */}

                {/* user info */}
                <div id="userInfo">

                    <div>
                        {lastName && firstName && <h1>{lastName}, {firstName}</h1>}
                        {email && <p>{email}</p>}
                    </div>

                    {createdAt && <p id="dateJoined">Joined {createdAt}</p>}
                    <h2 id="finesDue">Fines Due</h2>
                    <p id="amountDue">-${fineAmntDue}</p>

                </div>

                {/* recent activity */}
                <div id="recentActivity">

                    <h1>Recent Activity</h1>



                </div>

            </div>

        </div>

    );
}

export default Account