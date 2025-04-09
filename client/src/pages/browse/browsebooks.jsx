import React, { useEffect, useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
import Genres from "./genres";

// THIS IS FOR THE DROP DOWN MENU
const browse_by = ["Title", "ISBN", "Author", "Genre", "Book_Status"];
// const sort_options = ["Name A-Z", "Name Z-A", "Available First", "Unavailable First"];
// const popular_genres = [{genre: 'Fiction'}, {genre: 'Non-Fiction'},{genre: 'Romance'}, {genre:'Mystery'}, {genre:'Action'},{genre: 'Thriller'}];

const BrowseBooks = () => {
    // THIS IS TO SET THE VALUES FOR THE BOOK INFORMATION
    const [search_value, setSearchValue] = useState("");
    // console.log("Search Value:", search_value);
    const [search_by, setSearchBy] = useState("");
    // console.log("Search By:", search_by);
    const [books, setBooks] = useState([])
    // books = {
    //     Author : 'yer',
    //     ISBN : "12983u812",
    //     Genre : 'Romance',
    //     Publication_Year :'20003'

    // }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // const handleSelect = (selectedOption) => {
    //     setSearchBy(selectedOption);
    // };
    
    const fetchBook = async (params = {}) => {
        console.log("Params:", params);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            // Fix: Use search_value and search_by directly from state

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params,
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
    useEffect(() => {
        fetchBook({
                search_by: "Book_Status",
                search_value: "Available"
            });
    }, []);
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        fetchBook({
            search_by,
            search_value
        });
    }
    return (
        <div>
            <HeaderAfter/>
        <div className = "user_page">
            
                <form className = "search" onSubmit={handleSearch}>
                    
                <div className="dropdown">
                        <DropDown
                            options={browse_by}
                            onSelect={(selectedOption) => {
                                setSearchBy(selectedOption.toLowerCase());
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
                    <button className="search_button" type="submit">Search</button>

                </form>
            
                <div className="books_container">
                    {error && <p>{error}</p>}
                    {books.length > 0 ? (
                        books.map((book, index) => (
                            <div key={index} className="book_card">
                                <h3>{book.Title}</h3>
                                <p>Author: {book.Author}</p>
                                <p>ISBN: {book.ISBN}</p>
                                <p>Genre: {book.Genre}</p>
                                <p>Publication Year: {book.Publication_Year}</p>
                            </div>
                        ))
                    ) : (
                        <p>YERRRR</p>
                    )}
                </div>
                <div className="genre_container">
                    {/* <h2 style={{font: "12", fontFamily: "sans-serif"}}>
                        Search by Genres
                        </h2>
                        <div>
                            popular_genres.map((genre)) ={
                        <div>
                            {popular_genres.genre}
                        </div>
                        }
                    </div> */}
                    <Genres />
                </div>
        </div>
    </div>
    );
};

export default BrowseBooks;