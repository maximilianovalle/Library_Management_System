import "./Header.css";
import { Link, useParams } from 'react-router-dom';

const Header = () => {
    const { userId } = useParams();

    const loggedInItems = [
        { title: "My Books", link: `/mybooks/${userId}` },
        { title: "Browse Books", link: "/browsebooks" },
        { title: "Browse Devices", link: "/browsedevices" },
        { title: "Account", link: `/account` }
    ];

    const guestItems = ["My Books", "Browse Books", "Browse Devices"];

    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        {/* routing depends on if logged in */}
                        <Link to={userId ? `/user/${userId}` : "/login"}>
                            <img src="/logo.png" alt="Logo" />
                        </Link>
                        <h1>Cougar Public Library</h1>
                    </div>

                    <div className="nav-links">
                        {userId ? (
                            <>
                                {loggedInItems.map((item) => (
                                    <Link key={item.title} to={item.link} className="link">
                                        {item.title}
                                    </Link>
                                ))}
                                <button
                                    className="logout_button"
                                    onClick={() => {
                                        localStorage.clear();
                                        // sends to login page
                                        window.location.href = "/login";
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {guestItems.map((item) => (
                                    <a key={item} href="/" className="link">
                                        {item}
                                    </a>
                                ))}
                                <Link className="button" to="/login">Log in</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
