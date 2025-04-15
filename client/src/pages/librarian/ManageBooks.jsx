import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import BookForm from "./BookForm";
import "./ManageBooks.css";

const ManageBooks = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [books, setBooks] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });
  console.log(books)

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
  
    if (activeTab === "view") {
      axios.get(`${process.env.REACT_APP_API_URL}/get_books`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log("API Response:", res.data);
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        } else if (Array.isArray(res.data.books)) {
          setBooks(res.data.books);
        } else {
          console.error("Unexpected response structure.");
          showToast("Unexpected response format.", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to load books.", "error");
      });
    }
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks((prev) => prev.filter((book) => book.id !== id));
      showToast("Book deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete book.", "error");
    }
  };

  return (
    <div>
      <Header />
      <div className="manage-books-container">
        <h1 className="title">Manage Books</h1>

        <div className="button-group">
          <button onClick={() => setActiveTab("add")}>Add Book</button>
          <button onClick={() => setActiveTab("view")}>View All</button>
        </div>

        {toast.message && (
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        )}

        <div className="form-section">
          {activeTab === "add" && (
            <BookForm showToast={showToast} />
          )}

          {activeTab === "view" && (
            <div className="book-list">
              {books.length === 0 ? (
                <p>No books found.</p>
              ) : (
                books.map((book) => (
                  <div className="book-row">
                    <span>{book.Title} (ISBN: {book.Name})</span>
                    <button className="delete-btn" onClick={() => handleDelete(book.id)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
