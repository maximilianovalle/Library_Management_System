import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import './mybooks.css';

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
        <div className="mybooks-container">
            <Header />
            <h1 className="title">My Borrowed Books</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <>
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
                </>
            )}
        </div>
    );
};

export default MyBooksPage;
