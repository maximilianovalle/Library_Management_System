import React, { useEffect, useState } from "react";
import axios from "axios";

import HeaderAfter from "../../components/header/HeaderAfter";
import "./checkedOut.css";
import defaultCover from './book-not-found.png';
import Laptop from './laptop.png';
import Camera from './camera.png';
import Calculator from './calculator.png';

// carousel slider imports
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                centerMode: true,
                centerPadding: "0px",
            }
        }
    ]
};

const deviceImages = {
    "Calculator": Calculator,
    "Camera": Camera,
    "Laptop": Laptop,
}

// checked out web page

const CheckedOutPage = () => {
    const [checkedOutBooks, setBooks] = useState([]);
    const [checkedOutDevices, setDevices] = useState([]);
    const [onHoldDevices, setHoldDevices] = useState([]);

    const [showReturnItem, setShowReturnItem] = useState(false);
    const [showCancelHold, setShowCancelHold] = useState(false);
    const [affectedIndex, setAffectedIndex] = useState("");

    const currDate = new Date();
    console.log("Current Date: ", currDate);


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
            setBooks([...res.data.checkedOutBooksArr]);
            setDevices([...res.data.checkedOutDevicesArr]);
            setHoldDevices([...res.data.heldDevicesArr]);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // triggered once when the page loads
    useEffect(() => {
        const init = async () => {
            fetchItems();
        }

        init();
    }, []);


    // modal functions
    const openReturnModal = (index) => {
        setAffectedIndex(index);
        setTimeout(() => {
            setShowReturnItem(true);
        }, 400);
    }

    const closeReturnModal = () => setShowReturnItem(false);

    // const openCancelModal = (index) => {
    //     setAffectedIndex(index)
    //     setTimeout(() => {
    //         setShowCancelHold(true);
    //     }, 400);
    // }
    
    const closeCancelModal = () => setShowCancelHold(false);

    const returnBook = async (event) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        const data = {
            isbn: checkedOutBooks[affectedIndex].isbn,
            copyID: checkedOutBooks[affectedIndex].copyID,
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/returnItem`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.log("Error returning book: ", error);
        }

    };

    const removeHold = async (event) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        const data = {
            model: onHoldDevices[affectedIndex].model
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/removeHold`, data, {
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.error("Error removing hold: ", error);
        }
    }


    // HTML
    return (
        <div id="todo">

            <HeaderAfter /> {/* header component */}
            <div id="body">

                <h1 class="header">My Books</h1>
                <p class="description">All currently checked out books.</p>

                <div class="container">

                {/* checked out books*/}
                {checkedOutBooks.length > 0 ? (
                    <div class="carousel">
                        <Slider {...sliderSettings}>
                            {checkedOutBooks.map((book, index) => {

                                const isLate = new Date(book.due) < new Date();

                                // book entry
                                return (
                                    <div key={`${index}`} className="bookEntry">
                                        <h3 class="entryElement">{book.title}</h3>
                                        <p class="entryElement">{book.author}</p>
                                        <img id="bookImg" src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`} alt={book.title} onError={(err) => {  // if no book cover
                                                if (!err.target.dataset.fallback) {
                                                    err.target.src = defaultCover;
                                                    err.target.dataset.fallback = true;
                                                }
                                        }}/>
                                        {isLate && <span class="label entryElement">LATE</span>}
                                        <p class="entryElement"><strong>Due:</strong>{" "} {book.due
                                            ? new Date(book.due).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })
                                        : "No due date"
                                        }</p>

                                        <button class="btn entryElement" onClick={() => {openReturnModal(index);}}>Return Book</button>
                                    </div>
                                )

                            })}
                        </Slider>
                    </div>
                ) : (
                    <p>No books currently checked out. Browse our catalogue <a href="/browsebooks">here</a>.</p>
                )}

                </div>


                <h1 class="header">My Devices</h1>
                <p class="description">All currently checked out devices.</p>

                <div class="container">

                {/* checked out + on hold books*/}
                {checkedOutDevices.length + onHoldDevices.length > 0 ? (
                    <div class="carousel">
                        <Slider {...sliderSettings}>

                        {onHoldDevices.map((device, index) => {
                            // device entry
                            return (
                                <div key={`hold_${index}`} class="deviceEntry">
                                    <p id="holdSubtext">Thank you for picking up your device</p>
                                    <h3 class="entryElement">{device.model}</h3>
                                    <p class="entryElement">{device.category}</p>
                                    <img src={deviceImages[device.category]} alt={device.category}/>
                                    <p class="entryElement">Expires<strong>{" "} {device.expires
                                            ? new Date(device.expires).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }) : "Never"
                                        }
                                    </strong></p>

                                    {/* <button class="btn holdBtn entryElement" onClick={() => {openCancelModal(index);}}>Remove Hold</button> */}
                                    <p id="holdSubtext">Return at the Library</p>
                                </div>
                            )

                            })}

                            {checkedOutDevices.map((device, index) => {
                                const isLate = new Date(device.due) < new Date();

                                // device entry
                                return (
                                    <div key={`device_${index}`} class="deviceEntry">
                                        <h3 class="entryElement">{device.model}</h3>
                                        <p class="entryElement">{device.category}</p>
                                        <img src={deviceImages[device.category]} alt={device.category}/>
                                        {isLate && <span class="label entryElement">LATE</span>}
                                        <p class="entryElement"><strong>Due:</strong>{" "} {device.due
                                            ? new Date(device.due).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })
                                        : "No due date"
                                        }</p>

                                        <p id="returnMsg">Return to library help desk</p>
                                    </div>
                                )

                            })}

                        </Slider>
                    </div>
                ) : (
                    <p>No devices currently checked out or on hold. Browse our catalogue <a href="/browsedevices">here</a>.</p>
                )}

                </div>

                {/* return book modal */}

                {showReturnItem && (
                    <div class="modalOverlay" onClick={(event) => {
                        if (event.target.classList.contains("modalOverlay")) {
                            closeReturnModal();
                        }
                    }}>
                        <div class="modal">

                            <h2 class="modalHeader">Return <em>{checkedOutBooks[affectedIndex].title}</em>?</h2>

                            <p>Book will be removed from your checked out items.</p>

                            <div class="btnContainer">
                                <button class="btn" onClick={async () => {
                                    await returnBook();
                                    closeReturnModal();
                                    window.location.reload();
                                }}>Return Book</button>
                                <button class="cancelBtn btn" onClick={closeReturnModal}>Cancel</button>
                            </div>

                        </div>

                    </div>
                )}

                {/* cancel hold modal */}

                {showCancelHold && (
                    <div class="modalOverlay" onClick={(event) => {
                        if (event.target.classList.contains("modalOverlay")) {
                            closeCancelModal();
                        }
                    }}>
                        <div class="modal">

                            <h2 class="modalHeader">Remove hold on <em>{onHoldDevices[affectedIndex].model}</em>?</h2>

                            <p>Device will be removed from your holding list.</p>

                            <div class="btnContainer">
                                <button id="holdBtn" class="btn" onClick={() => {
                                    removeHold();
                                    closeCancelModal();
                                    window.location.reload();
                                }}>Remove Hold</button>
                                <button class="cancelBtn btn" onClick={closeCancelModal}>Cancel</button>
                            </div>

                        </div>

                    </div>
                )}

                <div class="centering">
                    <img src="/logo.png" alt="Cougar Public Library Logo" id="logo"/>
                </div>

            </div>

        </div>
    );
};

export default CheckedOutPage;
