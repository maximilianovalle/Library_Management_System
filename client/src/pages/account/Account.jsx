import React from "react";
import './Account.css';
import { useState } from 'react'; // allows us to track data or properties that need tracking in a function component

// The (React) frontend - this page! - sends a request to the (NodeJS) backend using "axios.post()"/"axios.get()"/etc. The backend processes the request and returns a response that is then displayed on the frontend.

// Ex: LoginPage.jsx (frontend) -> server.js (processes request and calls login() function) -> login.js

// GET request: display data when the database loads.

const Account = () => {

    // [current state, function that updates the state] = set to empty string
    // const [search, submitSearch] = useState("");
    // const [email, updateEmail] = useState(""); 

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

            </div>

        </div>

    );
}

export default Account