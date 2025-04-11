import "./Header.css";
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const items = [
        { title: "My Items", link: `/checkedout` },
        { title: "Browse Books", link: `/browsebooks` },
        { title: "Browse Devices", link: `/browsedevices` },
        { title: "Account", link: `/account` }
    ];

    // const guestItems = ["My Books", "Browse Books", "Browse Devices"];

    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        {/* routing depends on if logged in */}
                        <img src="/logo.png" alt="Logo" />
                        <h1>Cougar Public Library</h1>
                    </div>

                    <div className="nav-links">
                        <>
                            {items.map((item) => (
                                <Link key={item.title} to={item.link} className="link">
                                    {item.title}
                                </Link>
                            ))}
                            <Link className="button" to="/login">
                                Login
                            </Link>
                        </>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;