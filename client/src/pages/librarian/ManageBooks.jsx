import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import BookForm from "./BookForm";
import "./ManageBooks.css";
import defaultCover from '../browse/book-not-found.png';  // import the default cover image

const ManageBooks = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

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
      axios
        .get(`${process.env.REACT_APP_API_URL}/get_books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
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

  const handleDelete = async (Copy_ID, ISBN) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete_book`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          Copy_ID,
          ISBN,
        },
      });
      setBooks((prev) => prev.filter((book) => book.Copy_ID !== Copy_ID));
      showToast("Book deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete book.", "error");
    }
  };

  const getConditionClass = (condition) => {
    if (!condition) return "";
    const clean = condition.trim().toLowerCase();
    switch (clean) {
      case "good":
      case "good condition":
        return "good-condition";
      case "bad":
      case "bad condition":
        return "bad-condition";
      case "worn":
      case "worn out":
        return "worn-condition";
      default:
        return "";
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();

    const title = (book.Title || "").toLowerCase();
    const author = (book.Name || "").toLowerCase();
    const condition = (book.Book_Condition || "").trim().toLowerCase();

    const titleMatch = title.includes(query);
    const authorMatch = author.includes(query);
    const conditionMatch = conditionFilter === "" || condition.includes(conditionFilter.toLowerCase());

    return (titleMatch || authorMatch) && conditionMatch;
  });

  return (
    <div>
      <Header />
  
      <div id="manageBooks">
        <div className="user_page">
          <div className="button-group">
            <button 
              onClick={() => setActiveTab("add")} 
              className={`tab-button ${activeTab === "add" ? "active" : ""}`}
            >
              Add Book
            </button>
            <button 
              onClick={() => setActiveTab("view")} 
              className={`tab-button ${activeTab === "view" ? "active" : ""}`}
            >
              View All
            </button>
          </div>
  
          {toast.message && (
            <div className={`toast ${toast.type}`}>{toast.message}</div>
          )}
  
          <div className="form-section">
            {activeTab === "add" && <BookForm showToast={showToast} />}
  
            {activeTab === "view" && (
              <div>
                <div className="search-bar-container">
                  <input
                    type="text"
                    placeholder="Search by title or ISBN..."
                    className="search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
  
                <div className="condition-filter">
                  <button onClick={() => setConditionFilter("")}>All Conditions</button>
                  <button onClick={() => setConditionFilter("good")}>Good</button>
                  <button onClick={() => setConditionFilter("bad")}>Bad</button>
                  <button onClick={() => setConditionFilter("worn")}>Worn Out</button>
                </div>
  
                <div className="book-list">
                  {filteredBooks.length === 0 ? (
                    <p>No books found.</p>
                  ) : (
                    filteredBooks.map((book) => (
                      <div className="book-card" key={`${book.ISBN}-${book.Copy_ID}`}>
                        <div className="book-image-container">
                          <img
                            className="book-image"
                            src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg?default=false`}
                            alt={book.Title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultCover;
                            }}
                          />
                        </div>
                        <div className="book-details">
                          <h3>{book.Title}</h3>
                          <p>{book.Name} (Author)</p>
                          <p>ISBN: {book.ISBN}</p>
                          <span
                            className={`condition-tag ${getConditionClass(book.Book_Condition)}`}
                          >
                            {book.Book_Condition} 
                          </span>
                        </div>
                        <br></br>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(book.Copy_ID, book.ISBN)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
