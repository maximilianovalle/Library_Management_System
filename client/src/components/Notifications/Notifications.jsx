import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    
    useEffect(() => {
        // Load saved notifications from localStorage on component mount
        loadSavedNotifications();
        
        // Check for due date notifications when component mounts
        checkDueDateNotifications();
        
        // Set up intervals for periodic checks
        const dueDateInterval = setInterval(checkDueDateNotifications, 3600000); // Check every hour
        
        return () => {
            clearInterval(dueDateInterval);
        };
    }, []);
    
    // Load saved notifications from localStorage
    const loadSavedNotifications = () => {
        const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(savedNotifications);
        setUnreadCount(savedNotifications.filter(n => !n.isRead).length);
    };
    
    // Save notifications to localStorage
    const saveNotifications = (updatedNotifications) => {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
    };
    
    // Check for items due in 2 days
    const checkDueDateNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                return;
            }
            
            // Fetch user's borrowed items
            const response = await axios.get("https://library-management-system-gf9d.onrender.com/account", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            const userData = response.data;
            
            // Check if we have borrowed books/devices data
            if (!userData.pastBooksArray) {
                return;
            }
            
            // Create a date object for 2 days from now (midnight)
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
            twoDaysFromNow.setHours(0, 0, 0, 0);
            
            // Process borrowed books
            const borrowedBooks = userData.pastBooksArray || [];
            borrowedBooks.forEach(book => {
                // Check if the book has a return date (if not, it's still checked out)
                if (!book.returnedDate) {
                    // Parse the due date
                    const dueDate = new Date(book.dueDate);
                    
                    // Check if due in 2 days
                    if (
                        dueDate.getDate() === twoDaysFromNow.getDate() &&
                        dueDate.getMonth() === twoDaysFromNow.getMonth() &&
                        dueDate.getFullYear() === twoDaysFromNow.getFullYear()
                    ) {
                        // Create a unique ID for this notification
                        const notificationId = `book-${book.title}-${dueDate.getTime()}`;
                        
                        // Check if we already have this notification
                        const existingNotification = notifications.find(n => n.id === notificationId);
                        
                        if (!existingNotification) {
                            const formattedDate = dueDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });
                            
                            // Add new notification
                            const newNotification = {
                                id: notificationId,
                                message: `Your book "${book.title}" is due in 2 days on ${formattedDate}.`,
                                type: 'due_date',
                                isRead: false,
                                createdAt: new Date()
                            };
                            
                            saveNotifications([newNotification, ...notifications]);
                        }
                    }
                }
            });
            
            // Handle devices if that data is available
            const borrowedDevices = userData.pastDevicesArray || [];
            borrowedDevices.forEach(device => {
                // Check if the device has a return date (if not, it's still checked out)
                if (!device.returnedDate) {
                    // Parse the due date
                    const dueDate = new Date(device.dueDate);
                    
                    // Check if due in 2 days
                    if (
                        dueDate.getDate() === twoDaysFromNow.getDate() &&
                        dueDate.getMonth() === twoDaysFromNow.getMonth() &&
                        dueDate.getFullYear() === twoDaysFromNow.getFullYear()
                    ) {
                        // Create a unique ID for this notification
                        const notificationId = `device-${device.model}-${dueDate.getTime()}`;
                        
                        // Check if we already have this notification
                        const existingNotification = notifications.find(n => n.id === notificationId);
                        
                        if (!existingNotification) {
                            const formattedDate = dueDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            });
                            
                            // Add new notification
                            const newNotification = {
                                id: notificationId,
                                message: `Your device "${device.model}" is due in 2 days on ${formattedDate}.`,
                                type: 'due_date',
                                isRead: false,
                                createdAt: new Date()
                            };
                            
                            saveNotifications([newNotification, ...notifications]);
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error("Error checking due dates:", error);
        }
    };
    
    // Check for new fines
    useEffect(() => {
        const checkForNewFines = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    return;
                }
                
                // Fetch user's fines
                const response = await axios.get("https://library-management-system-gf9d.onrender.com/fines", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const fines = response.data.fines || [];
                const lastCheckTime = localStorage.getItem('lastFineCheck') || '0';
                
                // Find new fines since last check
                const newFines = fines.filter(fine => {
                    const fineCreatedTime = new Date(fine.created_at).getTime();
                    return fineCreatedTime > parseInt(lastCheckTime);
                });
                
                // Create notifications for new fines
                newFines.forEach(fine => {
                    const notificationId = `fine-${fine.fine_id}`;
                    
                    // Check if we already have this notification
                    const existingNotification = notifications.find(n => n.id === notificationId);
                    
                    if (!existingNotification) {
                        // Get reason text
                        let reasonText = 'library policy violation';
                        if (fine.reason === 'Late') {
                            reasonText = 'late return';
                        } else if (fine.reason === 'Damaged') {
                            reasonText = 'item damage';
                        }
                        
                        // Add new notification
                        const newNotification = {
                            id: notificationId,
                            message: `A new fine of $${fine.amount} has been added to your account for ${reasonText}.`,
                            type: 'fine',
                            isRead: false,
                            createdAt: new Date()
                        };
                        
                        saveNotifications([newNotification, ...notifications]);
                        
                        // If total fines exceed $25, add a warning
                        const totalUnpaidFines = fines
                            .filter(f => f.fine_status === 2) // 2 = Unpaid
                            .reduce((sum, f) => sum + f.amount, 0);
                        
                        if (totalUnpaidFines >= 25) {
                            const warningId = `fine-warning-${Date.now()}`;
                            
                            const warningNotification = {
                                id: warningId,
                                message: 'Your total unpaid fines now exceed $25. You cannot check out or place holds on items until your fines are paid.',
                                type: 'fine_warning',
                                isRead: false,
                                createdAt: new Date()
                            };
                            
                            saveNotifications([warningNotification, ...notifications]);
                        }
                    }
                });
                
                // Update last check time
                localStorage.setItem('lastFineCheck', Date.now().toString());
                
            } catch (error) {
                console.error("Error checking for new fines:", error);
            }
        };
        
        // Check for new fines on component mount
        checkForNewFines();
        
        // Set up interval for periodic checks
        const fineCheckInterval = setInterval(checkForNewFines, 3600000); // Check every hour
        
        return () => {
            clearInterval(fineCheckInterval);
        };
    }, [notifications]);
    
    const markAsRead = (notificationId) => {
        const updatedNotifications = notifications.map(n => 
            n.id === notificationId 
                ? { ...n, isRead: true } 
                : n
        );
        
        saveNotifications(updatedNotifications);
    };
    
    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        saveNotifications(updatedNotifications);
    };
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    // Format the notification timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHrs < 24) {
            return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };
    
    // Clean up old notifications (older than 7 days)
    useEffect(() => {
        const cleanupNotifications = () => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const updatedNotifications = notifications.filter(notification => 
                new Date(notification.createdAt) > sevenDaysAgo
            );
            
            if (updatedNotifications.length !== notifications.length) {
                saveNotifications(updatedNotifications);
            }
        };
        
        cleanupNotifications();
        
        // Run cleanup daily
        const cleanupInterval = setInterval(cleanupNotifications, 86400000); // 24 hours
        
        return () => {
            clearInterval(cleanupInterval);
        };
    }, [notifications]);

    return (
        <div className="notifications-container">
            <button 
                className="notifications-bell"
                onClick={toggleDropdown}
            >
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>
            
            {showDropdown && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                className="mark-all-read"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="notifications-list">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''} ${notification.type}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatTime(notification.createdAt)}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="unread-dot"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                No notifications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;