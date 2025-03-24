import "./HeaderAfter.css";
import { useParams } from 'react-router-dom';

const HeaderAfter = () => {
    const { userId } = useParams();

    const loggedInItems = [
        { title: "My Books", link: `/mybooks/${userId}` },
        { title: "Browse Books", link: `/browsebooks/${userId}` },
        { title: "Browse Devices", link: `/browsedevices/${userId}` },
        { title: "Account", link: `/account/${userId}` }
    ];

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await fetch("http://localhost:8000/logout", {
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
        <header className="header">
            <div className="container">
                <nav className="nav">
                    <div className="logo">
                        <a href="/">
                            <img src="/logo.png" alt="Logo" />
                        </a>
                        <h1>Cougar Public Library</h1>
                    </div>

                    <div className="nav-links">
                        {loggedInItems.map((item) => (
                            <a key={item.title} href={item.link} className="link">
                                {item.title}
                            </a>
                        ))}
                        <button onClick={handleLogout} className="logout_button">
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeaderAfter;
