import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import "./LibrarianPage.css";

const BookForm = () => {
    const { isbn } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!isbn;
    
    const [formData, setFormData] = useState({
        title: "",
        isbn: "",
        author_id: "",
        genre: "",
        publication_year: "",
        category_id: 1, // Default to Novel
        image_url: "",
        copies: 1
    });
    
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }
                
                // Fetch all authors
                const authorsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/librarian/authors`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                setAuthors(authorsResponse.data.authors || []);
                
                // If in edit mode, fetch book details
                if (isEditMode) {
                    const bookResponse = await axios.get(`${process.env.REACT_APP_API_URL}/librarian/books/${isbn}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    
                    const bookData = bookResponse.data;
                    setFormData({
                        title: bookData.title || "",
                        isbn: bookData.isbn || "",
                        author_id: bookData.author_id || "",
                        genre: bookData.genre || "",
                        publication_year: bookData.publication_year || "",
                        category_id: bookData.category_id || 1,
                        image_url: bookData.image_url || "",
                        copies: bookData.copies || 1
                    });
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load required data. Please try again.");
                setLoading(false);
            }
        };
        
        fetchData();
    }, [isbn, isEditMode]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const token = localStorage.getItem("token");
            
            if (isEditMode) {
                // Update existing book
                await axios.put(`${process.env.REACT_APP_API_URL}/librarian/books/${isbn}`, formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                showNotification("Book updated successfully!", "success");
            } else {
                // Add new book
                await axios.post(`${process.env.REACT_APP_API_URL}/librarian/books`, formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                showNotification("Book added successfully!", "success");
            }
            
            // Redirect back to book management page
            navigate("/librarian/manage-books");
        } catch (error) {
            console.error("Error saving book:", error);
            setError(error.response?.data?.message || "Failed to save book. Please try again.");
        }
    };
    
    const showNotification = (message, type) => {
        // Create notification element
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const categoryOptions = [
        { id: 1, name: "Novel" },
        { id: 2, name: "Magazine" },
        { id: 3, name: "Textbook" }
    ];
    
    const genreOptions = [
        "Fiction", "Non-Fiction", "Adventure", "Romance", "Science Fiction", 
        "Historical Fiction", "Fantasy", "Mystery", "Horror", "Biography",
        "Classic", "Paranormal", "Educational", "Children's Literature"
    ];

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">
                    {isEditMode ? "Edit Book" : "Add New Book"}
                </h1>
                
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="form-container">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="isbn" className="form-label">ISBN</label>
                                    <input
                                        type="text"
                                        id="isbn"
                                        name="isbn"
                                        className="form-input"
                                        value={formData.isbn}
                                        onChange={handleChange}
                                        required
                                        readOnly={isEditMode} // Can't edit ISBN if updating
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="author_id" className="form-label">Author</label>
                                    <select
                                        id="author_id"
                                        name="author_id"
                                        className="form-select"
                                        value={formData.author_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Author</option>
                                        {authors.map(author => (
                                            <option key={author.author_id} value={author.author_id}>
                                                {author.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="genre" className="form-label">Genre</label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        className="form-select"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Genre</option>
                                        {genreOptions.map(genre => (
                                            <option key={genre} value={genre}>
                                                {genre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="publication_year" className="form-label">Publication Year</label>
                                    <input
                                        type="text"
                                        id="publication_year"
                                        name="publication_year"
                                        className="form-input"
                                        value={formData.publication_year}
                                        onChange={handleChange}
                                        pattern="[0-9]{4}"
                                        placeholder="YYYY"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="category_id" className="form-label">Category</label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        className="form-select"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        {categoryOptions.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="copies" className="form-label">Number of Copies</label>
                                    <input
                                        type="number"
                                        id="copies"
                                        name="copies"
                                        className="form-input"
                                        value={formData.copies}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group form-full-width">
                                    <label htmlFor="image_url" className="form-label">Image URL</label>
                                    <input
                                        type="url"
                                        id="image_url"
                                        name="image_url"
                                        className="form-input"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => navigate("/librarian/manage-books")}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditMode ? "Update Book" : "Add Book"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookForm;