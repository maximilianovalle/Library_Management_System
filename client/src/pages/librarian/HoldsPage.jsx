import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const HoldsPage = () => {

    return (
        <div>
            <Header />
            <h1>Manage Holds</h1>
            <h2>I promise I will finish these tmr :D</h2>
        </div>
    );
};

export default HoldsPage;
