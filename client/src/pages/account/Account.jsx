import React from "react";
import './Account.css';
import { useState } from 'react'; // allows us to track data or properties that need tracking in a function component

const Account = () => {

    // [current state, function that updates the state] = set to empty string
    const [search, submitSearch] = useState("");
    const [email, updateEmail] = useState(""); 

    return( // HTML -----

        <div id="body">

            {/* top header */}
            <div id="header">
                <h1>Cougar Public Library</h1>

                {/* search bar */}
                <form>
                    <input type="text" placeholder="Search ..." value={ search } onChange={ (e) => submitSearch(e.target.value) }/>
                    <button type="submit">Submit</button>
                </form>
            </div>

            {/* main content */}
            <div id="main">

            </div>

        </div>

    );
}

export default Account