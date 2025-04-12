import React, { useEffect, useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
// import Genres from "./genres";
import defaultCover from './book-not-found.png';

import { FaPlus, FaMinus } from "react-icons/fa";

// Dropdown options for searching
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


const BrowseBooks = () => {
    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [visible, setVisible] = useState(5);
    const [confirm_borrow, setConfirmBorrow] = useState(null)
    // FAQ state
    const [activeIndex, setActiveIndex] = useState(null);


    const double_check_borrow = (book) => {
        setConfirmBorrow(book);
    };

    const toggleFAQ = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const faqItems = [
        {
            question: "How do I place a hold on a device?",
            answer: "On the Browse Devices page, click 'Place Hold' next to an available item. The device will be reserved for 1 day and marked as 'Held by you'.",
        },
        {
            question: "Where can I view my checked-out books and devices?",
            answer: "Go to your Account page. You’ll see a list of items you’ve checked out, their due dates, and any late fees owed.",
        },
        {
            question: "Can I return items online?",
            answer: "Returns must be made in person at the library desk. Once scanned, your account will update and late fees (if any) will be applied automatically.",
        },
        {
            question: "What happens if I don’t pick up a held item?",
            answer: "If not picked up in time, the item will become available again and removed from your hold list.",
        },
        {
            question: "How do I know if I have late fees?",
            answer: "Late fees are shown on your Account page. They are calculated at check-in based on the return date and item type/condition.",
        },
        {
            question: "Can I check out multiple devices at once?",
            answer: "Students may borrow up to 2 devices and 3 books at a time. Faculty may borrow more. Limits reset after returns are completed.",
        },
    ];

    const handleLoadMore = () => {
        setVisible((previous) => previous + 5);
    };

    const handleBorrow = async () => {

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            await axios.put(`${process.env.REACT_APP_API_URL}/borrow_book`,
                { ISBN: confirm_borrow.ISBN }, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            alert("Book borrowed successfully!");
            setConfirmBorrow(null);
            window.location.reload();

        } catch (error) {
            console.error("Error borrowing book:", error);
            alert("Failed to borrow book. Please try again.");
            setConfirmBorrow(null);
        }
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

            setBooks(processBooks(response.data.books || []));
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        fetchBooks({
            search_by: search_by,
            search_value,
        });
    };

    return (
        <div>
            <HeaderAfter />
            <div className="user_page">
                <form className="search" onSubmit={handleSearch}>
                    <div className="dropdown">
                        <DropDown
                            options={browse_by}
                            onSelect={(selectedOption) => {
                                setSearchBy(selectedOption);
                            }}
                        />
                    </div>
                    <input
                        className="search_bar"
                        type="text"
                        label="Search"
                        placeholder="Search ..."
                        value={search_value}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className="browse_button" type="submit">Search</button>
                </form>
                <div className="books_container">
                    {error && <p>{error}</p>}
                    {loading && <p>Loading...</p>}
                    {books.length > 0 ? (
                        books.slice(0, visible).map((book, index) => (
                            <div key={index} className="book_card">
                                <h3>{book.Title}</h3>
                                <img
                                    className="book_image"
                                    src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg?default=false`}
                                    alt={book.Title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultCover;
                                    }}
                                />
                                <p>Author: {book.Name}</p>
                                <p>ISBN: {book.ISBN}</p>
                                <p>Genre: {book.Genre}</p>
                                <p>Publication Year: {book.Publication_Year || "Unknown"}</p>
                                <p>Available: {book.count}</p>
                                <button className="borrow_button" onClick={() => double_check_borrow(book)}>Borrow :D</button>
                                </div>
                        ))
                    ) : (
                        <p>No books found. Try different search criteria.</p>
                    )}
                </div>
                {visible < books.length && (
                    <button className="load_more_button" onClick={handleLoadMore}>
                        Show more...
                    </button>
                )}
                {/* <div className="genre_container">
                    <Genres />
                </div> */}
            </div>

            <div className="library-info-section">
                <div className="library-info-left">
                <h1>Welcome to Cougar Library!</h1>
                    <p>
                        As a UH student, you get full access to our library services — no sign-up required. Use your account to browse, place holds, check out books and devices, and track late fees in one place.
                    </p>
                    <p>
                        Whether you need a laptop for class or a book for research, we’ve got you covered. All devices and books are free to borrow, with extended time limits for faculty.
                    </p>
                </div>
                <div className="library-info-right">
                    <h2>Frequently Asked Questions</h2>
                    {faqItems.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? "active" : ""}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <span>{item.question}</span>
                                <span className="faq-icon">
                                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                                </span>
                                </div>

                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
                {confirm_borrow && (
                    <div className="modal-overlay" onClick={() => setConfirmBorrow(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={() => setConfirmBorrow(null)}>&times;</span>
                        <img
                            src={`https://covers.openlibrary.org/b/isbn/${confirm_borrow.ISBN}-L.jpg?default=false`}
                            alt={confirm_borrow.Title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultCover;
                            }}
                            style={{ maxWidth: "150px", marginBottom: "1rem", borderRadius: "8px" }}
                        />
                        <p>Are you sure you want to borrow:</p>
                        <h3 style={{ marginBottom: "1rem" }}>{confirm_borrow.Title}</h3>
                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={handleBorrow}>Yes</button>
                            <button className="cancel-button" onClick={() => setConfirmBorrow(null)}>No</button>
                        </div>
                    </div>
                </div>
                    )}
        </div>
    );
};

export default BrowseBooks;
