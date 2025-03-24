import React from "react";
import axios from "axios";
import { useState, useEffect} from 'react';
import './browsebooks.css';
import { useParams } from 'react-router-dom'; //for router change
// import Header_after from "../../components/header/Header_after";

const items = [
    {title: "My Books", link: "/mybooks"},
    {title: "Browse Books", link: "/browsebooks"},
    {title: "Browse Devices",link: "/browsedevices"},
    {title: "Account", link: "/account"},
    // {title: "Account", link: `/account/${userId}`}, i think we should change this for account too

]

const BrowseBooks = () => {
const { userId } = useParams();

const [search_value, setSearchValue] = useState("");
const [ISBN, setISBN] = useState("");
const [tile, setTitle] = useState("");
const [genre, setGenre] = useState("");
const [year, setYear] = useState("");
const [author, setAuthor] = useState("");
const [image, setImage] = useState("");
const [similar_book_array, setSimilar_books] = useState("");

const fetchBook = async () => {

    try {
        const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

        // if ( no token )
        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        // sends a GET request to /account including token
        const res = await axios.get("http://localhost:8000/books", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

    } catch (error) {
        console.error("Error fetching books:", error);
    }

}
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
            </div>
        </header>


                {/* WE SHOULD PROBABLY ADD THE HEADER WITHOUT LOG IN AS ITS OWN FUNCTION AND CALL THAT FUNCTION INTO THE PAGES THAT NEED IT*/}
                <div className="search">
                    {/* <button className="search_button">Browse By</button> */}
                    {/* Need to add a browse by butt*/}
        
                    <input
                        className="search_bar"
                        type="text"
                        label="Search"
                        placeholder="Search"
                        variant="outlined"
                        value={search_value}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button type="submit" style={{cursor: "pointer"}} className = "search_button" onClick={fetchBook()}>Search</button>
                </div>
            
                <div className ="container">
                    <div className="user">
                        <h2>Welcome</h2>
                    </div>
                    
            </div>
        </div>
    );
}

export default BrowseBooks