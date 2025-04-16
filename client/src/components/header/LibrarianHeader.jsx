import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./LibrarianHeader.css";

const LibrarianHeader = () => {
    const location = useLocation();

    const navItems = [
        { title: "Dashboard", link: "/librarian" },
        { title: "Manage Books", link: "/librarian/manage-books" },
        { title: "Manage Devices", link: "/librarian/manage-devices" },
        { title: "Holds", link: "/librarian/holds" },
        { title: "Fines", link: "/librarian/fines" },
        { title: "Account", link: "/librarian_account" }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <header className="librarian-header">
            <div className="librarian-container">
                <nav className="librarian-nav">
                    <div className="librarian-logo">
                        <Link to="/librarian">
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
                                    location.pathname === (item.link) ? "active" : ""
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

export default LibrarianHeader;
