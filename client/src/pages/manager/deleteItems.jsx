import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { MdLaptopChromebook, MdDeleteForever } from "react-icons/md";
import { BiLibrary } from "react-icons/bi";
import { FiAlertOctagon } from "react-icons/fi";

import defaultCover from '../checkedOutItems/book-not-found.png';
import cameraImg from "../checkedOutItems/camera.png";
import calculatorImg from "../checkedOutItems/calculator.png";
import laptopImg from "../checkedOutItems/laptop.png";

import DropDown from '../browse/components/drop_down';
import Header from "../../components/header/ManagerHeader";
import "./deleteItems.css";

const browse_by = ["Title", "ISBN", "Author", "Genre"];
const browse_by_devices = ["Model", "Category"];

const categoryImages = {
    camera: cameraImg,
    calculator: calculatorImg,
    laptop: laptopImg,
};

const ManagerDeleteItems = () => {

    const [books, setBooks] = useState([]);
    const [devices, setDevices] = useState([]);

    const [bookDeleteModal, setBookDeleteModal] = useState(null);
    // const [bookEditModal, setBookEditModal] = useState(null);
    // const [bookFormData, setBookFormData] = useState({});

    const [deviceDeleteModal, setDeviceDeleteModal] = useState(null);
    // const [deviceEditModal, setDeviceEditModal] = useState(null);
    // const [deviceFormData, setDeviceFormData] = useState({});

    const [activeTab, setActiveTab] = useState("books");
    const [toast, setToast] = useState({ message: "", type: "" });

    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState("");

    const [searchValue, setSearchValueDevices] = useState("");
    const [searchBy, setSearchByDevices] = useState("");


    const verifyUser = (token) => {
        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }
    }

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const fetchItems = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            verifyUser(token);
    
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/manage_items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setBooks(res.data.allBooks);
            setDevices(res.data.allDevices);
        } catch (error) {
            console.error("Error fetching books: ", error);
        }
    }, []);
    
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // book search

    const handleSearch = (e) => {
        e.preventDefault();

        fetchBooks({
            search_by: search_by,
            search_value,
        });
    };

    const fetchBooks = async (params = {}) => {
        try {
            const token = localStorage.getItem("token");
            verifyUser(token);

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/books`, { headers: { "Authorization": `Bearer ${token}` }, params });

            setBooks(res.data.allBooks);

        } catch (error) {
            console.error("Error fetching books: ", error);
        }
    };

    // device search

    const handleSearchDevice = (e) => {
        e.preventDefault();

        fetchDevices({
            searchBy: searchBy,
            searchValue,
        });
    }

    const fetchDevices = async (params = {}) => {
        try {
            const token = localStorage.getItem("token");
            verifyUser(token);

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, { headers: { "Authorization": `Bearer ${token}` }, params });

            setDevices(res.data.allDevices);

        } catch (error) {
            console.error("Error fetching devices: ")
        }
    }

    // edit book

    // const handleBookChange = (e) => {
    //     setBookFormData((prev) => ({
    //         ...prev,
    //         [e.target.name]: e.target.value,
    //     }));
    // };

    // const handleBookUpdate = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const token = localStorage.getItem("token");
    //         verifyUser(token);

    //         await axios.put(`${process.env.REACT_APP_API_URL}/bookUpdateManager`, bookFormData, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //     } catch (error) {
    //         console.error("Book update failed: ", error);
    //     }

    //     setBookEditModal(null);
    //     window.location.reload();
    // }

    // edit device

    // const handleDeviceChange = (e) => {
    //     setDeviceFormData((prev) => ({
    //         ...prev,
    //         [e.target.name]: e.target.value,
    //     }));
    // };

    // const handleDeviceUpdate = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const token = localStorage.getItem("token");
    //         verifyUser(token);

    //         await axios.put(`${process.env.REACT_APP_API_URL}/deviceUpdateManager`, deviceFormData, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
            
    //     } catch (error) {
    //         console.error("Device update failed: ", error);
    //     }

    //     setDeviceEditModal(null);
    //     window.location.reload();
    // }

    // delete book

    const deleteBook = async (bookDeleteModal) => {
        const token = localStorage.getItem("token");
        verifyUser(token);

        const data = {
            isbn: bookDeleteModal.isbn,
        }

        try {

            await axios.put(`${process.env.REACT_APP_API_URL}/deleteBookManager`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.log("Error deleting book: ", error);
        }

        window.location.reload();
        showToast("Book deleted successfully.");
    }

    //  delete device

    const deleteDevice = async (deviceDeleteModal) => {
        const token = localStorage.getItem("token");
        verifyUser(token);

        const data = {
            model: deviceDeleteModal.model,
        }

        try {

            await axios.put(`${process.env.REACT_APP_API_URL}/deleteDeviceManager`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.log("Error deleting device: ", error);
        }

        window.location.reload();
        showToast("Device deleted successfully.");
    }


    return (
        <div>
            <Header />
            <div id="body">

                {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

                <h2 id="dashboardTitle" className="dashboard-title manageLibrariansTitle">Manage Catalogue</h2>
    
                {/* tab buttons */}

                <div className="tab-buttons dashboard-header dashboard-title">
                    <button className={`tab-button ${activeTab === "books" ? "active" : ""}`} onClick={() => {
                        setActiveTab("books");
                    }}><BiLibrary /></button>
                    <button className={`tab-button ${activeTab === "devices" ? "active" : ""}`} onClick={() => {
                        setActiveTab("devices");
                    }}><MdLaptopChromebook /></button>
                </div>

                {/* books tab */}

                {activeTab === "books" && (<>
                    {books.length > 0 ? (<>

                        {/* search bar */}

                        <form className="search fadeInAnimation" onSubmit={handleSearch}>

                            <div className="dropdown">
                                <DropDown options={browse_by} value={search_by} onSelect={ (selectedOption) => { setSearchBy(selectedOption); }}/>
                            </div>

                            <input className="search_bar" type="text" label="Search" placeholder="Search Book..." value={search_value} onChange={ (e) => setSearchValue(e.target.value) }/>
                            
                            <button className="browse_button" type="submit">Enter</button>

                        </form>

                        {/* books */}

                        <div className="books_container fadeInAmnimation">

                        {books.map((book, index) => {
                            
                            return (<>
                            <div key={index} className="book_card">

                                <h3 className="entryElement">{book.title}</h3>

                                <img className="book_image" src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`} alt={book.Title}onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultCover;
                                }}/>

                                <p class="entryElement">{book.author}, {book.publication}</p>
                                <p class="bookCataloguebtmPadding bookGenreSubtext entryElement"><em>{book.genre}</em></p>

                                <div class="bookBtnContainer">
                                    {/* <button class="bookCardBtn" onClick={() => {
                                        setBookEditModal(book);
                                        setBookFormData({ ...book });
                                        }}><MdModeEdit /></button> */}
                                    <button class="redDelete bookCardBtn" onClick={() => setBookDeleteModal(book)}><MdDeleteForever /></button>
                                </div>

                            </div>
                            </>);
                        })}

                        {/* delete book modal */}

                        {bookDeleteModal && (
                            <div className="modal-overlay" onClick={() => setBookDeleteModal(null)}>
                            
                            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                                <span className="modal-close" onClick={() => setBookDeleteModal(null)}>&times;</span>
                            
                                <h2 class="modalHeader">Delete all copies of <em>{bookDeleteModal.title}</em>?</h2>

                                <p>Clicking 'confirm' will delete every non-checked out copy of <em>{bookDeleteModal.title}</em> in your catalogue. Current available copies of this book will no longer be accessible to any user. This action cannot be undone.</p>

                                <div className="modal-buttons">
                                    <button className="confirm-button" onClick={() => {
                                        setBookDeleteModal(null);
                                        deleteBook(bookDeleteModal);
                                    }}><FiAlertOctagon /> Confirm</button>

                                    <button className="cancel-button" onClick={() => setBookDeleteModal(null)}>Cancel</button>
                                </div>
                            </div>
                            </div>
                        )}

                        {/* edit book modal */}

                        {/* {bookEditModal && (
                            <div className="modal-overlay" onClick={() => setBookEditModal(null)}>
                            
                            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                                <span className="modal-close" onClick={() => setBookEditModal(null)}>&times;</span>

                                <form onSubmit={handleBookUpdate} className="shortenCatalogueForm librarian-form" autoComplete="off">

                                    {Object.entries(bookFormData).map(([key, value]) => {

                                        if (key === "isbn") return null;

                                        return (<div>

                                        <div class="alignMeLeft entryElement"><strong>{key}</strong></div>
                                        <input className="entryInput" key={key} name={key} value={value || ""} onChange={handleBookChange} placeholder={key.replace(/_/g, " ")} type={key === "Role" ? "number" : "text"} required/>

                                        </div>)

                                    })}

                                    <button type="submit">Update Book</button>

                                </form>

                            </div>
                            </div>
                        )} */}

                        </div>

                    </>) : (<>
                        {/* search bar */}

                        <form className="search fadeInAnimation" onSubmit={handleSearch}>

                            <div className="dropdown">
                                <DropDown options={browse_by} value={search_by} onSelect={ (selectedOption) => { setSearchBy(selectedOption); }}/>
                            </div>

                            <input className="search_bar" type="text" label="Search" placeholder="Search Book..." value={search_value} onChange={ (e) => setSearchValue(e.target.value) }/>
                            
                            <button className="browse_button" type="submit">Enter</button>

                        </form>
                        
                        <div class="nothingFoundMsg">
                            <p>No books found.</p>
                        </div>
                    </>)}
                </>)}

                {/* devices tab */}

                {activeTab === "devices" && (<>
                    {devices.length > 0 ? (<>

                    {/* search bar */}

                    <form className="search fadeInAnimation" onSubmit={handleSearchDevice}>

                        <div className="dropdown">
                            <DropDown options={browse_by_devices} value={searchBy} onSelect={ (selectedOption) => { setSearchByDevices(selectedOption); }}/>
                        </div>

                        <input type="text" className="search_bar" label="Search" placeholder="Search Device..." value={searchValue} onChange={ (e) => setSearchValueDevices(e.target.value) }/>

                        <button className="search_button browse_button" type="submit">Enter</button>

                    </form>

                    {/* devices */}

                    <div className="Display_container">
                    <div className="editDeviceDisplay">
                    
                    {devices.map((device, index) => {

                        const imageSrc = categoryImages[device.category.toLowerCase()];

                        return (<>
                        <div key={index} className="deviceCardEdit device_card">
                            
                            <div className="alignDeviceInfo">

                                <p class="entryElement"><strong>{device.model}</strong></p>

                                <p class="entryElement">{device.category}</p>

                                {imageSrc && (
                                    <img src={imageSrc} alt={device.category} className="removeLeft device_image"/>
                                )}

                                <div class="bookBtnContainer">
                                    {/* <button class="bookCardBtn" onClick={() => {
                                        setDeviceEditModal(device);
                                        setDeviceFormData({ ...device });
                                        }}><MdModeEdit /></button> */}
                                    <button class="redDelete bookCardBtn" onClick={() => setDeviceDeleteModal(device)}><MdDeleteForever /></button>
                                </div>

                            </div>
                            
                        </div>
                        </>)

                    })}

                    </div>

                    {/* delete device modal */}

                    {deviceDeleteModal && (
                        <div className="modal-overlay" onClick={() => setDeviceDeleteModal(null)}>
                        
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <span className="modal-close" onClick={() => setDeviceDeleteModal(null)}>&times;</span>
                        
                            <h2 class="modalHeader">Delete all <em>{deviceDeleteModal.model}</em> {deviceDeleteModal.category.toLowerCase()}s?</h2>

                            <p>Clicking 'confirm' will delete every non-checked out instance of a <em>{deviceDeleteModal.model}</em> {deviceDeleteModal.category.toLowerCase()} in your catalogue. Current available copies of this device will no longer be accessible to any user. This action cannot be undone.</p>

                            <div className="modal-buttons">
                                <button className="confirm-button" onClick={() => {
                                    setDeviceDeleteModal(null);
                                    deleteDevice(deviceDeleteModal);
                                }}><FiAlertOctagon /> Confirm</button>
                                
                                <button className="cancel-button" onClick={() => setDeviceDeleteModal(null)}>Cancel</button>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* edit device modal */}

                    {/* {deviceEditModal && (
                        <div className="modal-overlay" onClick={() => setDeviceEditModal(null)}>
                        
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                            <span className="modal-close" onClick={() => setDeviceEditModal(null)}>&times;</span>

                            <form onSubmit={handleDeviceUpdate} className="shortenCatalogueForm librarian-form" autoComplete="off">

                                {Object.entries(deviceFormData).map(([key, value]) => {

                                    if (key === "category") return (<div>
                                    <div class="alignMeLeft entryElement"><strong>{key}</strong></div>
                                    <select name="category" value={deviceFormData.category} onChange={handleDeviceChange} className="makeMeBigger styled-select">
                                        <option value="Calculator">Calculator</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Camera">Camera</option>
                                    </select>
                                    </div>)

                                    if (key === "model") return null;

                                    return (<div>

                                    <div class="alignMeLeft entryElement"><strong>{key}</strong></div>
                                    <input className="entryInput" key={key} name={key} value={value || ""} onChange={handleDeviceChange} placeholder={key.replace(/_/g, " ")} type={key === "Role" ? "number" : "text"} required/>

                                    </div>)

                                })}

                                <button type="submit">Update Device</button>

                            </form>

                        </div>
                        </div>
                    )} */}

                    </div>

                    </>) : (<>
                        {/* search bar */}

                        <form className="search fadeInAnimation" onSubmit={handleSearchDevice}>

                            <div className="dropdown">
                                <DropDown options={browse_by_devices} value={searchBy} onSelect={ (selectedOption) => { setSearchByDevices(selectedOption); }}/>
                            </div>

                            <input type="text" className="search_bar" label="Search" placeholder="Search Device..." value={searchValue} onChange={ (e) => setSearchValueDevices(e.target.value) }/>

                            <button className="search_button browse_button" type="submit">Enter</button>

                        </form>

                        <div class="nothingFoundMsg">
                            <p>No devices found.</p>
                        </div>
                    </>)}
                </>)}
                

            </div>
        </div>
    )

}

export default ManagerDeleteItems;