import "./HeaderAfter.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const HeaderAfter = () => {
    const location = useLocation();

    const navItems = [
        { title: "My Books", link: "/mybooks" },
        { title: "Browse Books", link: "/browsebooks" },
        { title: "Browse Devices", link: "/browsedevices" },
        { title: "Account", link: "/account" }
    ];

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
                        <h1>Cougar Public Library</h1>
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
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeaderAfter;
