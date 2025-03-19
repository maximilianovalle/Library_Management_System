import React, { useState } from "react";

const styles = {
    header: {
        paddingBottom: "24px",
        backgroundColor: "white"
    },
    container: {
        padding: "0 16px",
        maxWidth: "1280px",
        margin: "0 auto"
    },
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px"
    },
    logo: {
        display: "flex",
        alignItems: "center"
    },
    logoImg: {
        height: "40px"
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "40px"
    },
    link: {
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500",
        color: "black",
        transition: "color 0.3s"
    },
    linkHover: {
        color: "#2563eb"
    },
    button: {
        padding: "12px 16px",
        fontSize: "16px",
        fontWeight: "600",
        color: "white",
        backgroundColor: "#2563eb",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        transition: "background 0.3s"
    },
    buttonHover: {
        backgroundColor: "#1d4ed8"
    },
    mobileNav: {
        display: "block",
        padding: "16px",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "8px"
    },
    mobileLink: {
        display: "block",
        padding: "10px 0",
        fontSize: "16px",
        fontWeight: "500",
        color: "black",
        transition: "color 0.3s"
    },
    mobileButtonContainer: {
        padding: "16px",
        marginTop: "16px"
    }
};

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                {/* Desktop Nav */}
                <nav style={styles.nav}>
                    <div style={styles.logo}>
                        <a href="/">
                            <img src="/public/logo.png" alt="Logo" style={styles.logoImg} />
                        </a>
                    </div>

                    {/* Desktop Links */}
                    <div style={{ ...styles.navLinks, display: menuOpen ? "none" : "flex" }}>
                        {["My Books", "Browse Books", "Browse Devices"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                style={styles.link}
                                onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                                onMouseOut={(e) => (e.target.style.color = "black")}
                            >
                                {item}
                            </a>
                        ))}
                        <button
                            style={styles.button}
                            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                        >
                            Log in/Sign up
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {menuOpen && (
                    <nav style={styles.mobileNav}>
                        <div>
                            {["Features", "Solutions", "Resources", "Pricing"].map((item) => (
                                <a
                                    key={item}
                                    href="/"
                                    style={styles.mobileLink}
                                    onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
                                    onMouseOut={(e) => (e.target.style.color = "black")}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>
                        <div style={styles.mobileButtonContainer}>
                            <button
                                style={styles.button}
                                onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                                onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                            >
                                Get started now
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
