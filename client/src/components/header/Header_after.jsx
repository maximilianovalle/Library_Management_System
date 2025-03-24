import React from 'react'



const items = [
    {title: "My Books", link: "/mybooks"},
    {title: "Browse Books", link: "/browsebooks"},
    {title: "Browse Devices",link: "/browsedevices"},
    {title: "Account", link: "/account"},
    // {title: "Account", link: `/account/${userId}`}, i think we should change this for account too

]
const Header_after = () => {

return(
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
                    {items.map((item) => (
                        <a key={item.title} href={item.link} className="link">
                            {item.title}
                        </a>
                    ))}
                    <button onClick={() => {localStorage.clear(); window.location.href = '/login';}} className = "logout_button">Logout</button>
                </div>
            </nav>
        </div>
    </header>
    )
};

export default Header_after
