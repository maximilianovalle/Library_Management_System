import React, { useEffect, useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
import Genres from "./genres";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import defaultCover from './book-not-found.png';
// Dropdown options for searching
const browse_by = ["Title", "ISBN", "Author", "Genre", "Book_Status"];

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

    const fetchBooks = async (params = {}) => {
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
        fetchBooks({
            search_by: "Book_Status",
            search_value: "Available",
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        fetchBooks({
            search_by: search_by.toLowerCase(), 
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
                    <button className= "browse_button" type="submit">Search</button>
                </form>
                <div className="books_container">
                    {error && <p>{error}</p>}
                    {loading && <p>Loading...</p>}
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="book_card">
                                <h3>{book.Title}</h3>
                                <img
                                    className="book_image"
                                    src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg?default=false`}
                                    alt={book.Title}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = defaultCover; // Make sure image is in `public/` folder
                                    }}
                                    />
                                <p>Author: {book.Name}</p>
                                <p>ISBN: {book.ISBN}</p>
                                <p>Genre: {book.Genre}</p>
                                <p>Publication Year: {book.Publication_Year}</p>
                                <p>Available: {book.count}</p>
                                <button className="borrow_button">Borrow :3</button>
                            </div>
                        ))
                    ) : (
                        <p>No books found. Try different search criteria.</p>
                    )}
                </div>
                <div className="genre_container">
                    <Genres />
                </div>
            </div>
        </div>
    );
};

export default BrowseBooks;
