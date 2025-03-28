import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAfter from "../../components/header/HeaderAfter";
import "./mybooks.css";

const MyBooksPage = () => {
    const [pastBooks, setPastBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                console.log("Token sent to server:", token);

                const res = await axios.get(`${process.env.BACKEND_URL}/account`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setPastBooks(res.data.pastBooksArray);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []);

    return (
        <div id="body">
            <HeaderAfter />

            <div className="mybooks-container">
                <h1 className="title">My Borrowed Books</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : pastBooks.length === 0 ? (
                    <p>You haven't borrowed any books yet.</p>
                ) : (
                    <ul className="book-list">
                        {pastBooks.map((book, index) => (
                            <li key={index} className="book-item">
                                <h3>{book.title}</h3>
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>Checked out:</strong> {book.checkoutDate}</p>
                                <p><strong>Returned:</strong> {book.returnedDate}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyBooksPage;
