import React, { useState, useEffect } from "react";
import axios from "axios";

import { MdLaptopChromebook, MdModeEdit, MdDeleteForever } from "react-icons/md";
import { BiLibrary } from "react-icons/bi";

import DropDown from '../browse/components/drop_down';
import defaultCover from '../checkedOutItems/book-not-found.png';
import Header from "../../components/header/ManagerHeader";
import "./deleteItems.css";

const browse_by = ["Title", "ISBN", "Author", "Genre"];

const processBooks = (books) => {
    const bookMap = new Map();

    books.forEach((book) => {
        const isbn = book.ISBN;

        if (bookMap.has(isbn)) {
            bookMap.get(isbn).count += 1;
        } else {
            bookMap.set(isbn, { ...book, count: 1 });
        }
    });

    return Array.from(bookMap.values());
};

const ManagerDeleteItems = () => {

    const [books, setBooks] = useState([]);
    const [devices, setDevices] = useState([]);

    const [activeTab, setActiveTab] = useState("books");
    const [toast, setToast] = useState({ message: "", type: "" });

    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState("");


    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/manage_items`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            setBooks(res.data.allBooks);
            setDevices(res.data.allDevices);
        } catch (error) {
            console.error("Error fetching books: ", error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

    // book search

    const handleSearch = (e) => {
        e.preventDefault();

        fetchBooks({
            search_by: search_by,
            search_value,
        });
    };

    const fetchBooks = async (params = {}) => {
        console.log(params);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params,
            });

            setBooks(response.data.allBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

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
                                <DropDown options={browse_by} value={search_by} onSelect={(selectedOption) => { setSearchBy(selectedOption); }}/>
                            </div>

                            <input className="search_bar" type="text" label="Search" placeholder="Search Book..." value={search_value} onChange={(e) => setSearchValue(e.target.value)}/>
                            
                            <button className="browse_button" type="submit">Enter</button>
                        </form>

                        {/* books */}

                        <div className="books_container fadeInAmnimation">

                        {books.map((book, index) => {
                            
                            return (<>
                            <div key={index} className="book_card">

                                <h3 className="entryElement">{book.title}</h3>

                                <img className="book_image" src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg?default=false`} alt={book.Title}onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultCover;
                                }}/>

                                <p class="entryElement">{book.author}, {book.publication}</p>
                                <p class="bookGenreSubtext entryElement"><em>{book.genre}</em></p>

                                <div class="bookBtnContainer">
                                    <button class="bookCardBtn"><MdModeEdit /></button>
                                    <button class="bookCardBtn"><MdDeleteForever /></button>
                                </div>

                            </div>
                            </>);
                        })}

                        </div>

                    </>) : (
                        <p>No books found.</p>
                    )}
                </>)}

                {/* devices tab */}

                {activeTab === "devices" && (
                    <p>Test 2</p>
                )}
                

            </div>
        </div>
    )

}

export default ManagerDeleteItems;