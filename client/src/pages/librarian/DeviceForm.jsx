import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import "./LibrarianPage.css";

const DeviceForm = () => {
    const { category, model, copyId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!(category && model && copyId);
    
    const [formData, setFormData] = useState({
        category: "",
        model: "",
        device_condition: "Good condition",
        device_status: "Available",
        copies: 1
    });
    
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");
    
    useEffect(() => {
        const fetchDeviceData = async () => {
            if (!isEditMode) {
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
                
                const response = await axios.get(`https://library-management-system-8ktv.onrender.com/librarian/devices/${category}/${model}/${copyId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const deviceData = response.data;
                setFormData({
                    category: deviceData.category || "",
                    model: deviceData.model || "",
                    device_condition: deviceData.condition || "Good condition",
                    device_status: deviceData.status || "Available",
                    copies: 1 // In edit mode, this is irrelevant
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                setError("Failed to load device data. Please try again.");
                setLoading(false);
            }
        };
        
        fetchDeviceData();
    }, [category, model, copyId, isEditMode]);
    
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
                // Update existing device
                await axios.put(`https://library-management-system-8ktv.onrender.com/librarian/devices/${category}/${model}/${copyId}`, {
                    device_condition: formData.device_condition,
                    device_status: formData.device_status
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                showNotification("Device updated successfully!", "success");
            } else {
                // Add new device
                await axios.post("https://library-management-system-8ktv.onrender.com/librarian/devices", formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                showNotification("Device added successfully!", "success");
            }
            
            // Redirect back to device management page
            navigate("/librarian/manage-devices");
        } catch (error) {
            console.error("Error saving device:", error);
            setError(error.response?.data?.message || "Failed to save device. Please try again.");
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

    // Predefined options for dropdowns
    const conditionOptions = [
        "Good condition",
        "Worn out",
        "Bad condition"
    ];
    
    const statusOptions = [
        "Available",
        "Checked out",
        "On hold",
        "Maintenance"
    ];
    
    const categoryOptions = [
        "Laptop",
        "Camera",
        "Calculator"
    ];

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">
                    {isEditMode ? "Edit Device" : "Add New Device"}
                </h1>
                
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="form-container">
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-select"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        disabled={isEditMode} // Can't change category in edit mode
                                    >
                                        <option value="">Select Category</option>
                                        {categoryOptions.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="model" className="form-label">Model</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        className="form-input"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                        readOnly={isEditMode} // Can't change model in edit mode
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="device_condition" className="form-label">Condition</label>
                                    <select
                                        id="device_condition"
                                        name="device_condition"
                                        className="form-select"
                                        value={formData.device_condition}
                                        onChange={handleChange}
                                        required
                                    >
                                        {conditionOptions.map(condition => (
                                            <option key={condition} value={condition}>
                                                {condition}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="device_status" className="form-label">Status</label>
                                    <select
                                        id="device_status"
                                        name="device_status"
                                        className="form-select"
                                        value={formData.device_status}
                                        onChange={handleChange}
                                        required
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {!isEditMode && (
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
                                )}
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn btn-outline"
                                    onClick={() => navigate("/librarian/manage-devices")}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditMode ? "Update Device" : "Add Device"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceForm;