import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import "./LibrarianPage.css";

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [notification, setNotification] = useState(null);
    
    useEffect(() => {
        fetchBooks();
    }, [filterType]);
    
    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            
            const response = await axios.get(`https://library-management-system-8ktv.onrender.com/librarian/books?filter=${filterType}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setBooks(response.data.books || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoading(false);
            showNotification("Failed to load books. Please try again.", "error");
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };
    
    const handleDeleteClick = (book) => {
        setSelectedBook(book);
        setShowDeleteDialog(true);
    };
    
    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.delete(`https://library-management-system-8ktv.onrender.com/librarian/books/${selectedBook.isbn}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            // Remove the deleted book from the state
            setBooks(books.filter(book => book.isbn !== selectedBook.isbn));
            setShowDeleteDialog(false);
            setSelectedBook(null);
            
            // Show success notification
            showNotification("Book successfully deleted", "success");
        } catch (error) {
            console.error("Error deleting book:", error);
            showNotification("Failed to delete book", "error");
        }
    };
    
    const showNotification = (message, type) => {
        setNotification({ message, type });
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    // Filter books based on search term
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">Manage Books</h1>
                
                {/* Notification message */}
                {notification && (
                    <div className={`notification notification-${notification.type}`}>
                        <span className="notification-message">{notification.message}</span>
                        <button 
                            className="notification-close"
                            onClick={() => setNotification(null)}
                        >
                            ×
                        </button>
                    </div>
                )}
                
                <div className="management-controls">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by title, author, or ISBN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                    
                    <div className="filter-options">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">All Books</option>
                            <option value="available">Available</option>
                            <option value="checked-out">Checked Out</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="on-hold">On Hold</option>
                        </select>
                        
                        <a href="/librarian/manage-books/add" className="btn btn-primary">Add New Book</a>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">Loading books...</div>
                ) : (
                    <div className="item-list">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <div key={book.isbn} className="item-card">
                                    {book.image_url ? (
                                        <img 
                                            src={book.image_url} 
                                            alt={book.title} 
                                            className="item-image" 
                                        />
                                    ) : (
                                        <div className="item-image-placeholder"></div>
                                    )}
                                    
                                    <div className="item-details">
                                        <h3 className="item-title">{book.title}</h3>
                                        <p className="item-meta">
                                            <strong>Author:</strong> {book.author} • 
                                            <strong> ISBN:</strong> {book.isbn} • 
                                            <strong> Genre:</strong> {book.genre}
                                        </p>
                                        <div className="item-status">
                                            <span className={`status status-${book.status.toLowerCase().replace(' ', '-')}`}>
                                                {book.status}
                                            </span>
                                            {book.copies && (
                                                <span className="total-copies">
                                                    {book.copies} total copies
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="item-actions">
                                            <a href={`/librarian/manage-books/edit/${book.isbn}`} className="btn btn-outline">
                                                Edit
                                            </a>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteClick(book)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No books found matching your criteria.</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showDeleteDialog}
                title="Confirm Deletion"
                message={selectedBook ? `Are you sure you wish to delete "${selectedBook.title}"? This action cannot be undone.` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteDialog(false)}
                type="danger"
            />
        </div>
    );
};

export default ManageBooks;