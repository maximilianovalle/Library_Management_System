import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAfter from "../../components/header/HeaderAfter";

import "./checkedOut.css";
import defaultCover from './cover-not-found.png';

const CheckedOutPage = () => {
    const [loading, setLoading] = useState(true);
    const [checkedOutBooks, setBooks] = useState([]);
    const [checkedOutDevices, setDevices] = useState([]);
    const [message, setMessage] = useState("");
    const currDate = new Date();

    console.log("today's date: ", currDate);

    // triggered once when the page loads
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                // /checkedOut get request
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/checkedout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // receive JSON from checkedOut.js
                setBooks(res.data.checkedOutBooksArr);
                setDevices(res.data.checkedOutDevicesArr);
                setMessage(res.data.message);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div id="body">

            <HeaderAfter /> {/* header component */}

            {/* checked out books */}
            {checkedOutBooks.length > 0 ? (
                <ul id="checkedOutBooksList">
                    {checkedOutBooks.map((book, index) => (
                        
                        // book entry
                        <li key={`book_${index}`}>
                            <p>{book.title}</p>
                            <img src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`} alt={book.title} onError={(err) => {  // if no book cover
                                if (!err.target.dataset.fallback) {
                                    err.target.src = defaultCover;
                                    err.target.dataset.fallback = true;
                                }
                            }}/>
                        </li>
                        // ------

                    ))}
                </ul>
            ) : (
                <p>No currently checked out books. Browse our catalogue <a href="/browsebooks">here</a>.</p>
            )}

            {/* checked out devices */}
            {checkedOutDevices.length > 0 ? (
                <ul id="checkedOutDevicesList">
                    {checkedOutDevices.map((device, index) => (

                        // device entry
                        <li key={`device_${index}`}>
                            <p>{device.model}</p>
                        </li>
                        // ------

                    ))}
                </ul>
            ) : (
                <p>No currently checked out devices. Browse our catalogue <a href="/browsedevices">here</a>.</p>
            )}

        </div>
    );
};

export default CheckedOutPage;
