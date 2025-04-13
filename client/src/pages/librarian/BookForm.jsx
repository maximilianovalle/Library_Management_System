import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./BookForm.css";

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    genre: "",
    isbn: "",
    publication_year: "",
    author_id: "",
    image_url: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.genre.trim()) newErrors.genre = "Genre is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.author_id.trim()) newErrors.author_id = "Author ID is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Optional: replace with your actual backend endpoint
      // await axios.post("/api/books", formData);

      console.log("Submitting book:", formData);
      alert("Book added successfully!");

      setFormData({
        title: "",
        category_id: "",
        genre: "",
        isbn: "",
        publication_year: "",
        author_id: "",
        image_url: "",
      });
      setErrors({});
      
      // Optional: redirect after adding
      // navigate("/librarian/dashboard");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div>
      <div className="book-form-container">
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Add a Book</h2>

          {[
            { label: "Title", name: "title", required: true },
            { label: "Category ID", name: "category_id" },
            { label: "Genre", name: "genre", required: true },
            { label: "ISBN", name: "isbn", required: true },
            { label: "Publication Year", name: "publication_year" },
            { label: "Author ID", name: "author_id", required: true },
            { label: "Image URL", name: "image_url" },
          ].map(({ label, name, required }) => (
            <div key={name}>
              <label className="block font-medium">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
