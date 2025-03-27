import React, { useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";

// THIS IS FOR THE DROP DOWN MENU
const browse_by = ["Title", "ISBN", "Author", "Genre"];

const BrowseBooks = () => {
    // THIS IS TO SET THE VALUES FOR THE BOOK INFORMATION
    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSelect = (selectedOption) => {
        setSearchBy(selectedOption);
    };

    const fetchBook = async (e) => {
        e.preventDefault(); // prevents page reload on submit
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            // Fix: Use search_value and search_by directly from state
            const response = await axios.get(`${process.env.BACKEND_URL}/books`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    search_value: search_value,
                    search_by: search_by,
                }
            });

            console.log("Books fetched:", response.data);
            setBooks(response.data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="body">
            <HeaderAfter />

            <div>
                <form className="search" onSubmit={fetchBook}>
                    <input
                        className="search_bar"
                        type="text"
                        label="Search"
                        placeholder="Search ..."
                        variant="outlined"
                        value={search_value}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className="search_button" type="submit">Search</button>
                </form>

                <div className="search">
                    <DropDown options={browse_by} onSelect={handleSelect} />
                </div>
            </div>

            <div className="Display_container">
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && books.length === 0 && (
                    <p>No books found. Try a different search.</p>
                )}
                {!loading && !error && books.length > 0 && (
                    <ul className="book-list">
                        {/* Render books here once backend is complete */}
                        {books.map((book, index) => (
                            <li key={index} className="book-item">
                                <h3>{book.title}</h3>
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>ISBN:</strong> {book.isbn}</p>
                                <p><strong>Genre:</strong> {book.genre}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BrowseBooks;