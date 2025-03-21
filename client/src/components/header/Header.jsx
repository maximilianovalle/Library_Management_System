import "./Header.css";
const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" />
                        </a>
                        <h1>Cougar Public Library</h1>
                    </div>

                    <div className={`nav-links`}>
                        {["My Books", "Browse Books", "Browse Devices"].map((item) => (
                            <a key={item} href="/" className="link">
                                {item}
                            </a>
                        ))}
                        <button className="button">Log in</button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
