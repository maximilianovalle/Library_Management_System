import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    // Fetch notifications from server
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                return;
            }
            
            const response = await axios.get("https://library-management-system-8ktv.onrender.com/notifications", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.notifications.filter(n => !n.Is_Read).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    
    useEffect(() => {
        // Load notifications when component mounts
        fetchNotifications();
        
        // Set up intervals for periodic checks
        const notificationInterval = setInterval(fetchNotifications, 300000); // Check every 5 minutes
        
        // Click outside to close dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            clearInterval(notificationInterval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.put("https://library-management-system-8ktv.onrender.com/notifications/read", 
                { notification_id: notificationId },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            // Update notifications in state
            setNotifications(notifications.map(n => 
                n.Notification_ID === notificationId 
                    ? { ...n, Is_Read: 1 } 
                    : n
            ));
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };
    
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            
            await axios.put("https://library-management-system-8ktv.onrender.com/notifications/read-all", 
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            // Update all notifications in state
            setNotifications(notifications.map(n => ({ ...n, Is_Read: 1 })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };
    
    const toggleDropdown = () => {
        if (!showDropdown) {
            // Fetch latest notifications when opening dropdown
            fetchNotifications();
        }
        setShowDropdown(!showDropdown);
    };
    
    // Determine notification type based on message content
    const getNotificationType = (message) => {
        if (message.includes('due in')) return 'due_date';
        if (message.includes('fine')) return 'fine';
        if (message.includes('exceed $25')) return 'fine_warning';
        return 'general';
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

    return (
        <div className="notifications-container" ref={dropdownRef}>
            <button 
                className="notifications-bell"
                onClick={toggleDropdown}
                aria-label="Notifications"
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
                                    key={notification.Notification_ID}
                                    className={`notification-item ${notification.Is_Read ? '' : 'unread'} ${getNotificationType(notification.Message)}`}
                                    onClick={() => markAsRead(notification.Notification_ID)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-message">
                                            {notification.Message}
                                        </div>
                                        <div className="notification-time">
                                            {formatTime(notification.Created_At)}
                                        </div>
                                    </div>
                                    {!notification.Is_Read && (
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