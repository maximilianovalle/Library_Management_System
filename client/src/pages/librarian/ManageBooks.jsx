import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import BookForm from "./BookForm";
import EditBook from "./EditBook";
import "./ManageBooks.css";

const ManageBooks = () => {
  const [activeTab, setActiveTab] = useState("add"); // "add" | "edit" | "delete"
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null); // ID of the book being edited

  useEffect(() => {
    if (activeTab !== "add") {
      axios.get("http://localhost:5000/api/books") // Adjust to your actual API
        .then((res) => setBooks(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
      alert("Book deleted!");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const resetEdit = () => {
    setEditingBookId(null);
    setActiveTab("edit");
  };

  return (
    <div>
      <Header />
      <div className="manage-books-container">
        <h1 className="title" style={{alignItems: "center"}}>Manage Books</h1>

        <div className="button-group">
          <button onClick={() => {
            setActiveTab("add");
            setEditingBookId(null);
          }}>Add Book</button>
          <button onClick={() => {
            setActiveTab("edit");
            setEditingBookId(null);
          }}>Edit Book</button>
          <button onClick={() => {
            setActiveTab("delete");
            setEditingBookId(null);
          }}>Delete Book</button>
        </div>

        <div className="form-section">
          {activeTab === "add" && <BookForm />}

          {activeTab === "edit" && (
            <div>
              {editingBookId ? (
                <EditBook bookId={editingBookId} onFinish={resetEdit} />
              ) : (
                <div>
                  <h2>Select a Book to Edit</h2>
                  {books.map((book) => (
                    <div key={book.id} className="book-row">
                      <span>{book.title} (ISBN: {book.isbn})</span>
                      <button onClick={() => setEditingBookId(book.id)}>
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "delete" && (
            <div>
              <h2>Delete a Book</h2>
              {books.map((book) => (
                <div key={book.id} className="book-row">
                  <span>{book.title} (ISBN: {book.isbn})</span>
                  <button className="delete-btn" onClick={() => handleDelete(book.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
