import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
// import ConfirmationDialog from "../../components/ConfirmationDialog";
import "./ManageBooks.css";

const ManageBooks = () => {
    return(
        <div>
            <Header />
            <h1>Manage Books</h1>
            <h2>I promise I will finish these tmr :D</h2>
        </div>
    )
};

export default ManageBooks;