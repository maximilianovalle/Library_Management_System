import React, { useState } from "react";
import axios from "axios";
import './browsebooks.css';
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
// THIS IS FOR THE DROP DOWN MENU
const browse_by = ["Title", "ISBN", "Author", "Genre"];
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
    };

    const data = {
        search_value,
        search_by
    };

    console.log(data.search_value);
    console.log(data.search_by);

    const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

    // if ( no token )
    if (!token) {
        console.error("No token found. Redirecting to login...");
        window.location.href = "/login";
        return;
    }

    const fetchBook = async (e) => {
        e.preventDefault(); //prevents page reload on submit

        try {
        // const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

        // // if ( no token )
        //     if (!token) {
        //         console.error("No token found. Redirecting to login...");
        //         window.location.href = "/login";
        //         return;
        //     }

            const response = await axios.get("http://localhost:8000/books", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    search_value: data.searchValue,
                    search_by: data.searchBy,
                }
            });

            console.log("Books fetched:", response.data);
            // TODO: update state with books here
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div id="body">
            <HeaderAfter />

            <div>
                <form className="search" onSubmit={fetchBook}>
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
};

export default BrowseBooks;
