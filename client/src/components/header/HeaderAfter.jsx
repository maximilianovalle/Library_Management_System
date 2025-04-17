import "./HeaderAfter.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { IoIosNotifications } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md";
import { BsDot, BsCheck2All } from "react-icons/bs";

const HeaderAfter = () => {
    const location = useLocation();

    const navItems = [
        { title: "My Items", link: "/checkedout" },
        { title: "Browse Books", link: "/browsebooks" },
        { title: "Browse Devices", link: "/browsedevices" },
        { title: "Account", link: "/account" },
    ];

    const notifType = {
        "general": "General",
        "restriction_lifted": "Restrictions removed",
        "payment_success": "Successful payment",
    };

    const [unreadNotifsAmnt, setUnreadNotifsAmnt] = useState(0);
    // const [notifUnread, setNotifUnread] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsModal, setNotificationsModal] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getNotifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setNotifications(res.data.notifications);
            setUnreadNotifsAmnt(res.data.unreadNotifsAmnt);
        } catch (error) {
            console.error("Error fetching notifications: ", error);
        }
    }

    const markAsRead = async (notification) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }
        
        const data = {
            id: notification.id,
        }

        try {

            await axios.put(`${process.env.REACT_APP_API_URL}/markAsRead`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.log("Error marking notif as read: ", error);
        }

        // await fetchNotifications();
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }

        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="librarian-header">
            <div className="librarian-container">
                <nav className="librarian-nav">
                    <div className="librarian-logo">
                        <Link to="/browsebooks">
                            <img src="/logo.png" alt="Library Logo" />
                        </Link>
                        <h1>Cougar Library</h1>
                    </div>

                    <div className="librarian-links">
                        {navItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.link}
                                className={`librarian-link ${
                                    location.pathname.startsWith(item.link) ? "active" : ""
                                }`}
                            >
                                {item.title}
                            </Link>
                        ))}

                        {unreadNotifsAmnt > 0 ? (
                            <button onClick={async () => {
                                await fetchNotifications();
                                setNotificationsModal(true);
                            }} class="redAlert noStyleBtn"><MdNotificationsActive /></button>
                        ) : (
                            <button onClick={async () => {
                                await fetchNotifications();
                                setNotificationsModal(true);
                            }} class="noStyleBtn"><IoIosNotifications /></button>
                        )}

                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>

                    {/* notifications modal */}

                    {notificationsModal && (
                        <div className="modal-overlay" onClick={() => setNotificationsModal(false)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                            <span className="modal-close" onClick={() => setNotificationsModal(false)}>&times;</span>

                            <h2 className="modalHeader">Notifications</h2>

                            {notifications.length > 0 ? (<div class="notificationScroll">

                                {/* notification box */}

                                {notifications.map((notification, index) => {

                                const notifUnread = notification.isRead === 0;
                                
                                return notifUnread ? (
                                
                                <div onClick={async () => {
                                    // mark notif as read + reflect change in modal
                                    await markAsRead(notification);
                                    setNotifications((prev) =>
                                    prev.map((notif) =>
                                        notif.id === notification.id ? { ...notif, isRead: 1 } : notif
                                    )
                                    );
                                }} className="notifBox notifBoxUnread">

                                    <div className="notifHeader">
                                        <div>
                                        <BsDot class="unreadNotifDot entryElement"/>
                                        <h3 class="unreadNotifTitle entryElement">{notifType[notification.type] || "Other"}</h3>
                                        </div>

                                        <h3 className="dateNotif">
                                        {new Date(notification.date).toLocaleString("en-CA", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }).replace(",", "")}
                                        </h3>
                                    </div>

                                    <div className="notifBody">

                                        <p>{notification.text}</p>

                                    </div>

                                </div>) : (

                                <div className="readNotifBox notifBox">

                                    <div className="notifHeader">
                                        <div id="forUnread">
                                        <span className="entryElement">read</span>
                                        <h3 class="entryElement">{notifType[notification.type] || "Other"}</h3>
                                        </div>

                                        <p className="dateNotif">
                                        {new Date(notification.date).toLocaleString("en-CA", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }).replace(",", "")}
                                        </p>
                                    </div>

                                    <div className="notifBody">

                                        <p>{notification.text}</p>

                                    </div>

                                </div>

                                )
                            
                                })}

                            </div>) : (
                                <div class="nothingFoundMsg">
                                    <p>No notifications found.</p>
                                </div>
                            )}

                        </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default HeaderAfter;