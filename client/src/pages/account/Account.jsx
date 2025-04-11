import React, { useState, useEffect } from "react";
import axios from "axios";  // used for making HTTP requests
import './Account.css';
import HeaderAfter from '../../components/header/HeaderAfter';
import './CheckoutModal.css';
import { FaRegCheckCircle } from "react-icons/fa";


// The (React) frontend sends a GET, POST, DELETE, etc. request to the (NodeJS) backend. 
// The backend server.js file processes the request and returns a response that is then displayed on the frontend.

const Account = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [fineAmntDue, setFineAmnt] = useState("");
    const [pastBooksArray, setPastBooks] = useState([]);
    const [pastDevicesArray, setPastDevices] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

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
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/account`, {
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

    const payFines = async (event) => {
        try {
            const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            // sends a PUT request to /account including token
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/account`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // sends a GET request to /account including token
            const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/account`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            setFineAmnt(res2.data.fineAmntDue); // update fine amount
            alert(res.data.message);

        } catch (error) {
            console.log("Error paying fine: ", error);
        }
    };
    // opens checkout modal
    const openModal = () => setShowCheckout(true);

    // closes checkout modal
    const closeModal = () => setShowCheckout(false);

    return (
        <div>

            {/* header code credit to @ alan "atonyit" */}

            <HeaderAfter />

            {/* main content - my code ----- */}
            <div id="main">

                {/* user info */}
                <div id="userInfo">
                    <div id="userDesc">
                        {lastName && firstName && <h1>{lastName}, {firstName}</h1>}
                        {email && <p>{email}</p>}
                    </div>

                    {createdAt && <p id="dateJoined">Joined {createdAt}</p>}

                    <h2 id="finesDue">Fines Owed:</h2>
                    <p id="amountDue">-${fineAmntDue}</p>

                    <div id="buttonAlign">
                        <button id="payBtn" onClick={openModal}>Pay Now</button>
                    </div>
                </div>

                {/* recent activity */}
                <div id="recentActivity">
                    <h1>Recent Activity</h1>

                    {/* past books */}
                    <h2>Past Books</h2>
                    {pastBooksArray.length > 0 ? (
                        <ul id="pastBooksList">
                            {pastBooksArray.map((book, i) => (
                                <li key={i}>
                                    <strong>{book.title}</strong>, {book.author} <br />
                                    {book.checkoutDate} - {book.returnedDate}
                                    <p></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No books to display! Try returning a checked out book...</p>
                    )}

                    {/* past devices */}
                    <h2>Past Devices</h2>
                    {pastDevicesArray.length > 0 ? (
                        <ul id="pastDevicesList">
                            {pastDevicesArray.map((device, i) => (
                                <li key={i}>
                                    <strong>{device.model}</strong>, {device.category} <br />
                                    {device.checkoutDate} - {device.returnedDate}
                                    <p></p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No devices to show! Try returning a checked out device...</p>
                    )}
                </div>
            </div>

            {showCheckout && (
            <div
                className="checkout-modal-overlay"
                onClick={(e) => {
                if (e.target.classList.contains("checkout-modal-overlay")) {
                    closeModal();
                }
                }}
            >
                <div className="checkout-modal">
                <div className="icon">
                    <FaRegCheckCircle />
                </div>
                <div className="checkout-header">
                    <h2>Payment Successful!</h2>
                </div>
                <div className="checkout-body">
                    <p>
                    Thank you for paying your fine. Your payment of <strong>${fineAmntDue}</strong> has been processed successfully through your linked ShastaBucks account.
                    </p>
                    <p>
                    All related holds and restrictions have been removed. 
                    </p>
                    <p>
                    Please refer to a librarian with any questions or concerns.
                    </p>
                </div>
                </div>
            </div>
)}

        </div>
    );
};

export default Account;
