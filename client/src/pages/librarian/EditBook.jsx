import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookForm.css"; // Reuse the same CSS

const EditBook = ({ bookId, onFinish }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    copies: 1,
  });

  useEffect(() => {
    // Fetch the book details to edit
    axios
      .get(`http://localhost:5000/api/books/${bookId}`)
      .then((res) => {
        setFormData(res.data); // Assuming API returns book in correct shape
      })
      .catch((err) => console.error("Error fetching book:", err));
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "copies" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/api/books/${bookId}`, formData)
      .then(() => {
        alert("Book updated successfully!");
        if (onFinish) onFinish();
      })
      .catch((err) => {
        console.error("Error updating book:", err);
        alert("Failed to update book.");
      });
  };

  return (
    <div className="book-form-container">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Author:</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <label>ISBN:</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
        />

        <label>Genre:</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
        />

        <label>Number of Copies:</label>
        <input
          type="number"
          name="copies"
          min="1"
          value={formData.copies}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBook;
