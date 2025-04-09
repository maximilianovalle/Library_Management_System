import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("user_id");
    const [user, setUser] = useState(null);
    const [fines, setFines] = useState([]);
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPayFineModal, setShowPayFineModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);
    
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setUser(null);
        setFines([]);
        setBorrowedItems([]);
        setHolds([]);
        
        if (!searchQuery.trim()) {
            setError("Please enter a search term");
            setLoading(false);
            return;
        }
        
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            
            // Search for the user
            const userResponse = await axios.get("https://library-management-system-8ktv.onrender.com/librarian/users/search", {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    query: searchQuery,
                    search_by: searchBy
                }
            });
            
            if (!userResponse.data.user) {
                setError("No user found matching your search criteria");
                setLoading(false);
                return;
            }
            
            setUser(userResponse.data.user);
            
            // Get user's fines
            const finesResponse = await axios.get(`https://library-management-system-gf9d.onrender.com/librarian/users/${userResponse.data.user.user_id}/fines`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setFines(finesResponse.data.fines || []);
            
            // Get user's borrowed items
            const borrowedResponse = await axios.get(`https://library-management-system-gf9d.onrender.com/librarian/users/${userResponse.data.user.user_id}/borrowed`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setBorrowedItems(borrowedResponse.data.borrowed || []);
            
            // Get user's holds
            const holdsResponse = await axios.get(`https://library-management-system-gf9d.onrender.com/librarian/users/${userResponse.data.user.user_id}/holds`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setHolds(holdsResponse.data.holds || []);
            
        } catch (error) {
            console.error("Error searching for user:", error);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handlePayFineClick = (fine) => {
        setSelectedFine(fine);
        setShowPayFineModal(true);
    };
    
    const confirmPayFine = async () => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.post(`https://library-management-system-gf9d.onrender.com/librarian/fines/${selectedFine.fine_id}/pay`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            // Update fines list after payment
            setFines(fines.map(fine => 
                fine.fine_id === selectedFine.fine_id 
                    ? { ...fine, fine_status: 1 } // 1 = Paid
                    : fine
            ));
            
            setShowPayFineModal(false);
            setSelectedFine(null);
            
            // Show success notification
            showNotification("Fine has been marked as paid", "success");
        } catch (error) {
            console.error("Error paying fine:", error);
            showNotification("Failed to process fine payment", "error");
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
    
    const getUserRole = (roleId) => {
        switch (roleId) {
            case 1:
                return 'Student';
            case 2:
                return 'Alumni';
            case 3:
                return 'Faculty';
            default:
                return 'Unknown';
        }
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    
    const calculateTotalFines = () => {
        return fines
            .filter(fine => fine.fine_status === 2) // Only unpaid fines (status = 2)
            .reduce((total, fine) => total + fine.amount, 0);
    };

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">User Management</h1>
                
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select 
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        className="form-select"
                    >
                        <option value="user_id">User ID</option>
                        <option value="email">Email</option>
                        <option value="name">Name</option>
                    </select>
                    <button type="submit" className="search-button">Search</button>
                </form>
                
                {loading && <div className="loading">Searching...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                
                {user && (
                    <div className="user-profile">
                        <div className="dashboard-section">
                            <h2>User Information</h2>
                            <div className="user-details">
                                <p><strong>User ID:</strong> {user.user_id}</p>
                                <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {getUserRole(user.role)}</p>
                                <p><strong>Account Created:</strong> {formatDate(user.created_at)}</p>
                                <p><strong>Total Unpaid Fines:</strong> ${calculateTotalFines().toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <h2>Fines</h2>
                            {fines.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Fine ID</th>
                                            <th>Amount</th>
                                            <th>Reason</th>
                                            <th>Date Issued</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fines.map((fine) => (
                                            <tr key={fine.fine_id}>
                                                <td>{fine.fine_id}</td>
                                                <td>${fine.amount}</td>
                                                <td>{fine.reason}</td>
                                                <td>{formatDate(fine.created_at)}</td>
                                                <td>
                                                    <span className={`badge ${fine.fine_status === 1 ? 'badge-success' : 'badge-danger'}`}>
                                                        {fine.fine_status === 1 ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {fine.fine_status === 2 && (
                                                        <button 
                                                            className="btn btn-outline"
                                                            onClick={() => handlePayFineClick(fine)}
                                                        >
                                                            Mark as Paid
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No fines found for this user.</p>
                            )}
                        </div>
                        
                        <div className="dashboard-section">
                            <h2>Borrowed Items</h2>
                            {borrowedItems.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Type</th>
                                            <th>Checkout Date</th>
                                            <th>Due Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {borrowedItems.map((item) => (
                                            <tr key={item.record_id}>
                                                <td>{item.title || `${item.category} - ${item.model}`}</td>
                                                <td>{item.isbn ? 'Book' : 'Device'}</td>
                                                <td>{formatDate(item.checkout_date)}</td>
                                                <td>{formatDate(item.due_date)}</td>
                                                <td>
                                                    <span className={`badge ${new Date(item.due_date) < new Date() ? 'badge-danger' : 'badge-primary'}`}>
                                                        {new Date(item.due_date) < new Date() ? 'Overdue' : 'Checked Out'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No borrowed items found for this user.</p>
                            )}
                        </div>
                        
                        <div className="dashboard-section">
                            <h2>Holds</h2>
                            {holds.length > 0 ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Type</th>
                                            <th>Hold Date</th>
                                            <th>Expiration Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {holds.map((hold) => (
                                            <tr key={hold.hold_id}>
                                                <td>{hold.title || `${hold.category} - ${hold.model}`}</td>
                                                <td>{hold.isbn ? 'Book' : 'Device'}</td>
                                                <td>{formatDate(hold.created_at)}</td>
                                                <td>{formatDate(hold.expiration_date)}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        hold.hold_status === 1 ? 'badge-success' : 
                                                        hold.hold_status === 2 ? 'badge-primary' : 
                                                        'badge-danger'
                                                    }`}>
                                                        {hold.hold_status === 1 ? 'Active' : 
                                                         hold.hold_status === 2 ? 'Pending' : 
                                                         'Expired'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No holds found for this user.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Pay Fine Modal */}
            {showPayFineModal && selectedFine && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Confirm Payment</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowPayFineModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to mark this fine as paid?</p>
                            <p><strong>Fine ID:</strong> {selectedFine.fine_id}</p>
                            <p><strong>Amount:</strong> ${selectedFine.amount}</p>
                            <p><strong>Reason:</strong> {selectedFine.reason}</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowPayFineModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-success"
                                onClick={confirmPayFine}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;