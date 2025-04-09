import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const ManageDevices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    
    useEffect(() => {
        fetchDevices();
    }, [filterCategory, filterStatus]);
    
    const fetchDevices = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/librarian/devices`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    category: filterCategory !== "all" ? filterCategory : undefined,
                    status: filterStatus !== "all" ? filterStatus : undefined
                }
            });
            
            setDevices(response.data.devices || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching devices:", error);
            setLoading(false);
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchDevices();
    };
    
    const handleDeleteClick = (device) => {
        setSelectedDevice(device);
        setShowDeleteModal(true);
    };
    
    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.delete(`https://library-management-system-8ktv.onrender.com/librarian/devices/${selectedDevice.category}/${selectedDevice.model}/${selectedDevice.copy_id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            // Remove the deleted device from the state
            setDevices(devices.filter(device => 
                !(device.category === selectedDevice.category && 
                  device.model === selectedDevice.model &&
                  device.copy_id === selectedDevice.copy_id)
            ));
            
            setShowDeleteModal(false);
            setSelectedDevice(null);
            
            // Show success notification
            showNotification("Device successfully deleted", "success");
        } catch (error) {
            console.error("Error deleting device:", error);
            showNotification("Failed to delete device", "error");
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
    
    // Filter devices based on search term
    const filteredDevices = devices.filter(device => 
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Get unique categories for filter dropdown
    const categories = ["all", ...new Set(devices.map(device => device.category))];

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">Manage Devices</h1>
                
                <div className="management-controls">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by model or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                    
                    <div className="filter-options">
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.filter(cat => cat !== "all").map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="Checked out">Checked out</option>
                            <option value="On hold">On hold</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        
                        <a href="/librarian/manage-devices/add" className="btn btn-primary">Add New Device</a>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">Loading devices...</div>
                ) : (
                    <div className="item-list">
                        {filteredDevices.length > 0 ? (
                            filteredDevices.map((device, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-details">
                                        <h3 className="item-title">{device.model}</h3>
                                        <p className="item-meta">
                                            <strong>Category:</strong> {device.category} • 
                                            <strong> Copy ID:</strong> {device.copy_id}
                                        </p>
                                        <p className="item-meta">
                                            <strong>Condition:</strong> {device.condition}
                                        </p>
                                        <div className="item-status">
                                            <span className={`status status-${device.status.toLowerCase().replace(' ', '-')}`}>
                                                {device.status}
                                            </span>
                                        </div>
                                        
                                        <div className="item-actions">
                                            <a 
                                                href={`/librarian/manage-devices/edit/${device.category}/${device.model}/${device.copy_id}`} 
                                                className="btn btn-outline"
                                            >
                                                Edit
                                            </a>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteClick(device)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No devices found matching your criteria.</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedDevice && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 className="modal-title">Confirm Deletion</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you wish to delete "{selectedDevice.model}" (Copy ID: {selectedDevice.copy_id})?</p>
                            <p className="text-danger">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDevices;