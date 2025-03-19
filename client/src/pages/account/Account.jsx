import React from "react";
import './Account.css';
import { useState } from 'react'; // allows us to track data or properties that need tracking in a function component

const Account = () => {

    const [email, updateEmail] = useState("");  // [current state, function that updates the state] = set to empty string

    return( // HTML -----

        <div id="body">

            <div id="header">
                <h1>Cougar Public Library</h1>

                <form>
                    <input type="text" placeholder="Search ..."/>
                    <button type="submit">Submit</button>
                </form>
            </div>

            <div id="main">

            </div>

        </div>

    );
}

export default Account