import "./HeaderAfter.css";
// Remove the useParams import since it's not being used
// import { useParams } from 'react-router-dom';

const HeaderAfter = () => {
    // Remove the unused userId variable
    // const { userId } = useParams();

    const loggedInItems = [
        { title: "My Books", link: `/mybooks` },
        { title: "Browse Books", link: `/browsebooks` },
        { title: "Browse Devices", link: `/browsedevices` },
        { title: "Account", link: `/account` }
    ];

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await fetch('https://library-management-system-8ktv.onrender.com/login', {
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