import React from "react";
import axios from "axios";
import { useState} from 'react';
import './browsebooks.css';
import DropDown from './components/drop_down';

// import Header_after from "../../components/header/Header_after";

// THIS IS ONLY FOR HEADERS
const items = [
    {title: "My Books", link: "/mybooks"},
    {title: "Browse Books", link: "/browsebooks"},
    {title: "Browse Devices",link: "/browsedevices"},
    {title: "Account", link: "/account"},
    // {title: "Account", link: `/account/${userId}`}, i think we should change this for account too

]
// THIS IS FOR THE DROP DOWN MENU
const browse_by =["Title","ISBN", "Author","Genre"]

// THIS IS FOR THE DIFFERENT TYPES OF GENRES THE USER CAN SELECT FROM
// const genres = [
//     {genre : "Accounting" }, {genre : "Adventure"}, {genre : "History"}, {genre : "Arts"}, {genre : "Biomaterials"}, {genre : "Cardiology"}, {genre : "Child research"}, {genre : "Classic"},
//     {genre : "Computer science"}, {genre: "Economics"}, {genre: "Educational"}, {genre: "Educational"}, {genre: "Fiction"}, {genre: "Genetics"}, {genre: "Geography"}, {genre: "Geometry"},
//     {genre: ""}, {genre: ""}, {genre: ""}, {genre: ""}, {genre: ""},
// ]

const BrowseBooks = () => {

// THIS IS TO SET THE VALUES FOR THE BOOK INFORMATION
const [search_value, setSearchValue] = useState("");
const [search_by, setSearchBy] = useState("");
// const [ISBN, setISBN] = useState("");
// const [tile, setTitle] = useState("");
// const [genre, setGenre] = useState("");
// const [year, setYear] = useState("");
// const [author, setAuthor] = useState("");
// const [image, setImage] = useState("");
// const [similar_book_array, setSimilar_books] = useState("");

const handleSelect = (selectedOption) => {
    setSearchBy(selectedOption);
}
  
const data = {
    search_value,
    search_by
}
console.log(search_value)
console.log(search_by)
// THIS IS TO FETCH THE BOOK INFORMATION FROM THE BACK END
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
        await axios.get("http://localhost:8000/books", data, {
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
                
                <div>
                    <form className="search" onSubmit={fetchBook()}>
                        
                        <input
                            className="search_bar"
                            type="text"
                            label="Search"
                            placeholder="Search ..." 
                            variant="outlined"
                            value={search_value}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button className= "search_button" type="submit" value="Send">Search</button>
                    </form>
                    <div className="search">
                        <DropDown options={browse_by} onSelect={handleSelect}/>
                            {/*ILL FIX THE DROP DOWN BUTTON POSITION LATER TT*/}
                    </div>
                </div>

                <div className="Display_container">
                    {/* THIS IS WHERE THE CODE TO DISPLAY THE RETRIEVED ITEMS WILL GO */}
                </div>
        </div>
    );
}

export default BrowseBooks