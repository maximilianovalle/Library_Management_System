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

    const [pastBooksArray, setPastBooks] = useState([]);
    const [pastDevicesArray, setPastDevices] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    const [fineAmntDue, setFineAmnt] = useState("");
    const [prevFineAmnt, setPrevFine] = useState("");

    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;

    const [currentBookPage, setCurrentBookPage] = useState(1);
    const [currentDevicePage, setCurrentDevicePage] = useState(1);


    // triggered once when the page loads
    useEffect(() => {
        const fetchName = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

                // if ( no token )
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                setTimeout(() => {
                    setLoading(false);
                }, 1000);

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
            } finally {
                setLoading(false);
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
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/account`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": `application/json`,
                },
            });

            // sends a GET request to /account including token
            const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/account`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            setPrevFine(res.data.amount_paid);

            setTimeout(() => {
                setFineAmnt(res2.data.fineAmntDue); // update fine amount
            }, 400);

        } catch (error) {
            console.log("Error paying fine: ", error);
        }
    };

    // opens checkout modal after brief timeout (for info loading purposes)
    const openModal = () => {
        setTimeout(() => {
            setShowCheckout(true);
        }, 400); // delay in milliseconds (1000ms = 1 second)
    };

    // closes checkout modal
    const closeModal = () => setShowCheckout(false);

    return (
        <div>

            {/* header code credit to @ alan "atonyit" */}

            <HeaderAfter />

            {/* main content - my code ----- */}
            <div id="main">
                
            {loading ? (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
            ) : (
            <>

                {/* user info */}
                <div id="userInfo">
                    <div id="userDesc">
                        {lastName && firstName && <h1>{lastName}, {firstName}</h1>}
                        {email && <p>{email}</p>}
                    </div>

                    {createdAt && <p id="dateJoined">Joined {createdAt}</p>}

                    <h2 id="finesDue">Fines Due:</h2>

                    {fineAmntDue > 0 ? (
                        <div>
                        <p id="amountDue">-${fineAmntDue}</p>
                        <div id="buttonAlign">
                        <button class="btn" onClick={() => {
                            openModal();
                            payFines();
                        }
                        }>Pay Now</button>
                        </div>
                        </div>
                    ) : (
                        <p id="noAmountDue">${fineAmntDue}</p>
                    )}

                </div>

                {/* recent activity */}
                <div id="recentActivity">
                    <h1>Recent Activity</h1>

                    {/* past books */}
                <h2>Past Books</h2>
                {pastBooksArray.length > 0 ? (
                    <>
                    <ul id="pastBooksList">
                        {pastBooksArray
                            .slice((currentBookPage - 1) * itemsPerPage, currentBookPage * itemsPerPage)
                            .map((book, i) => (
                                <li key={i}>
                                    <strong>{book.title}</strong>, {book.author} <br />
                                    {book.checkoutDate} - {book.returnedDate}
                                </li>
                            ))}
                    </ul>
                    <div className="pagination">
                        <button
                            disabled={currentBookPage === 1}
                            onClick={() => setCurrentBookPage(currentBookPage - 1)}
                        >
                            &#8592;
                        </button>
                        <span> {currentBookPage} of {Math.ceil(pastBooksArray.length / itemsPerPage)} </span>
                        <button
                            disabled={currentBookPage === Math.ceil(pastBooksArray.length / itemsPerPage)}
                            onClick={() => setCurrentBookPage(currentBookPage + 1)}
                        >
                            &#8594;
                        </button>
                    </div>
                    </>
                ) : (
                    <p>No books to display! Try returning a checked out book...</p>
                )}


                    {/* past devices */}
                    <h2>Past Devices</h2>
                    {pastDevicesArray.length > 0 ? (
                        <>
                        <ul id="pastDevicesList">
                            {pastDevicesArray
                                .slice((currentDevicePage - 1) * itemsPerPage, currentDevicePage * itemsPerPage)
                                .map((device, i) => (
                                    <li key={i}>
                                        <strong>{device.model}</strong>, {device.category} <br />
                                        {device.checkoutDate} - {device.returnedDate}
                                    </li>
                                ))}
                        </ul>
                        <div className="pagination">
                            <button
                                disabled={currentDevicePage === 1}
                                onClick={() => setCurrentDevicePage(currentDevicePage - 1)}
                            >
                                &#8592;
                            </button>
                            <span> {currentDevicePage} of {Math.ceil(pastDevicesArray.length / itemsPerPage)} </span>
                            <button
                                disabled={currentDevicePage === Math.ceil(pastDevicesArray.length / itemsPerPage)}
                                onClick={() => setCurrentDevicePage(currentDevicePage + 1)}
                            >
                                &#8594;
                            </button>
                        </div>
                        </>
                    ) : (
                        <p>No devices to show! Try returning a checked out device...</p>
                    )}
                </div>
                </>)}
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
                    {/* <div className="icon">
                        <FaRegCheckCircle />
                    </div> */}
                    <div className="checkout-header">
                        <h2>Payment Successful!</h2>
                    </div>
                    <div className="checkout-body">
                        <p>Your payment of <strong>${prevFineAmnt}</strong> has been processed successfully through your linked ShastaBucks account. All related holds and restrictions have been removed.</p>
                        <p id="subtext">Please see our help desk for help with any questions or concerns.</p>
                        <button class="btn" onClick={() => {
                                closeModal();
                        }}>Ok</button>
                    </div>
                </div>
            </div>
)}

        </div>
    );
};

export default Account;
