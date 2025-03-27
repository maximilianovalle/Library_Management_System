import React, { useState, useEffect } from "react";
import axios from "axios";  // used for making HTTP requests
import './Account.css';
import HeaderAfter from '../../components/header/HeaderAfter';
// The (React) frontend sends a GET, POST, DELETE, etc. request to the (NodeJS) backend. The backend server.js file processes the request and returns a response that is then displayed on the frontend.



const Account = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [fineAmntDue, setFineAmnt] = useState("");
    const [pastBooksArray, setPastBooks] = useState("");
    const [pastDevicesArray, setPastDevices] = useState("");

    // triggered once when the page loads
    useEffect(() => {
        const fetchName = async () => {

            try {
                const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

                // if ( no token )
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                // sends a GET request to /account including token
                const res = await axios.get(`${process.env.BACKEND_URL}/account`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                // receive JSON from account.js
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setEmail(res.data.email);
                setCreatedAt(new Date(res.data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }));    // saves date as January 1, 2025 instead of 2025-01-01
                setFineAmnt(res.data.fineAmntDue);
                setPastBooks(res.data.pastBooksArray);
                setPastDevices(res.data.pastDevicesArray);

            } catch (error) {
                console.error("Error fetching account data:", error);
            }

        }

        fetchName();    // need to explicitly call fetchName to run
    }, []);

    return( // HTML -----

        <div id="body">

            {/* header code credit to @ alan "atonyit" */}

            <HeaderAfter />

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

                    {/* past books */}
                    <h2>Past Books</h2>

                    {pastBooksArray.length > 0 ? (  // if user has past checked out books
                        <ul id="pastBooksList">
                            {pastBooksArray.map((book, i) => (
                                <li key={i}>
                                    <strong>{book.title}</strong>, {book.author} <br />
                                    {book.checkoutDate} - {book.returnedDate}
                                    <p></p>
                                </li>
                            ))}
                        </ul>
                    ) : (   // if user has no past checked out books
                        <p>No books to display! Try returning a checked out book...</p>
                    )
                    }

                    {/* past devices */}
                    <h2>Past Devices</h2>

                    {pastBooksArray.length > 0 ? (  // if user has past checked out devices
                        <ul id="pastDevicesList">
                            {pastDevicesArray.map((device, i) => (
                                <li key={i}>
                                    <strong>{device.model}</strong>, {device.category} <br />
                                    {device.checkoutDate} - {device.returnedDate}
                                    <p></p>
                                </li>
                            ))}
                        </ul>
                    ) : (   // if user has no past checked out books
                        <p>No devices to show! Try returning a checked out device...</p>
                    )
                    }

                </div>

            </div>

        </div>

    );
}

export default Account