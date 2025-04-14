import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./LibrarianHeader.css";

const ManagerHeader = () => {
    const location = useLocation();

    const navItems = [
        { title: "Dashboard", link: "/manager" },
        { title: "Manage Librarians", link: "/manage-librarians" },
        { title: "Maintenance", link: "/maintenance" },
        { title: "Reports", link: "/reports" },
        // { title: "????", link: "/manager" }
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

export default ManagerHeader;