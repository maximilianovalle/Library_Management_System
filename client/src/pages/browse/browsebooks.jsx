import React, { useEffect, useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
import Genres from "./genres";

// Dropdown options for searching
const browse_by = ["Title", "ISBN", "Author", "Genre", "Book_Status"];

const BrowseBooks = () => {
    // State for search criteria and results
    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState(""); // 'Title', 'Author', 'Genre', etc.
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch books based on search parameters
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

            setBooks(response.data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Run the fetchBooks with a default filter (e.g., available books) on initial load
    useEffect(() => {
        fetchBooks({
            search_by: "Book_Status",
            search_value: "Available",
        });
    }, []);

    // Handle the search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        // Fetch books based on search criteria
        fetchBooks({
            search_by: search_by.toLowerCase(), // Convert to lowercase to match the backend query logic
            search_value,
        });
    };

    return (
        <div>
            <HeaderAfter />
            <div className="user_page">
                <form className="search" onSubmit={handleSearch}>
                    {/* Dropdown to select search criteria */}
                    <div className="dropdown">
                        <DropDown
                            options={browse_by}
                            onSelect={(selectedOption) => {
                                setSearchBy(selectedOption);
                            }}
                        />
                    </div>
                    {/* Input field for search value */}
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

                {/* Displaying the list of books */}
                <div className="books_container">
                    {error && <p>{error}</p>}
                    {loading && <p>Loading...</p>}
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="book_card">
                                <h3>{book.Title}</h3>
                                <p>Author: {book.Author}</p>
                                <p>ISBN: {book.ISBN}</p>
                                <p>Genre: {book.Genre}</p>
                                <p>Publication Year: {book.Publication_Year}</p>
                                <button>Borrow :3</button>
                            </div>
                        ))
                    ) : (
                        <p>No books found. Try different search criteria.</p>
                    )}
                </div>

                {/* Genre filter component (optional, can be integrated if needed) */}
                <div className="genre_container">
                    <Genres />
                </div>
            </div>
        </div>
    );
};

export default BrowseBooks;
