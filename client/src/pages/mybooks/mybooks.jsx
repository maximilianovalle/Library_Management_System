import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './mybooks.css';

const items = [
    {title: "My Books", link: "/mybooks"},
    {title: "Browse Books", link: "/browsebooks"},
    {title: "Browse Devices",link: "/browsedevices"},
    {title: "Account", link: "/account"},
    // {title: "Account", link: `/account/${userId}`}, i think we should change this for account too

]

const MyBooksPage = () => {
    
    const { userId } = useParams();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/account")
            .then((res) => {
                setBooks(res.data.pastBooksArray || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load borrowed books.");
                setLoading(false);
            });
    }, [userId]);

    return (
        <div id="body">

        {/* header code credit to @ alan "atonyit" */}
            <header className="header">
                <div className="container">
                    <nav className="nav">
                        <div className="logo">
                            <a href="/">
                                <img src="/logo.png" alt="Logo" />
                            </a>
                            <h1>Cougar Public Library</h1>
                        </div>

                        <div className={`nav-links`}>
                            {items.map((item) => (
                                <a key={item.title} href={item.link} className="link">
                                    {item.title}
                                </a>
                            ))}
                            <button onClick={() => {localStorage.clear(); window.location.href = '/login';}} className = "logout_button">Logout</button>
                        </div>
                    </nav>
                        <div className="mybooks-container">

                            <h1 className="title">My Borrowed Books</h1>

                            {loading && <p>Loading...</p>}
                            {error && <p style={{ color: "red" }}>{error}</p>}

                            {!loading && !error && (
                                <div>
                                    {books.length === 0 ? (
                                            // if theres no books
                                        <p>No borrowed books to display.</p> 
                                    ) : (
                                        <ul className="book-list">
                                            {books.map((book, i) => (
                                                <li key={i} className="book-item">
                                                    <h3>{book.title}</h3>
                                                    <p><strong>Author:</strong> {book.author}</p>
                                                    <p><strong>Checked Out:</strong> {book.checkoutDate}</p>
                                                    <p><strong>Returned:</strong> {book.returnedDate}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div> 
                    </div>
                </header>
         </div>
    );
};

export default MyBooksPage;
