import React from "react";
import { useState } from 'react';
import './UserPage.css';
import { useParams } from 'react-router-dom'; //for router change

const UserPage = () => {
const { userId } = useParams();

const items = [
    {title: "My Books", link: `/mybooks/${userId}`},
    {title: "Browse Books", link: "/browsebooks"},
    {title: "Browse Devices",link: "/browsedevices"},
    {title: "Account", link: "/account"},
    // {title: "Account", link: `/account/${userId}`}, i think we should change this for account too

]

const [search, setSearch] = useState("");
console.log(search);
    return(
    <div id="body">

        {/* header code credit to @ alan "atonyit" */}
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
                    <div className="search">
                        <button className="search_button">Browse By</button>
                        {/* Need to add a browse by butt*/}
           
                        <input
                            className="search_bar"
                            type="text"
                            label="Search"
                            placeholder="Search"
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" style={{cursor: "pointer"}} className = "search_button">Search</button>
                    </div>
               
                    <div className ="container">
                        <div className="user">
                            <h2>Welcome User #{userId}</h2>
                        </div>


                    </div>
                </div>
            </header>

            {/* User Page */}
        </div>

    );
}

export default UserPage